import { keyframes } from '@mui/material';
import DOMPurify from 'dompurify';
import type { VirtuosoHandle } from 'react-virtuoso';

/**
 * ScrolltoBottom 애니메이션
 */
const SCROLLER_SELECTOR = '[data-testid="virtuoso-scroller"]';

let __scrollRaf: number | null = null;
let __cancelUserListeners: (() => void) | null = null;
let __animating = false;

function getScroller(): HTMLElement | null {
  return document.querySelector(SCROLLER_SELECTOR) as HTMLElement | null;
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

function onUserInterrupt(scroller: HTMLElement, onCancel: () => void) {
  let canceled = false;
  const cancelIfNeeded = () => {
    if (canceled) return;
    canceled = true;
    onCancel();
  };

  const opts = { passive: true } as AddEventListenerOptions;

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

/** n 프레임(rAF) 기다리기 */
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

/** scrollHeight가 연속 frame 동안 안정화될 때까지 기다리기 (레이아웃/이미지/폰트 수렴) */
async function waitScrollHeightStable(
  el: HTMLElement,
  { frames = 2, timeoutMs = 250 }: { frames?: number; timeoutMs?: number } = {}
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

/** target index가 가상화로 아직 안 붙어 있으면 붙을 때까지 대기 */
function waitForItemMount(index: number, maxFrames = 60): Promise<HTMLElement | null> {
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

function instantAlignTop(scroller: HTMLElement, targetEl: HTMLElement) {
  const scRect = scroller.getBoundingClientRect();
  const elRect = targetEl.getBoundingClientRect();
  const delta = elRect.top - scRect.top;
  scroller.scrollTop += delta; // 즉시 최상단 정렬
}

function animateToBottom(scroller: HTMLElement, duration = 380) {
  const start = scroller.scrollTop;
  const startTime = performance.now();

  const step = (now: number) => {
    if (!__animating) return;
    const t = Math.min((now - startTime) / duration, 1);

    // 레이아웃 변동(가상 섹션 min-height 등) 대응: 매 프레임 목표 갱신
    const end = scroller.scrollHeight - scroller.clientHeight;
    const dist = end - start;

    // easeInOutCubic
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    scroller.scrollTop = start + dist * ease;

    if (t < 1) {
      __scrollRaf = requestAnimationFrame(step);
    } else {
      // 마지막 정밀 스냅
      scroller.scrollTop = end;
      cancelOngoing();
    }
  };

  __animating = true;
  __cancelUserListeners = onUserInterrupt(scroller, cancelOngoing);
  __scrollRaf = requestAnimationFrame(step);
}

/**
 * 어디에 있든(맨위/중간/맨아래) → 마지막 메시지를
 * 1) 화면 최상단에 스냅 → 2) 바닥까지 부드럽게 이동
 * - 맨 위에 있을 때 "턱" 방지를 위해: 지연 + 안정화 프레임 대기 후 진행
 * - 마지막 아이템이 아직 렌더 전이면 먼저 강제 렌더 확보
 */
export async function scrollLastMessageUserThenBottom(
  virtuoso: VirtuosoHandle | null,
  lastIndex: number,
  options: {
    /** 맨 위일 때만 추가로 기다릴 지연(ms) */
    delayOnTopMs?: number;
    /** 최상단 스냅 후 바닥으로 갈 때 애니메이션 길이(ms) */
    durationMs?: number;
    /** 안정화 프레임 수(연속 동일 scrollHeight) */
    stableFrames?: number;
  } = {}
) {
  const { delayOnTopMs = 48, durationMs = 380, stableFrames = 2 } = options;

  const scroller = getScroller();
  if (!scroller) return;

  // 이전 애니메이션 취소
  cancelOngoing();

  // 0) 맨 위 여부 판단
  const atTop = scroller.scrollTop <= 2;

  // 1) 가상화 프리렌더: 마지막 아이템이 보장되도록 강제 스냅(end/auto)
  virtuoso?.scrollToIndex({
    index: lastIndex,
    align: 'end',
    behavior: 'auto',
  });

  // 2) 렌더/측정이 붙을 시간을 약간 줌 + 아이템 마운트 대기
  //    맨 위일 때만 추가 지연(딜레이)로 "턱" 방지
  if (atTop && delayOnTopMs > 0) {
    await waitFrames(1); // 한 프레임 양보
    await new Promise((r) => setTimeout(r, delayOnTopMs));
  } else {
    await waitFrames(1);
  }

  const targetEl = await waitForItemMount(lastIndex, 60);
  // 렌더가 아주 늦으면 그냥 하단 애니메이션만 수행
  if (!targetEl) {
    await waitScrollHeightStable(scroller, { frames: stableFrames, timeoutMs: 250 });
    animateToBottom(scroller, durationMs);
    return;
  }

  // 3) 레이아웃 안정화(연속 프레임 동일 height) 기다리기
  await waitScrollHeightStable(scroller, { frames: stableFrames, timeoutMs: 250 });

  // 4) 먼저 즉시 최상단 정렬
  instantAlignTop(scroller, targetEl);

  // 5) 다음 프레임에 바닥으로 부드럽게 이동
  await waitFrames(1);
  animateToBottom(scroller, durationMs);
}

/** (단독 하단 애니메이션 — 필요 시만 사용) */
export const scrollToBottomWithAnimation = () => {
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

  const duration = 300;
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
};

/**
 * 팝인 애니메이션
 */
export const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  60% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

/**
 * 텍스트에서 쿼리와 일치하는 부분을 하이라이트 처리
 */

export const highlightMatch = (text: string, query: string): string => {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;

  const before = text.substring(0, idx);
  const match = text.substring(idx, idx + query.length);
  const after = text.substring(idx + query.length);

  const highlighted = `${before}<span>${match}</span>${after}`;
  return DOMPurify.sanitize(highlighted);
};

/**
 * Adaptive Card onSubmit 이벤트 핸들러
 */
export const onAdaptiveCardSubmit = (data: Record<string, unknown>) => {
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

      console.log(`👉 비교: ${startKey}=${startVal}, ${endKey}=${endVal}`);

      if (startVal && endVal) {
        if (startVal >= endVal) {
          alert('출차시간은 입차시간보다 뒤입니다.');
        }
      }
    }
  }

  console.log('✅ 최종 formData:', formData);
};
