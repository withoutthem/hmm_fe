// src/domains/chatbot/components/chats/business/implementations/DefaultBusinessFallback.tsx
import { Box } from '@mui/material';
import type { BusinessPayload } from '../types/businessType';

const DefaultBusinessFallback = ({ data }: { data?: BusinessPayload }) => {
  return (
    <Box sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      로딩
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {safeStringify(data)}
      </pre>
    </Box>
  );
};

export default DefaultBusinessFallback;

const safeStringify = (v: unknown) => {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
};
