// src/domains/chatbot/components/chats/business/implementations/DefaultBusinessFallback.tsx
import { Box } from '@mui/material';
import type { BusinessPayload } from '../types/businessType';
import LoadingBubble from '@domains/chatbot/components/chats/renderers/bubbles/LoadingBubble';

const DefaultBusinessFallback = ({ data }: { data?: BusinessPayload }) => {
  return (
    <Box
      className={'default_business_fallback'}
      sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
    >
      <LoadingBubble />
    </Box>
  );
};

export default DefaultBusinessFallback;
