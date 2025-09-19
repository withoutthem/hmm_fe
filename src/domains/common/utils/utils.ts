import { keyframes } from '@mui/material';
import DOMPurify from 'dompurify';

/**
 * ScrolltoBottom 애니메이션
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
