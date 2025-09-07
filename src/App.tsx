import { Box, Button, CssBaseline, Input, styled, TextField, Typography } from '@mui/material'
import ApplicationProvider from './app/providers/ApplicationProvider'
import ChatPage from '@pages/test/ChatPage'
import { useState } from 'react'
import { ColumnBox, FlexBox } from '@shared/ui/layoutUtilComponents'
import { Virtuoso } from 'react-virtuoso'

function App() {
  const [messages, setMessages] = useState<{ type: 'chatbot' | 'user'; text: string }[]>([])
  const [liveChatInput, setLiveChatInput] = useState('')
  const [isTest, setIsTest] = useState(true)
  const [isError, setIsError] = useState(false)

  if (isError) {
    throw new Error('렌더링 중에 발생한 에러! (ErrorBoundary에서 잡힘)')
  }

  const handleSendLiveChat = () => {
    if (!liveChatInput.trim()) return
    setMessages([...messages, { type: 'user', text: liveChatInput }])
    setLiveChatInput('') // 입력창 초기화
  }

  return (
    <ApplicationProvider>
      <CssBaseline />

      <TextBox>
        <Button sx={{ background: 'red' }} variant={'primary'} onClick={() => setIsTest((e) => !e)}>
          {isTest ? '생성형챗봇으로가기' : 'Test챗봇으로가기'}
        </Button>
        <Button sx={{ background: 'blue' }} variant={'primary'} onClick={() => setIsError(true)}>
          에러 발생 테스트
        </Button>
      </TextBox>

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
                  <Virtuoso
                    data={messages}
                    overscan={0}
                    itemContent={(index, m) => {
                      if (m.type === 'user') {
                        return (
                          <UserBubble key={index}>
                            <BubbleTypo>{m.text}</BubbleTypo>
                          </UserBubble>
                        )
                      }
                      if (m.type === 'chatbot') {
                        return (
                          <ChatbotBubble key={index}>
                            <BubbleTypo>{m.text}</BubbleTypo>
                          </ChatbotBubble>
                        )
                      }
                    }}
                  />
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
              <DataWrap>
                <Typography>보낸데이터</Typography>
                <DataViewer>
                  {messages.map((msg, idx) => (
                    <div key={idx}>
                      {msg.text.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </div>
                  ))}
                </DataViewer>
              </DataWrap>
              <DataWrap>
                <Typography>받은데이터</Typography>
                <DataViewer></DataViewer>
              </DataWrap>
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
              <DataWrap>
                <Typography>보낸데이터</Typography>
                <DataViewer></DataViewer>
              </DataWrap>
              <DataWrap>
                <Typography>받은데이터</Typography>
                <DataViewer></DataViewer>
              </DataWrap>
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

const TextBox = styled(Box)({
  position: 'fixed',
  top: '0',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '8px',
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

  '& >div[data-testid="virtuoso-scroller"]': {
    border: '1px solid',
    scrollbarWidth: 'thin',
  },

  '& div[data-testid="virtuoso-item-list"]': {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  '& div[data-testid="virtuoso-item-list"] > div': {
    display: 'flex',
    flexDirection: 'column',
  },
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

const DataWrap = styled(ColumnBox)({
  flex: '1',
  overflow: 'hidden',
  maxWidth: '270px',
})

const DataViewer = styled(Box)({
  background: '#fff',
  border: '1px solid black',
  overflowY: 'auto',
  padding: '8px',
  width: '100%',
  flex: '1',
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
