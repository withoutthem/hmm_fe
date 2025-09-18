import * as AdaptiveCards from 'adaptivecards';
import { styled, Box } from '@mui/material';
import Layout from '@shared/components/Layout';
import PublishFloating, { PublushButton } from '@pages/test/PublishFloating';
import useMessageStore, {
  type ChatbotAdaptiveCard,
  type ChatbotLoading,
  type ChatMessage,
} from '@domains/common/ui/store/message.store';
import { Virtuoso } from 'react-virtuoso';
import type { VirtuosoHandle } from 'react-virtuoso';
import ChatbotMessageBubble from '@pages/test/components/ChatMessageBubble';
import ChatbotFallbackBubble from '@pages/test/components/ChatbotFallbackBubble';
import UserMessageBubble from '@pages/test/components/UserMessageBubble';
// import useDialogStore from '@domains/common/ui/store/dialog.store';
import LoadingBubble from '@pages/test/components/LoadingBubble';
import { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react';
import type { JSX } from 'react/jsx-runtime';
import AdaptiveCardRenderer from '@pages/test/components/AdaptiveCardRenderer';
import ChatbotItemWrapper from '@pages/test/components/ChatbotItemWrapper';
import { adaptiveCardData, type SignupFormData } from '@pages/test/components/AdaptiveCardData';
import { HTML_TEST_1 } from '@domains/common/components/testData';

const ChatPage = () => {
  const messages = useMessageStore((s) => s.messages);
  const setMessages = useMessageStore((s) => s.setMessages);
  const messageContentRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // const openDialog = useDialogStore((s) => s.openDialog);

  // const renderMap: Record<MessageType, (props: { m: ChatMessage; index: number }) => JSX.Element> =
  //   {
  //     message: ({ m, index }) => <ChatbotMessageBubble tokens={m.tokens} index={index} />,
  //     adaptiveCard: ({ m }) => <AdaptiveCardRenderer card={m.card} />,
  //   };

  const [lastDiffHeight, setLastDiffHeight] = useState<number | null>(null);

  /**
   * 스크롤영역
   */
  const scrollToBottomWithAnimation = useCallback(() => {
    const scrollerEl = document.querySelector('[data-testid="virtuoso-scroller"]');
    if (!scrollerEl) return;

    const start = scrollerEl.scrollTop;
    const end = scrollerEl.scrollHeight - scrollerEl.clientHeight;
    const duration = 500;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // easeInOutCubic
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      scrollerEl.scrollTop = start + (end - start) * ease;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      // 렌더 직후 여러 프레임 동안 반복 실행해서 "안 그려졌을 때도" 대응
      let count = 0;
      const tryScroll = () => {
        scrollToBottomWithAnimation();
        count++;
        if (count < 5) requestAnimationFrame(tryScroll); // 5프레임 정도 재시도
      };
      requestAnimationFrame(tryScroll);
    }
  }, [messages.length]);
  /**
   * 스크롤영역
   */

  /**
   * 시뮬레이션
   * user 메시지 입력되면 chatbot 응답시뮬레이션
   * 시뮬레이션
   */
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1] as ChatMessage;

    if (last.sender === 'user') {
      // 1) 로딩 메시지 추가
      const loadingMsg = { sender: 'chatbot', type: 'loading' } as ChatbotLoading;
      setMessages((prev) => [...prev, loadingMsg]);

      // 2) 3초 후 로딩 제거 + 실제 응답 추가
      setTimeout(() => {
        setMessages((prev) => {
          const newMsgs = [...prev];
          const last = newMsgs[newMsgs.length - 1];
          if (last?.type === 'loading') {
            newMsgs.pop();
          }

          // adaptiveCard일때 테스트
          newMsgs.push({
            sender: 'chatbot',
            type: 'adaptiveCard',
            card: { title: 'Adaptive Card 테스트', description: '이건 카드 형식 UI예요.' },
          } as ChatbotAdaptiveCard);

          // 일반 메시지 테스트
          // newMsgs.push({
          //   sender: 'chatbot',
          //   type: 'message',
          //   tokens: HTML_TEST_1,
          // });

          return newMsgs;
        });
      }, 2000);
    }
  }, [messages.length, setMessages]);

  // 마지막 user 버블의 높이 알아내는 로직
  useLayoutEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender !== 'user') return;

    const scrollerEl = document.querySelector('[data-testid="virtuoso-scroller"]') as HTMLElement;
    const targetIndex = messages.length - 1;

    const tryGetEl = () => {
      const targetEl = scrollerEl.querySelector(
        `[data-item-index="${targetIndex}"]`
      ) as HTMLElement;

      if (targetEl) {
        if (messageContentRef.current) {
          const size = targetEl.clientHeight; // 높이
          if (size) {
            // 전체 높이에서 user 메시지 높이 뺀값을 min-height로 설정
            const containerH = messageContentRef.current.clientHeight - Number(size);
            console.log(`${messageContentRef.current.clientHeight} - ${size} = ${containerH}`);
            setLastDiffHeight(containerH);
          }
        }
      } else {
        // targetEl이 아직 렌더링되지 않음
        requestAnimationFrame(tryGetEl);
      }
    };

    requestAnimationFrame(tryGetEl);
  }, [messages.length]);

  // fallback message 테스트
  // const onFallbackTest = () => {
  //   setMessages((prev) => [...prev, { sender: 'chatbot', type: 'fallback' }]);
  // };

  const onPublisherCheck = () => {
    const el = document.getElementById('publish');
    if (el) el.style.display = 'flex';
  };

  return (
    <>
      <Layout>
        <PublushButton onClick={onPublisherCheck}>Publish</PublushButton>

        {/*<TestFlexBox>*/}
        {/*  <Button variant="primary" onClick={onFallbackTest}>*/}
        {/*    Fallback Test*/}
        {/*  </Button>*/}
        {/*  <Button variant="primary" onClick={() => openDialog('history')}>*/}
        {/*    dialog*/}
        {/*  </Button>*/}
        {/*</TestFlexBox>*/}

        <MessagesContainer ref={messageContentRef}>
          <Virtuoso
            data={messages}
            ref={virtuosoRef}
            overscan={10}
            itemContent={(index, m) => {
              if (m.sender === 'chatbot') {
                const isLast = index === messages.length - 1;

                let content: JSX.Element | null = null;

                // 로딩중일때
                if (m.type === 'loading') {
                  content = <LoadingBubble />;
                }
                // fallback일때
                else if (
                  (m.type === 'message' && m.fallback) ||
                  (m.type === 'adaptiveCard' && m.fallback)
                ) {
                  content = <ChatbotFallbackBubble index={index} />;
                }
                // 메시지일때 ( fallback이 아닌 )
                else if (m.type === 'message') {
                  content = <ChatbotMessageBubble tokens={m.tokens} index={index} />;
                }
                // adaptiveCard일때 ( fallback이 아닌 )
                else if (m.type === 'adaptiveCard') {
                  content = (
                    <AdaptiveCardContainer>
                      <AdaptiveCardRenderer
                        card={adaptiveCardData}
                        onSubmit={(data) => {
                          const formData = data as Record<string, string>;

                          console.log('data', formData);

                          const startKeys = Object.keys(formData).filter((key) =>
                            key.startsWith('startTime')
                          );

                          for (const startKey of startKeys) {
                            const match = startKey.match(/^startTime(\d+)$/); // 끝의 숫자만 추출
                            if (!match) continue;

                            const num = match[1]; // ex) "1", "2"
                            const endKey = `endTime${num}`;

                            // 3. endTimeN이 존재할 때만 비교
                            if (endKey in formData) {
                              const startVal = formData[startKey];
                              const endVal = formData[endKey];

                              console.log(`👉 비교: ${startKey}=${startVal}, ${endKey}=${endVal}`);

                              // 4. 값이 다르더라도 같은 문구 출력
                              if (startVal && endVal) {
                                if (startVal >= endVal) {
                                  alert('출차시간은 입차시간보다 뒤입니다.'); // 같은 경우
                                }
                                // startVal < endVal 인 경우는 정상이라 그냥 통과
                              }
                            }
                          }

                          console.log('✅ 최종 formData:', formData);

                          // // 이름 필수 검사
                          // if (!data.name || formData.name.trim() === '') {
                          //   alert('⚠️ 이름은 필수 입력 항목입니다.');
                          //   return;
                          // }
                          //
                          // // 이메일 형식 검사
                          // const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
                          // if (!data.email || !emailRegex.test(formData.email)) {
                          //   alert('⚠️ 올바른 이메일 주소를 입력해주세요.');
                          //   return;
                          // }
                          //
                          // // 전화번호 형식 검사 (010으로 시작, 11자리)
                          // const phoneRegex = /^01[0-9]{9}$/;
                          // if (!data.phone || !phoneRegex.test(formData.phone)) {
                          //   alert('⚠️ 올바른 휴대전화번호(예: 01012345678)를 입력해주세요.');
                          //   return;
                          // }
                          // 체크박스 검사
                          // if (data.task1 !== "true" || data.task2 !== "true" || data.task3 !== "true") {
                          //   alert("⚠️ 모든 체크박스를 선택해야 제출할 수 있습니다.");
                          //   return;
                          // }
                          //
                          // // 통과하면 실제 제출 처리
                          // console.log('✅ 유효성 검증 통과:', formData);
                          // 여기서 API 호출 등 실제 로직 실행
                        }}
                      />
                    </AdaptiveCardContainer>
                  );
                }

                return (
                  <ChatbotItemWrapper
                    isLastMessage={isLast}
                    lastDiffHeight={lastDiffHeight}
                    scrollToBottom={scrollToBottomWithAnimation}
                  >
                    {content}
                  </ChatbotItemWrapper>
                );
              }

              if (m.sender === 'user') {
                return <UserMessageBubble m={m} index={index} />;
              }

              return null;
            }}
          />
        </MessagesContainer>
      </Layout>
      <PublishFloating />
    </>
  );
};

export default ChatPage;

const MessagesContainer = styled(Box)({
  width: '100%',
  height: '100%',
  '& div[data-testid="virtuoso-scroller"]': {
    flex: '1',
    height: '100%',
    gap: '8px',
    scrollbarWidth: 'thin',
  },
});

export const ChatbotBubbleWrap = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
});

const AdaptiveCardContainer = styled(Box)({
  '& input, & select': {
    border: '1px solid black',
    '&.ac-input-validation-failed': { borderColor: 'red', color: 'red' },
  },
  '& button': { background: 'black', color: '#fff' },
  '& table': { width: '100%', borderCollapse: 'collapse' },
  '& td': { border: '1px solid #ddd' },
  '& .ac-horizontal-separator': { display: 'none !important' },
  '& #timeBox': { flexDirection: 'row !important', '& > div': { flex: '1 !important' } },
});
