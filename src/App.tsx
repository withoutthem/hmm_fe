import { CssBaseline } from '@mui/material'
import ApplicationProvider from './app/providers/ApplicationProvider'
import Layout from './shared/components/Layout'
import MotionTestPage from '@pages/test/MotionTestPage'

function App() {
  return (
    <ApplicationProvider>
      <CssBaseline />
      <Layout>
        {/*<TestPage />*/}
        {/*<WebSocketTestPage />*/}
        <MotionTestPage />
      </Layout>
    </ApplicationProvider>
  )
}

export default App
