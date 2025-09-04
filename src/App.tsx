import { Button, CssBaseline, styled } from '@mui/material'
import ApplicationProvider from './app/providers/ApplicationProvider'
import Layout from './shared/components/Layout'
// import MotionTestPage from '@pages/test/MotionTestPage'
import { WS_TEST_01, WS_TEST_02 } from '@domains/common/components/testData'
import PublishFloating, { PublushButton } from '@pages/test/PublishFloating'
import { FlexBox } from '@shared/ui/layoutUtilComponents'
import { useState } from 'react'
import MarkDownAnimator from '@pages/test/MarkDownAnimator'

function App() {
  const [tests, setTests] = useState<{ id: number; tokens: string[] }[]>([])

  const handleAddTest = (tokens: string[]) => {
    setTests((prev) => [
      ...prev,
      { id: Date.now(), tokens }, // 고유 id로 구분
    ])
  }

  return (
    <ApplicationProvider>
      <CssBaseline />
      <Layout>
        {/*<TestPage />*/}
        {/*<WebSocketTestPage />*/}
        {/*<MotionTestPage />*/}
        <PublushButton
          onClick={() => {
            const el = document.getElementById('publish')
            if (el) {
              el.style.display = 'flex'
            }
          }}
        >
          Publish
        </PublushButton>

        <TestFlexBox>
          <Button variant="primary" onClick={() => handleAddTest(WS_TEST_01)}>
            WS_TEST_01
          </Button>
          <Button variant="primary" onClick={() => handleAddTest(WS_TEST_02)}>
            WS_TEST_02
          </Button>
        </TestFlexBox>

        {tests.map((test) => (
          <MarkDownAnimator key={test.id} tokens={test.tokens} speed={20} />
        ))}
      </Layout>

      <PublishFloating />
    </ApplicationProvider>
  )
}

export default App

const TestFlexBox = styled(FlexBox)({
  position: 'fixed',
  top: '2px',
  left: '10px',
  gap: '8px',
})
