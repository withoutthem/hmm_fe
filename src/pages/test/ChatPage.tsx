import { Button, styled, Box } from '@mui/material'
import Layout from '@shared/components/Layout'
import {
  HTML_TEST_1,
  HTML_TEST_2,
  WS_TEST_01,
  WS_TEST_02,
} from '@domains/common/components/testData'
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
  const messageContentRef = useRef<HTMLDivElement>(null)
  const virtuosoRef = useRef<VirtuosoHandle>(null)

  const openDialog = useDialogStore((s) => s.openDialog)

  const [lastDiffHeight, setLastDiffHeight] = useState<number | null>(null)

  /**
   * 스크롤영역
   */
  const scrollToBottomWithAnimation = () => {
    const scrollerEl = document.querySelector('[data-testid="virtuoso-scroller"]')
    if (!scrollerEl) return

    const start = scrollerEl.scrollTop
    const end = scrollerEl.scrollHeight - scrollerEl.clientHeight
    const duration = 500
    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // easeInOutCubic
      const ease =
        progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

      scrollerEl.scrollTop = start + (end - start) * ease

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  useEffect(() => {
    if (messages.length > 0) {
      // 렌더 직후 여러 프레임 동안 반복 실행해서 "안 그려졌을 때도" 대응
      let count = 0
      const tryScroll = () => {
        scrollToBottomWithAnimation()
        count++
        if (count < 5) requestAnimationFrame(tryScroll) // 5프레임 정도 재시도
      }
      requestAnimationFrame(tryScroll)
    }
  }, [messages.length])
  /**
   * 스크롤영역
   */

  const showLoadingThenReplace = (replaceMsg: ChatbotMessage | ChatbotFallback, delay = 3000) => {
    /**
     * 여기부분이 user 버블 추가하는 부분
     */
    const loadingMsg: ChatbotLoading = { sender: 'chatbot', type: 'loading' }
    setMessages((prev) => [...prev, loadingMsg])

    /**
     * 여기부분이 chatbot 버블 추가하는 부분
     */
    setMessages((prev) => {
      const next = [...prev]
      next[next.length - 1] = replaceMsg
      return next
    })
  }

  // user 메시지 입력되면 chatbot 응답 시뮬레이션
  const onTestPushTokens = (tokens: string[]) => {
    showLoadingThenReplace({ sender: 'chatbot', type: 'message', tokens })
  }

  // user 메시지 입력되면 chatbot 응답 시뮬레이션
  useEffect(() => {
    if (messages.length === 0) return
    const last = messages[messages.length - 1] as ChatMessage
    if (last.sender === 'user') {
      onTestPushTokens(HTML_TEST_1)
    }
  }, [messages.length])

  // 마지막 user 버블의 높이 알아내는 로직
  useLayoutEffect(() => {
    if (messages.length === 0) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.sender !== 'user') return

    const scrollerEl = document.querySelector('[data-testid="virtuoso-scroller"]') as HTMLElement
    const targetIndex = messages.length - 1

    let attempts = 0
    const tryGetEl = () => {
      const targetEl = scrollerEl.querySelector(`[data-item-index="${targetIndex}"]`) as HTMLElement

      if (targetEl) {
        if (messageContentRef.current) {
          const size = targetEl.clientHeight // 높이

          console.log('targetEl', targetEl.offsetTop)

          if (size) {
            // 전체 높이에서 user 메시지 높이 뺀값을 min-height로 설정
            const containerH = messageContentRef.current.clientHeight - Number(size)
            console.log(
              `${messageContentRef.current.clientHeight} - ${Number(size)} = ${containerH}`
            )
            setLastDiffHeight(containerH)
          }
        }
      } else {
        // targetEl이 아직 렌더링되지 않음

        console.log('어디인거냐')

        if (attempts < 5) {
          attempts++
          requestAnimationFrame(tryGetEl)
        }
      }
    }

    requestAnimationFrame(tryGetEl)
  }, [messages.length])

  // fallback message 테스트
  const onFallbackTest = () => {
    showLoadingThenReplace({ sender: 'chatbot', type: 'fallback' })
  }

  const onPublisherCheck = () => {
    const el = document.getElementById('publish')
    if (el) el.style.display = 'flex'
  }

  return (
    <>
      <Layout>
        <PublushButton onClick={onPublisherCheck}>Publish</PublushButton>

        <TestFlexBox>
          <Button variant="primary" onClick={() => openDialog('history')}>
            dialog
          </Button>
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

        <MessagesContainer ref={messageContentRef}>
          <Virtuoso
            data={messages}
            ref={virtuosoRef}
            overscan={5}
            itemContent={(index, m) => {
              if (m.sender === 'chatbot') {
                const isLastMessage = index === messages.length - 1
                return (
                  <ChatbotItemWrapper
                    isLastMessage={isLastMessage}
                    lastDiffHeight={lastDiffHeight}
                    scrollToBottom={scrollToBottomWithAnimation}
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
                return <UserMessageBubble m={m} index={index} />
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
    height: '100%',
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
  scrollToBottom: () => void
}

const ChatbotItemWrapper = ({
  children,
  isLastMessage,
  lastDiffHeight,
  scrollToBottom,
}: ChatbotItemWrapperProps) => {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // console.log('lastDiffHeight', lastDiffHeight)

  useEffect(() => {
    if (isLastMessage) {
      setExpanded(true)
      scrollToBottom()
    }
  }, [isLastMessage])

  useEffect(() => {
    if (!ref.current || !isLastMessage) return
    const el = ref.current

    const handleTransitionEnd = () => {
      scrollToBottom()
    }

    el.addEventListener('transitionend', handleTransitionEnd)
    return () => el.removeEventListener('transitionend', handleTransitionEnd)
  }, [isLastMessage, scrollToBottom])

  return (
    <Box
      ref={ref}
      component="section"
      sx={{
        // background: 'lightgreen',
        minHeight: isLastMessage ? (expanded ? (lastDiffHeight ?? 0) : 0) : 0,
        transition: 'min-height .5s ease',
      }}
    >
      {children}
    </Box>
  )
}
