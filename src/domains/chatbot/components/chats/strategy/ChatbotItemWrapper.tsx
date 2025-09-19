import { Box } from '@mui/material';
import { type ReactNode, useEffect, useRef, useState } from 'react';

type ChatbotItemWrapperProps = {
  children: ReactNode;
  isLastMessage: boolean;
  lastDiffHeight: number | null;
  scrollToBottom: () => void;
};

const ChatbotItemWrapper = ({
  children,
  isLastMessage,
  lastDiffHeight,
  scrollToBottom,
}: ChatbotItemWrapperProps) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLastMessage) {
      setExpanded(true);
      scrollToBottom();
    }
  }, [isLastMessage, scrollToBottom]);

  useEffect(() => {
    if (!ref.current || !isLastMessage) return;
    const el = ref.current;

    const handleTransitionEnd = () => {
      scrollToBottom();
    };

    el.addEventListener('transitionend', handleTransitionEnd);
    return () => el.removeEventListener('transitionend', handleTransitionEnd);
  }, [isLastMessage, scrollToBottom]);

  return (
    <Box
      ref={ref}
      component="section"
      sx={{
        minHeight: isLastMessage ? (expanded ? (lastDiffHeight ?? 0) : 0) : 0,
        transition: 'min-height .5s ease',
      }}
    >
      {children}
    </Box>
  );
};

export default ChatbotItemWrapper;
