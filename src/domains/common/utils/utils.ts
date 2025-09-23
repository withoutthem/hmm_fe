// utils.ts (전체 교체 버전)
import { keyframes } from '@mui/material';
import DOMPurify from 'dompurify';
import type { VirtuosoHandle } from 'react-virtuoso';

/** Virtuoso 내부 스크롤러 셀렉터 */
const SCROLLER_SELECTOR = '[data-testid="virtuoso-scroller"]';

/** 내부 상태(전역) */
let __scrollRaf: number | null = null;
let __cancelUserListeners: (() => void) | null = null;
let __animating = false;

/** 스크롤러 캐시(필요 시마다 querySelector 비용 줄이려면 간단 캐시 사용) */
let __scrollerCache: HTMLElement | null = null;
function getScroller(): HTMLElement | null {
  if (__scrollerCache && document.body.contains(__scrollerCache)) return __scrollerCache;
  __scrollerCache = document.querySelector(SCROLLER_SELECTOR) as HTMLElement | null;
  return __scrollerCache;
}

function cancelOngoing() {
  if (__scrollRaf) {
    cancelAnimationFrame(__scrollRaf);
    __scrollRaf = null;
  }
  if (__cancelUserListeners) {
    __cancelUserListeners();
    __cancelUserListeners = null;
  }
  __animating = false;
}

/** 유저가 휠/터치/키보드로 개입하면 즉시 취소 */
function onUserInterrupt(scroller: HTMLElement, onCancel: () => void) {
  let canceled = false;
  const cancelIfNeeded = () => {
    if (canceled) return;
    canceled = true;
    onCancel();
  };
  const opts: AddEventListenerOptions = { passive: true };

  const wheel = () => cancelIfNeeded();
  const touchstart = () => cancelIfNeeded();
  const mousedown = () => cancelIfNeeded();
  const keydown = () => cancelIfNeeded();

  scroller.addEventListener('wheel', wheel, opts);
  scroller.addEventListener('touchstart', touchstart, opts);
  scroller.addEventListener('mousedown', mousedown, opts);
  window.addEventListener('keydown', keydown, opts);

  return () => {
    scroller.removeEventListener('wheel', wheel, opts);
    scroller.removeEventListener('touchstart', touchstart, opts);
    scroller.removeEventListener('mousedown', mousedown, opts);
    window.removeEventListener('keydown', keydown, opts);
  };
}

