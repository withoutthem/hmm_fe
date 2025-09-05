import { Box, Button, CssBaseline, Input, styled, TextField, Typography } from '@mui/material'
import ApplicationProvider from './app/providers/ApplicationProvider'
import ChatPage from '@pages/test/ChatPage'
import { useState } from 'react'
import { ColumnBox, FlexBox } from '@shared/ui/layoutUtilComponents'

function App() {
  const [messages, setMessages] = useState<{ type: 'chatbot' | 'user'; text: string }[]>([])
  const [liveChatInput, setLiveChatInput] = useState('')
  const [isTest, setIsTest] = useState(true)

  const handleSendLiveChat = () => {
    if (!liveChatInput.trim()) return
    setMessages([...messages, { type: 'user', text: liveChatInput }])
    setLiveChatInput('') // 입력창 초기화
  }

  return (
    <ApplicationProvider>
      <CssBaseline />

      <TestButton variant={'primary'} onClick={() => setIsTest((e) => !e)}>
        {isTest ? '생성형챗봇으로가기' : 'Test챗봇으로가기'}
      </TestButton>

      {isTest ? (
        <TestFlexBox>
          <Typography>공통설정값</Typography>
          <FlexBox>
            라벨
            <Input />
          </FlexBox>
          <Wrap>
            <ChatBox className={'chat-box'}>
              <ChatBoxCon>
                <TitleBox>
                  <Typography>라이브챗 Test</Typography>
                </TitleBox>
                <ChatMessageCont>
                  {messages.map((msg, i) =>
                    msg.type === 'chatbot' ? (
                      <ChatbotBubble key={i}>
                        <BubbleTypo>{msg.text}</BubbleTypo>
                      </ChatbotBubble>
                    ) : (
                      <UserBubble key={i}>
                        <BubbleTypo>{msg.text}</BubbleTypo>
                      </UserBubble>
                    )
                  )}
                </ChatMessageCont>
                <TextAreaBox>
                  <TextField
                    multiline
                    maxRows={5}
                    value={liveChatInput}
                    onChange={(e) => setLiveChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault() // 기본 줄바꿈 막기
                        handleSendLiveChat()
                      }
                    }}
                  />
                  <SendButton onClick={handleSendLiveChat}>전송</SendButton>
                </TextAreaBox>
              </ChatBoxCon>
            </ChatBox>

            <InputBox className={'input-box'}>
              <FlexBox>
                이메일 :
                <Input />
              </FlexBox>
              <FlexBox>
                USER ID :
                <Input />
              </FlexBox>
              <FlexBox>
                Label :
                <Input />
              </FlexBox>
              <FlexBox>
                Label :
                <Input />
              </FlexBox>
              <SendButton>전송</SendButton>
            </InputBox>

            <ChatBox className={'chat-box'}>
              <ChatBoxCon>
                <TitleBox>
                  <Typography>DapTalk Test</Typography>
                </TitleBox>
                <ChatMessageCont>Bubble</ChatMessageCont>
                <TextAreaBox>
                  <TextField />
                  <SendButton>전송</SendButton>
                </TextAreaBox>
              </ChatBoxCon>
            </ChatBox>

            <InputBox className={'input-box'}>
              <FlexBox>
                이메일 :
                <Input />
              </FlexBox>
              <FlexBox>
                USER ID :
                <Input />
              </FlexBox>
              <FlexBox>
                Label :
                <Input />
              </FlexBox>
              <FlexBox>
                Label :
                <Input />
              </FlexBox>
              <SendButton>전송</SendButton>
            </InputBox>

            <ChatBox className={'chat-box'}>
              <ChatBoxCon>
                <TitleBox>
                  <Typography>실제화면</Typography>
                </TitleBox>
                <ChatMessageCont>Bubble</ChatMessageCont>
                <TextAreaBox>
                  <TextField />
                  <SendButton>전송</SendButton>
                </TextAreaBox>
              </ChatBoxCon>
            </ChatBox>
          </Wrap>
        </TestFlexBox>
      ) : (
        <ChatPage />
      )}
    </ApplicationProvider>
  )
}

export default App

const TestButton = styled(Button)({
  position: 'fixed',
  top: '0',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'red',
})

const TestFlexBox = styled(ColumnBox)({
  width: '100vw',
  height: '100vh',
  padding: '8px',
  gap: '8px',
})

const Wrap = styled(FlexBox)({
  display: 'flex',
  gap: '4px',
  flex: '1',
  overflow: 'hidden',
})

const ChatBox = styled(ColumnBox)({
  height: '100%',
  flex: '1',
})

const ChatBoxCon = styled(ColumnBox)({
  flex: '1',
  border: '1px solid #ccc',
  borderRadius: 8,
  height: '100%',
  overflow: 'hidden',
})

const TitleBox = styled(Box)({
  padding: '4px 4px 4px 8px',
})

const ChatMessageCont = styled(ColumnBox)({
  flex: '1',
  padding: '8px',
  background: '#eee',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  gap: '8px',
})

const ChatbotBubble = styled(Box)({})

const BubbleTypo = styled(Typography)({
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 12,
  padding: '10px 12px',
  display: 'inline-block',
  maxWidth: '300px',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
})

const UserBubble = styled(Box)({ alignSelf: 'flex-end' })

const TextAreaBox = styled(FlexBox)({
  gap: '4px',
  padding: '6px',
  alignItems: 'center',
  borderTop: '1px solid',
  '&>div': { flex: '1' },
  '& input': { padding: '0' },
})

const SendButton = styled(Button)({
  width: 'fit-content',
  padding: '3px 12px',
  borderRadius: '4px',
  minWidth: 'auto',
  height: 'auto',
  background: 'black',
  color: 'white',
})

const InputBox = styled(ColumnBox)({
  paddingTop: '23px',
  gap: '8px',
  '&>button': { marginLeft: 'auto' },
})
