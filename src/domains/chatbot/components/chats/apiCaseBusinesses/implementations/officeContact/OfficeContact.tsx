// OfficeContact.tsx
import { Box } from '@mui/material';
import type { BusinessPayload } from '@domains/chatbot/components/chats/apiCaseBusinesses/types/businessType';

interface OfficeContactProps {
  data?: BusinessPayload; // data는 optional
}

export default function OfficeContact(props: Readonly<OfficeContactProps>) {
  const { data } = props;
  return <Box>{data && <pre>{JSON.stringify(data, null, 2)}</pre>}</Box>;
}
