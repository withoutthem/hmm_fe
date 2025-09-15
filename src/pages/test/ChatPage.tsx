import { Button, styled, Box } from '@mui/material'
import Layout from '@shared/components/Layout'
import { WS_TEST_01, WS_TEST_02 } from '@domains/common/components/testData'
import PublishFloating, { PublushButton } from '@pages/test/PublishFloating'
import { FlexBox } from '@shared/ui/layoutUtilComponents'
import useMessageStore, {
  type ChatbotFallback,
  type ChatbotLoading,
  type ChatbotMessage,
  type ChatMessage,
} from '@domains/common/ui/store/message.store'
import { Virtuoso } from 'react-virtuoso'
import type { VirtuosoHandle } from 'react-virtuoso'
import ChatbotMessageBubble from '@pages/test/components/ChatMessageBubble'
import ChatbotFallbackBubble from '@pages/test/components/ChatbotFallbackBubble'
import UserMessageBubble from '@pages/test/components/UserMessageBubble'
import useDialogStore from '@domains/common/ui/store/dialog.store'
import LoadingBubble from '@pages/test/components/LoadingBubble'
import { type ReactNode, useEffect, useRef, useState, useLayoutEffect } from 'react'

const ChatPage = () => {
  const messages = useMessageStore((s) => s.messages)
  const setMessages = useMessageStore((s) => s.setMessages)
  const [lastDiffHeight, setLastDiffHeight] = useState<number | null>(null)

  const messageContentRef = useRef<HTMLDivElement>(null)
  const heightsRef = useRef<Record<number, number>>({})
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const messageHeight = messageContentRef.current?.clientHeight ?? 0

  const openDialog = useDialogStore((s) => s.openDialog)

  // 스무스 스크롤 함수
  const smoothScrollToBottom = () => {
    const scrollerEl = document.querySelector('[data-testid="virtuoso-scroller"]')
    if (!scrollerEl) return

    const start = scrollerEl.scrollTop
    const end = scrollerEl.scrollHeight - scrollerEl.clientHeight
    const duration = 500
    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // easeInOutCubic
      const ease =
        progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

      scrollerEl.scrollTop = start + (end - start) * ease

      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  const showLoadingThenReplace = (replaceMsg: ChatbotMessage | ChatbotFallback, delay = 3000) => {
    const loadingMsg: ChatbotLoading = { sender: 'chatbot', type: 'loading' }
    setMessages([...messages, loadingMsg])

    setTimeout(() => {
      const prev = useMessageStore.getState().messages
      const newMessages = [...prev]
      newMessages[newMessages.length - 1] = replaceMsg
      setMessages(newMessages)
    }, delay)
  }

  const onTestPushTokens = (tokens: string[]) => {
    showLoadingThenReplace({ sender: 'chatbot', type: 'message', tokens })
  }

  const onPublisherCheck = () => {
    const el = document.getElementById('publish')
    if (el) el.style.display = 'flex'
  }

  const onFallbackTest = () => {
    showLoadingThenReplace({ sender: 'chatbot', type: 'fallback' })
  }

  // user 메시지 입력되면 chatbot 응답 시뮬레이션
  useEffect(() => {
    if (messages.length === 0) return
    const last = messages[messages.length - 1] as ChatMessage

    if (last.sender === 'user') {
      onTestPushTokens(WS_TEST_02)
    }
  }, [messages.length])

  // 높이 계산
  useLayoutEffect(() => {
    const messageHeight = messageContentRef.current?.clientHeight ?? 0
    const keys = Object.keys(heightsRef.current)

    if (keys.length > 0) {
      const lastIndex = Number(
        Object.keys(heightsRef.current)[Object.keys(heightsRef.current).length - 1]
      )
      const lastHeight = heightsRef.current[lastIndex] ?? 0

      console.log(heightsRef.current)

      console.log('lastHeight', `${messageHeight} - ${lastHeight} = ${messageHeight - lastHeight}`)

      setLastDiffHeight(messageHeight - lastHeight)
    }
  }, [messages.length])

  return (
    <>
      <Layout>
        <PublushButton onClick={onPublisherCheck}>Publish</PublushButton>

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
          <Button variant="primary" onClick={() => openDialog('history')}>
            dialog
          </Button>
        </TestFlexBox>

        <MessagesContainer ref={messageContentRef}>
          <Virtuoso
            ref={virtuosoRef}
            data={messages}
            overscan={0}
            itemContent={(index, m) => {
              if (m.sender === 'chatbot') {
                const isLastMessage = index === messages.length - 1

                return (
                  <ChatbotItemWrapper
                    isLastMessage={isLastMessage}
                    lastDiffHeight={lastDiffHeight}
                    onExpand={smoothScrollToBottom} // ⬅️ 여기서 주입
                  >
                    {m.type === 'message' && (
                      <ChatbotMessageBubble tokens={m.tokens} index={index} />
                    )}
                    {m.type === 'loading' && <LoadingBubble />}
                    {m.type === 'fallback' && <ChatbotFallbackBubble index={index} />}
                  </ChatbotItemWrapper>
                )
              }

              if (m.sender === 'user') {
                return (
                  <UserMessageBubble
                    m={m}
                    index={index}
                    ref={(el) => {
                      if (el) heightsRef.current[index] = el.clientHeight
                    }}
                  />
                )
              }
              return null
            }}
          />
        </MessagesContainer>
      </Layout>
      <PublishFloating />
    </>
  )
}

export default ChatPage

// Styled Components
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

export const ChatbotBubbleWrap = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
})

// ChatbotItemWrapper
type ChatbotItemWrapperProps = {
  children: ReactNode
  isLastMessage: boolean
  lastDiffHeight: number | null
  onExpand?: () => void
}

const ChatbotItemWrapper = ({
  children,
  isLastMessage,
  lastDiffHeight,
  onExpand,
}: ChatbotItemWrapperProps) => {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // 새 메시지 들어오면 expand 애니메이션 시작
  useEffect(() => {
    if (isLastMessage) {
      setExpanded(false)
      const t = setTimeout(() => setExpanded(true), 50)
      return () => clearTimeout(t)
    }
  }, [isLastMessage, lastDiffHeight])

  // transition 끝났을 때 마지막 보정
  useEffect(() => {
    const el = ref.current
    if (!el || !isLastMessage) return

    const handleEnd = () => {
      onExpand?.() // 최종 보정
    }

    el.addEventListener('transitionend', handleEnd)
    return () => el.removeEventListener('transitionend', handleEnd)
  }, [isLastMessage, onExpand])

  // console.log('lastDiffHeight', lastDiffHeight)

  return (
    <Box
      ref={ref}
      component="section"
      sx={{
        background: 'lightblue',
        minHeight: isLastMessage ? (expanded ? (lastDiffHeight ?? 200) : 200) : 200,
        transition: 'min-height .3s ease',
      }}
    >
      {children}
    </Box>
  )
}
