import { keyframes } from '@mui/material';

/**
 * 스크롤 애니메이션
 */
export const scrollToBottomWithAnimation = () => {
  const scrollerEl = document.querySelector('[data-testid="virtuoso-scroller"]');
  if (!scrollerEl) return;

  const start = scrollerEl.scrollTop;
  const end = scrollerEl.scrollHeight - scrollerEl.clientHeight;
  const duration = 500;
  let startTime: number | null = null;

  const step = (timestamp: number) => {
    startTime ??= timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);

    const ease =
      progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    scrollerEl.scrollTop = start + (end - start) * ease;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
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
