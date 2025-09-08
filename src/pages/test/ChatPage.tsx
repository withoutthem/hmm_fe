import { Button, styled, Box, CircularProgress } from '@mui/material'
import Layout from '@shared/components/Layout'
import { WS_TEST_01, WS_TEST_02 } from '@domains/common/components/testData'
import PublishFloating, { PublushButton } from '@pages/test/PublishFloating'
import { AlignCenter, FlexBox } from '@shared/ui/layoutUtilComponents'
import MarkDownAnimator from '@pages/test/MarkDownAnimator'
import useUIStore from '@domains/common/ui/store/ui.store'
import { useEffect, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'

const ChatPage = () => {
  const messages = useUIStore((s) => s.messages)
  const setMessages = useUIStore((s) => s.setMessages)

  // 테스트용 푸시 토큰 핸들러
  const onTestPushTokens = (tokens: string[]) => {
    setMessages([...messages, { id: Date.now(), sender: 'chatbot', type: 'message', tokens }])
  }

  // 퍼블리셔 컴포넌트 확인 핸들러
  const onPublisherCheck = () => {
    const el = document.getElementById('publish')
    if (el) {
      el.style.display = 'flex'
    }
  }

  const onFallbackTest = () => {
    setMessages([...messages, { id: Date.now(), sender: 'chatbot', type: 'fallback' }])
  }

  return (
    <>
      <Layout>
        {/*<TestPage />*/}
        {/*<WebSocketTestPage />*/}
        {/*<MotionTestPage />*/}
        <PublushButton onClick={onPublisherCheck}>Publish</PublushButton>

        {/* 테스트 버튼들 */}
        <TestFlexBox>
          <Button variant="primary" onClick={() => onTestPushTokens(WS_TEST_01)}>
            WS_TEST_01
          </Button>
          <Button variant="primary" onClick={() => onTestPushTokens(WS_TEST_02)}>
            WS_TEST_02
          </Button>
          <Button variant="primary" onClick={onFallbackTest}>
            Fallback Test
          </Button>
        </TestFlexBox>

        {/* 메세지 렌더링 */}
        <MessagesContainer>
          <Virtuoso
            data={messages}
            overscan={0} // 렌더링 범위
            itemContent={(index, m) => {
              if (m.sender === 'chatbot') {
                if (m.type === 'message') {
                  return (
                    <ChatbotBubbleWrap key={m.id}>
                      <DelayedRender delayMs={3000} placeholder={<LoadingBubble />}>
                        <MarkDownAnimator tokens={m.tokens ?? []} speed={20} />
                      </DelayedRender>
                    </ChatbotBubbleWrap>
                  )
                }
                if (m.type === 'fallback') {
                  return (
                    <ChatbotBubbleWrap key={m.id}>
                      <DelayedRender delayMs={3000} placeholder={<LoadingBubble />}>
                        <FallbackBubbleCon>🤖 Fallback 응답입니다.</FallbackBubbleCon>
                      </DelayedRender>
                    </ChatbotBubbleWrap>
                  )
                }
              }

              return (
                <UserBubbleWrap key={m.id}>
                  <UserBubbleCon>
                    {m.images?.length ? (
                      <UserImgBubble>
                        {m.images.map((file, idx) => (
                          <UserUpdateImgCon key={idx}>
                            <UserUpdateImg
                              src={URL.createObjectURL(file)}
                              alt={`user-${m.id}-${idx}`}
                            />
                          </UserUpdateImgCon>
                        ))}
                      </UserImgBubble>
                    ) : null}
                    {m.message && <UserTextBubble>{m.message}</UserTextBubble>}
                  </UserBubbleCon>
                </UserBubbleWrap>
              )
            }}
          />
        </MessagesContainer>
      </Layout>
      <PublishFloating />
    </>
  )
}

export default ChatPage

/** 일정 시간 후 children을 렌더링하고, 그 전엔 placeholder 표시 */
const DelayedRender = ({
  delayMs,
  children,
  placeholder,
}: {
  delayMs: number
  children: React.ReactNode
  placeholder?: React.ReactNode
}) => {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delayMs)
    return () => clearTimeout(t)
  }, [delayMs])
  return ready ? <>{children}</> : <>{placeholder ?? null}</>
}

/** 챗봇용 로딩 버블 */
const LoadingBubble = () => (
  <LoadingBubbleWrap>
    <LoadingBubbleCon>
      <AlignCenter>
        <CircularProgress size={16} />
        <span>로딩중…</span>
      </AlignCenter>
    </LoadingBubbleCon>
  </LoadingBubbleWrap>
)

const LoadingBubbleWrap = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
})

const LoadingBubbleCon = styled(Box)({
  width: 'auto',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 12,
  padding: '10px 12px',
})

const TestFlexBox = styled(FlexBox)({
  position: 'fixed',
  top: '2px',
  left: '10px',
  gap: '8px',
})

const MessagesContainer = styled(Box)({
  width: '100%',
  height: '100%',

  '& div[data-testid="virtuoso-scroller"]': {
    flex: '1',
    gap: '8px',
    scrollbarWidth: 'thin',
  },
})

const ChatbotBubbleWrap = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
})

const FallbackBubbleCon = styled(Box)({
  background: '#fff',
  borderRadius: 8,
  padding: '8px 12px',
})

const UserBubbleWrap = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '8px',
  alignItems: 'flex-end',
  gap: 8,
})

const UserBubbleCon = styled(Box)({
  maxWidth: '500px',
})

const UserImgBubble = styled(Box)({
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  maxWidth: 500,
})

const UserUpdateImgCon = styled(Box)({
  width: 120,
  height: 120,
  overflow: 'hidden',
  borderRadius: 8,
  border: '1px solid #e0e0e0',
})

const UserUpdateImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

const UserTextBubble = styled(Box)({
  maxWidth: 640,
  padding: '16px',
  borderRadius: '20px 0 20px 20px',
  fontSize: '15px',
  lineHeight: 1.4,
  background: '#E9ECEF',
  whiteSpace: 'pre-wrap',
})
