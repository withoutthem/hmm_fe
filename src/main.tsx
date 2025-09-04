import { createRoot } from 'react-dom/client'
import App from './App'
import '@assets/fonts/pretendard/pretendard.css'
import '@assets/fonts/notoSans/notoSansKR.css'
import '@styles/reset.css'
import '@styles/global.css'

createRoot(document.getElementById('root')!).render(<App />)
