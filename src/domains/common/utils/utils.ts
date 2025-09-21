import { keyframes } from '@mui/material';
import DOMPurify from 'dompurify';

/**
 * ScrolltoBottom 애니메이션
 */
let __scrollRaf: number | null = null;

/** Virtuoso scroller를 항상 부드럽게 바닥으로 스크롤(바닥이어도 nudge 후 애니메이션) */
export const scrollToBottomWithAnimation = () => {
  const scrollerEl = document.querySelector(
    '[data-testid="virtuoso-scroller"]'
  ) as HTMLElement | null;
  if (!scrollerEl) return;

  const end = scrollerEl.scrollHeight - scrollerEl.clientHeight;
  let start = scrollerEl.scrollTop;
  let distance = end - start;

  // 이전 애니메이션 취소
  if (__scrollRaf) {
    cancelAnimationFrame(__scrollRaf);
    __scrollRaf = null;
  }

  // 이미(거의) 바닥이면 살짝 위로 당겼다가 내려오게 만들어 시각적 애니메이션 유지
  if (Math.abs(distance) < 2) {
    const nudge = Math.min(24, Math.max(8, Math.round(scrollerEl.clientHeight * 0.04)));
    start = Math.max(0, end - nudge);
    scrollerEl.scrollTop = start;
    distance = end - start;
  }

  const duration = 300;
  const t0 = performance.now();

  const step = (now: number) => {
    const t = Math.min((now - t0) / duration, 1);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    scrollerEl.scrollTop = start + distance * ease;

    if (t < 1) {
      __scrollRaf = requestAnimationFrame(step);
    } else {
      __scrollRaf = null;
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
