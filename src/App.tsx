import { CssBaseline } from '@mui/material';
import ApplicationProvider from './app/providers/ApplicationProvider';
import Layout from '@domains/common/components/Layout';
import MainPage from '@pages/MainPage';

function App() {
  return (
    <ApplicationProvider>
      <CssBaseline />
      <Layout>
        <MainPage />
      </Layout>
    </ApplicationProvider>
  );
}
export default App;