/** n 프레임(rAF) 기다리기 — setTimeout 대신 프레임 동기화 */
function waitFrames(n: number): Promise<void> {
  return new Promise((resolve) => {
    let left = n;
    const tick = () => {
      left -= 1;
      if (left <= 0) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/** scrollHeight가 연속 frames 동안 안정화될 때까지 대기 (레이아웃/이미지/폰트 수렴) */
async function waitScrollHeightStable(
  el: HTMLElement,
  { frames = 3, timeoutMs = 220 }: { frames?: number; timeoutMs?: number } = {}
) {
  const start = performance.now();
  let stableCount = 0;
  let last = el.scrollHeight;

  while (stableCount < frames) {
    await waitFrames(1);
    const now = el.scrollHeight;
    if (now === last) {
      stableCount += 1;
    } else {
      stableCount = 0;
      last = now;
    }
    if (performance.now() - start > timeoutMs) break;
  }
}

/** 가상화로 아직 붙지 않았으면 붙을 때까지 대기 */
function waitForItemMount(index: number, maxFrames = 48): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    let frame = 0;
    const tick = () => {
      const scroller = getScroller();
      const el = scroller?.querySelector(`[data-item-index="${index}"]`) as HTMLElement | null;
      if (el) {
        resolve(el);
        return;
      }
      frame++;
      if (frame >= maxFrames) {
        resolve(null);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/** 최상단 정렬: 기존 instant(점프) 대신 아주 짧은 스무스 이동으로 "턱" 방지 */
function smoothAlignTop(scroller: HTMLElement, targetEl: HTMLElement, duration = 120) {
  const scRect = scroller.getBoundingClientRect();
  const elRect = targetEl.getBoundingClientRect();
  const delta = elRect.top - scRect.top;
  if (Math.abs(delta) < 1) return; // 사실상 정렬됨

  const start = scroller.scrollTop;
  const end = start + delta;
  const t0 = performance.now();

  const step = (now: number) => {
    const t = Math.min((now - t0) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
    scroller.scrollTop = start + (end - start) * ease;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** 하단까지 부드럽게 */
function animateToBottom(scroller: HTMLElement, duration = 320) {
  const start = scroller.scrollTop;
  const t0 = performance.now();

  const step = (now: number) => {
    if (!__animating) return;
    const t = Math.min((now - t0) / duration, 1);

    // 레이아웃 변동(예: min-height transition) 대응: 매 프레임 목표 갱신
    const end = scroller.scrollHeight - scroller.clientHeight;
    const dist = end - start;

    // easeInOutCubic
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    scroller.scrollTop = start + dist * ease;

    if (t < 1) {
      __scrollRaf = requestAnimationFrame(step);
    } else {
      scroller.scrollTop = end; // 정밀 스냅
      cancelOngoing();
    }
  };

  __animating = true;
  __cancelUserListeners = onUserInterrupt(scroller, cancelOngoing);
  __scrollRaf = requestAnimationFrame(step);
}

/**
 * 어디에 있든(맨위/중간/맨아래) → 마지막 메시지를
 * 1) 화면 최상단으로 "짧게 스무스 정렬" → 2) 바닥까지 부드럽게 이동
 *  - 맨 위일 때는 1프레임 + 30~40ms 정도만 양보
 *  - 안정화 프레임 3으로 딜레이 최소화
 */
export async function scrollLastMessageUserThenBottom(
  virtuoso: VirtuosoHandle | null,
  lastIndex: number,
  options: {
    delayOnTopMs?: number; // 맨 위일 때만 추가 지연
    durationMs?: number; // 하단 애니메이션 길이
    stableFrames?: number; // scrollHeight 안정화 프레임
  } = {}
) {
  const { delayOnTopMs = 40, durationMs = 320, stableFrames = 3 } = options;

  const scroller = getScroller();
  if (!scroller) return;

  cancelOngoing();

  // 맨 위 여부
  const atTop = scroller.scrollTop <= 2;

  // 가상화 프리렌더: 마지막 아이템 보장
  virtuoso?.scrollToIndex({ index: lastIndex, align: 'end', behavior: 'auto' });

  // 렌더 붙을 틈 + 맨 위일 때만 추가 지연
  if (atTop && delayOnTopMs > 0) {
    await waitFrames(1);
    await new Promise((r) => setTimeout(r, delayOnTopMs));
  } else {
    await waitFrames(1);
  }

  // 대상 엘 대기
  const targetEl = await waitForItemMount(lastIndex, 48);

  // 안정화(짧게)
  await waitScrollHeightStable(scroller, { frames: stableFrames, timeoutMs: 220 });

  // 1) 최상단 정렬(짧은 easeOut)
  if (targetEl) {
    smoothAlignTop(scroller, targetEl, 120);
    // 정렬 애니메이션이 끝나기 전에 다음 단계가 시작되면 끊겨 보일 수 있으니 2~3프레임만 양보
    await waitFrames(2);
  }

  // 2) 바닥으로 부드럽게 이동
  animateToBottom(scroller, durationMs);
}

/** (단독 하단 애니메이션 — 필요 시만 사용) */
export function scrollToBottomWithAnimation() {
  const scroller = getScroller();
  if (!scroller) return;

  cancelOngoing();

  // 거의 바닥이면 nudge
  const end0 = scroller.scrollHeight - scroller.clientHeight;
  let start = scroller.scrollTop;
  if (Math.abs(end0 - start) < 2) {
    const nudge = Math.min(24, Math.max(8, Math.round(scroller.clientHeight * 0.04)));
    start = Math.max(0, end0 - nudge);
    scroller.scrollTop = start;
  }

  __animating = true;
  __cancelUserListeners = onUserInterrupt(scroller, cancelOngoing);

  const duration = 280;
  const t0 = performance.now();

  const step = (now: number) => {
    if (!__animating) return;
    const t = Math.min((now - t0) / duration, 1);

    const end = scroller.scrollHeight - scroller.clientHeight; // 매 프레임 갱신
    const dist = end - start;

    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    scroller.scrollTop = start + dist * ease;

    if (t < 1) {
      __scrollRaf = requestAnimationFrame(step);
    } else {
      scroller.scrollTop = end;
      cancelOngoing();
    }
  };

  __scrollRaf = requestAnimationFrame(step);
}

/** 팝인 애니메이션(그대로 유지) */
export const popIn = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  60% { opacity: 1; transform: scale(1.05); }
  100% { transform: scale(1); }
`;

/** 텍스트 하이라이트 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;

  const before = text.substring(0, idx);
  const match = text.substring(idx, idx + query.length);
  const after = text.substring(idx + query.length);

  const highlighted = `${before}<span>${match}</span>${after}`;
  return DOMPurify.sanitize(highlighted);
}

/** Adaptive Card onSubmit */
export function onAdaptiveCardSubmit(data: Record<string, unknown>) {
  const formData = data as Record<string, string>;
  const startKeys = Object.keys(formData).filter((key) => key.startsWith('startTime'));
  for (const startKey of startKeys) {
    const regex = /^startTime(\d+)$/;
    const match = regex.exec(startKey);
    if (!match) continue;

    const num = match[1];
    const endKey = `endTime${num}`;

    if (endKey in formData) {
      const startVal = formData[startKey];
      const endVal = formData[endKey];

      if (startVal && endVal && startVal >= endVal) {
        alert('출차시간은 입차시간보다 뒤입니다.');
      }
    }
  }

  if (formData.action === 'cancle') {
    console.log('취소버튼누름', formData);
  } else {
    console.log('✅ 최종 formData:', formData);
  }
}
