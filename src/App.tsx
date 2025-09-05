import { Box, Button, CssBaseline, Input, styled, TextField, Typography } from '@mui/material'
import ApplicationProvider from './app/providers/ApplicationProvider'
import ChatPage from '@pages/test/ChatPage'
import { useState } from 'react'
import { ColumnBox, FlexBox } from '@shared/ui/layoutUtilComponents'

export const chatMockData = [
  {
    id: 1,
    side: 'chatbot',
    text: '🌌 단편 소설 — 유리정원의 밤',
  },
  {
    id: 2,
    side: 'user',
    text: `도시는 늘 시끄러웠다. 자동차 경적, 사람들의 발소리, 광고판 불빛이 쉴 새 없이 흘렀다. 
하지만 도심 한가운데, 유리로 둘러싸인 오래된 정원은 그 모든 소음을 삼켜버린 듯 고요했다. 
민호는 그곳에 매일 밤 찾아왔다. 낮에는 대기업 사무실에서 하루 종일 수치와 보고서에 묻혀 
사는 사람이었지만, 밤의 유리정원에서는 단 하나의 방문자였다. 그는 벤치에 앉아 빛바랜 노트를 펼쳤다. 
그 노트에는 어린 시절의 꿈이 빼곡히 적혀 있었다.`,
  },
  {
    id: 3,
    side: 'chatbot',
    text: `‘천문학자가 되고 싶다.’ ‘세상의 별을 직접 보고 싶다.’ 민호는 한숨을 내쉬었다. 
현실은 달랐다. 별 대신 모니터를, 망원경 대신 마우스를 붙들고 살아가고 있었으니까. 
그때였다. 정원의 천장이 천천히 열리더니, 유리 위로 별빛이 쏟아져 내렸다. 
마치 오래 전 잊었던 꿈이 다시 현실로 내려오는 듯했다. 별빛 속에서 그는 희미하게 
한 소녀의 웃음을 보았다. 어린 시절, 함께 별을 보던 첫사랑이었다.`,
  },
  {
    id: 4,
    side: 'user',
    text: `“민호야, 별은 아직도 여기 있어.” 낯익은 목소리가 귓가에 울렸다. 
그 순간, 민호는 깨달았다. 잃어버린 건 시간이 아니라, 바라보는 용기였다. 
그날 이후로 그는 퇴근 후마다 작은 망원경을 들고 유리정원으로 향했다. 
도시의 불빛은 여전히 눈부셨지만, 그의 눈에는 다시 별이 보였다.`,
  },
  {
    id: 5,
    side: 'chatbot',
    text: `민호는 매일 밤 유리정원에 들렀다. 처음에는 단순히 별을 보기 위함이었지만, 
어느 순간부터는 무언가에 이끌리듯 정원을 찾았다. 노트에 적힌 오래된 꿈들을 한 장씩 
읽어 내려갈 때마다, 정원은 기묘하게 반응했다. “세계 여행하기”라는 글을 읽으면 벽면 
유리에 바다가 비쳤고, “우주선 타보기”라는 문장을 넘기자 머리 위로 은하수가 
소용돌이쳤다. 민호는 두려웠다. 마치 자신이 잊어버린 것들이 정원 속에서 되살아나는 듯했으니까. 
하지만 동시에 가슴이 뛰었다.`,
  },
]

function App() {
  const [isTest, setIsTest] = useState(true)

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
                  {chatMockData.map((msg) =>
                    msg.side === 'chatbot' ? (
                      <ChatbotBubble key={msg.id}>
                        <BubbleTypo>{msg.text}</BubbleTypo>
                      </ChatbotBubble>
                    ) : (
                      <UserBubble key={msg.id}>
                        <BubbleTypo>{msg.text}</BubbleTypo>
                      </UserBubble>
                    )
                  )}
                </ChatMessageCont>
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
