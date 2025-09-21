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

  // 마지막 메시지는 항상 '펼침' 상태로 전환 (스크롤 호출은 하지 않음)
  useEffect(() => {
    if (!isLastMessage) return;
    setExpanded(true);
  }, [isLastMessage]);

  // transitionend는 레이아웃 보정 용도이므로 로깅 정도만 허용
  useEffect(() => {
    if (!ref.current || !isLastMessage) return;
    const el = ref.current;

    const handleTransitionEnd = () => {
      // console.debug('ChatbotItemWrapper transitionend');
    };

    el.addEventListener('transitionend', handleTransitionEnd);
    return () => el.removeEventListener('transitionend', handleTransitionEnd);
  }, [isLastMessage]);

  const enableTransition = isLastMessage && atBottom;
  return (
    <Box
      ref={ref}
      component="section"
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
