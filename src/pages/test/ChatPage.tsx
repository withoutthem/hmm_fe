import { styled, Box, Button } from '@mui/material';
import Layout from '@domains/common/components/Layout';
import PublishFloating, { PublushButton } from '@pages/test/PublishFloating';
import useDialogStore from '@domains/common/ui/store/dialog.store';
import { FlexBox } from '@shared/ui/layoutUtilComponents';

const ChatPage = () => {
  const openDialog = useDialogStore((s) => s.openDialog);

  const onPublisherCheck = () => {
    const el = document.getElementById('publish');
    if (el) el.style.display = 'flex';
  };

  return (
    <>
      <Layout>
        <PublushButton onClick={onPublisherCheck}>Publish</PublushButton>

        <TestFlexBox>
          <Button variant="primary" onClick={() => openDialog('history')}>
            dialog
          </Button>
        </TestFlexBox>
      </Layout>
      <PublishFloating />
    </>
  );
};

export default ChatPage;

const TestFlexBox = styled(FlexBox)({
  position: 'fixed',
  top: '2px',
  left: '10px',
  gap: '8px',
});

export const ChatbotBubbleWrap = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
});
