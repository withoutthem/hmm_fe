import { Box, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import ChatHistory from '@domains/chatbot/components/dialog/components/ChatHistory'

const HistoryDialog = () => {
  const [value, setValue] = useState(0)

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="채팅 이력" />
        <Tab label="공지사항" />
        <Tab label="공지 발송내역" />
      </Tabs>

      {value === 0 && <ChatHistory />}
      {value === 1 && <Box>공지사항</Box>}
      {value === 2 && <Box>공지발송내역</Box>}
    </Box>
  )
}

export default HistoryDialog
