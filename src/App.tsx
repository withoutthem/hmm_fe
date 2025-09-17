import { useState } from 'react';
import { Box, Button, CssBaseline, styled } from '@mui/material';
import ApplicationProvider from './app/providers/ApplicationProvider';
import ChatPage from '@pages/test/ChatPage';
import HighlighterTestPage from '@pages/test/HighlighterTestPage';
import TestPageV2 from '@pages/test/TestPageV2';
import GlobalDialog from '@domains/chatbot/components/dialog/GlobalDialog';
import { connectOnce } from '@shared/platform/stomp';
import SideBar from '@domains/common/components/sideBar/SideBar';
import GlobalMenu from '@domains/common/components/menu/GlobalMenu';

const testPageMapper = {
  test: <ChatPage />,
  test2: <TestPageV2 />,
  highlighter: <HighlighterTestPage />,
};

function App() {
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState<'test' | 'test2' | 'highlighter'>('test');
  if (isError) {
    throw new Error('렌더링 중에 발생한 에러! (ErrorBoundary에서 잡힘)');
  }

  const pageKeys = Object.keys(testPageMapper) as (keyof typeof testPageMapper)[];

  const switchPage = () => {
    setPage((p) => {
      const idx = pageKeys.indexOf(p);
      const nextIdx = (idx + 1) % pageKeys.length;
      return pageKeys[nextIdx] as (typeof pageKeys)[number];
    });
  };

  // WebSocket 연결 (StompProvider)
  connectOnce();

  return (
    <ApplicationProvider>
      <CssBaseline />

      <TextBox>
        <Button onClick={switchPage}>페이지 전환</Button>

        <Button onClick={() => setIsError(true)}>에러 발생</Button>
      </TextBox>

      {testPageMapper[page]}

      <GlobalDialog />
      <SideBar />
      <GlobalMenu />
    </ApplicationProvider>
  );
}

export default App;

const TextBox = styled(Box)({
  position: 'fixed',
  top: '5px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '4px',
  zIndex: '999',

  '& button': {
    padding: '4px',
    height: 'auto',
    background: 'black',
    borderRadius: '4px',
    color: 'white',
  },
});
