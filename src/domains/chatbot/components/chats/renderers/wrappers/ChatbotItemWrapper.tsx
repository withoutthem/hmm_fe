// src/domains/chatbot/components/chats/renderers/wrappers/ChatbotItemWrapper.tsx
import { Box } from '@mui/material';
import { type ReactNode } from 'react';

type ChatbotItemWrapperProps = {
  children: ReactNode;
  isLastMessage: boolean;
  lastDiffHeight: number | null;
};

const ChatbotItemWrapper = (props: ChatbotItemWrapperProps) => {
  const { isLastMessage } = props;

  return (
    <Box
      component="section"
      className="chatbot_item_wrapper"
      sx={{
        minHeight: isLastMessage ? Math.max(0, props.lastDiffHeight ?? 0) : 0,
      }}
    >
      {props.children}
    </Box>
  );
};

export default ChatbotItemWrapper;
