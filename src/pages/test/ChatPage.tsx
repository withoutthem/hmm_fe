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

const AdaptiveCardData = {
  type: 'AdaptiveCard',
  version: '1.3',
  body: [
    // 1. 기본 텍스트
    {
      type: 'TextBlock',
      text: '1. 기본 텍스트',
      size: 'large',
      weight: 'bolder',
      separator: false,
    },
    {
      type: 'TextBlock',
      id: 'hello',
      text: '안녕하세요! 👋 AdaptiveCard 테스트 카드입니다.',
      size: 'large',
      weight: 'bolder',
      separator: false,
    },
    { type: 'TextBlock', text: 'AdaptiveCard 테스트 카드입니다.' },

    // 2. 입력폼
    { type: 'TextBlock', text: '2. 입력폼', size: 'large', weight: 'bolder' },
    { type: 'TextBlock', text: '회원가입 폼', weight: 'bolder', size: 'medium' },
    { type: 'Input.Text', id: 'name', placeholder: '이름' },
    { type: 'Input.Text', id: 'email', placeholder: '이메일', style: 'Email' },

    // 3. 이미지 갤러리
    { type: 'TextBlock', text: '3. 이미지 갤러리', size: 'large', weight: 'bolder' },
    { type: 'TextBlock', text: '추천 여행지 🌏', weight: 'bolder', size: 'medium' },
    {
      type: 'ImageSet',
      imagesize: 'medium',
      images: [
        { type: 'Image', url: 'https://picsum.photos/200/150?1' },
        { type: 'Image', url: 'https://picsum.photos/200/150?2' },
        { type: 'Image', url: 'https://picsum.photos/200/150?3' },
      ],
    },

    // 4. 체크리스트
    { type: 'TextBlock', text: '4. 체크리스트', size: 'large', weight: 'bolder' },
    { type: 'TextBlock', text: '오늘의 할 일 ✅', weight: 'bolder', size: 'medium' },
    {
      type: 'Input.Toggle',
      id: 'task1',
      title: 'React 공부하기',
      valueOn: 'true',
      valueOff: 'false',
    },
    {
      type: 'Input.Toggle',
      id: 'task2',
      title: '운동 30분 하기',
      valueOn: 'true',
      valueOff: 'false',
    },
    {
      type: 'Input.Toggle',
      id: 'task3',
      title: '책 10페이지 읽기',
      valueOn: 'true',
      valueOff: 'false',
    },

    // 5. 날짜 선택
    { type: 'TextBlock', text: '5. 날짜 선택', size: 'large', weight: 'bolder' },
    { type: 'TextBlock', text: '예약 날짜와 시간을 선택하세요 📅', weight: 'bolder' },
    { type: 'Input.Date', id: 'date', title: '날짜 선택' },

    {
      type: 'Container',
      items: [
        {
          type: 'ColumnSet',
          columns: [
            {
              type: 'Column',
              width: 'stretch',
              items: [
                {
                  type: 'ColumnSet',
                  columns: [
                    {
                      type: 'Column',
                      width: 'auto',
                      items: [
                        { type: 'TextBlock', text: '입차시간', weight: 'Bolder', wrap: true },
                      ],
                    },
                    {
                      type: 'Column',
                      width: 'stretch',
                      items: [
                        {
                          type: 'Input.ChoiceSet',
                          id: 'startTime',
                          style: 'compact',
                          choices: [
                            { title: '09:00', value: '09:00' },
                            { title: '09:30', value: '09:30' },
                            { title: '10:00', value: '10:00' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'Column',
              width: 'stretch',
              items: [
                {
                  type: 'ColumnSet',
                  columns: [
                    {
                      type: 'Column',
                      width: 'auto',
                      items: [
                        { type: 'TextBlock', text: '출차시간', weight: 'Bolder', wrap: true },
                      ],
                    },
                    {
                      type: 'Column',
                      width: 'stretch',
                      items: [
                        {
                          type: 'Input.ChoiceSet',
                          id: 'endTime',
                          style: 'compact',
                          choices: [
                            { title: '09:00', value: '09:00' },
                            { title: '09:30', value: '09:30' },
                            { title: '10:00', value: '10:00' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // 6. FactSet (테이블 느낌)
    { type: 'TextBlock', text: '6. FactSet (테이블 느낌)', size: 'large', weight: 'bolder' },
    { type: 'TextBlock', text: '주문 내역 🛒', weight: 'bolder', size: 'medium' },
    {
      type: 'FactSet',
      facts: [
        { title: '상품', value: '노트북' },
        { title: '수량', value: '1' },
        { title: '가격', value: '₩1,500,000' },
      ],
    },

    // 7. Hero 이미지
    { type: 'TextBlock', text: '7. Hero 이미지', size: 'large', weight: 'bolder' },
    { type: 'Image', url: 'https://picsum.photos/400/200', size: 'Stretch' },
    { type: 'TextBlock', text: '이 상품을 구매하시겠습니까?', weight: 'bolder', wrap: true },
  ],
  actions: [
    { type: 'Action.Submit', title: '확인' },
    { type: 'Action.OpenUrl', title: '자세히 보기', url: 'https://example.com' },
  ],
} as unknown as AdaptiveCards.IAdaptiveCard;

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
                        card={AdaptiveCardData}
                        onSubmit={(data) => console.log('제출된 데이터:', data)}
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
  '& input, & select': { border: '1px solid black' },
  '& button': { background: 'black', color: '#fff' },
  '& table': { width: '100%', borderCollapse: 'collapse' },
  '& td': { border: '1px solid #ddd' },
  '& .ac-horizontal-separator': { display: 'none' },
});
