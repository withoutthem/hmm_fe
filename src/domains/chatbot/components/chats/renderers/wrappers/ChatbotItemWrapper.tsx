import { Box } from '@mui/material';
import { type ReactNode, useEffect, useRef, useState } from 'react';

type ChatbotItemWrapperProps = {
  children: ReactNode;
  isLastMessage: boolean;
  atBottom: boolean;
  lastDiffHeight: number | null;
};

const ChatbotItemWrapper = (props: ChatbotItemWrapperProps) => {
  const { isLastMessage, atBottom } = props;
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // 마지막 메시지는 항상 '펼침' (높이 보정)
  useEffect(() => {
    if (!isLastMessage) return;
    setExpanded(true);
  }, [isLastMessage]);

  // transitionend는 레이아웃 완료 신호만 캡처(스크롤은 메인에서만)
  useEffect(() => {
    if (!ref.current || !isLastMessage) return;
    const el = ref.current;

    const handleTransitionEnd = () => {
      // console.debug('ChatbotItemWrapper: transition end');
      // 여기서 스크롤 호출 금지. (메인에서 단일 제어)
    };

    el.addEventListener('transitionend', handleTransitionEnd);
    return () => el.removeEventListener('transitionend', handleTransitionEnd);
  }, [isLastMessage]);

  // 바닥일 때만 transition을 켜서 재측정 튐 최소화
  const enableTransition = isLastMessage && atBottom;

  return (
    <Box
      ref={ref}
      component="section"
      className={'chatbot_item_wrapper'}
      sx={{
        minHeight: isLastMessage ? (expanded ? (props.lastDiffHeight ?? 0) : 0) : 0,
        transition: enableTransition ? 'min-height .45s cubic-bezier(.22,.9,.3,1)' : 'none',
      }}
    >
      {props.children}
    </Box>
  );
};

export default ChatbotItemWrapper;
