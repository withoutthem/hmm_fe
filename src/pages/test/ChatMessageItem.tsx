import { MessageType, Sender, type TalkMessage } from '@domains/common/ui/store/message.store';
import ChatbotMessageBubble from '@pages/test/components/ChatMessageBubble';
import ChatbotFallbackBubble from '@pages/test/components/ChatbotFallbackBubble';
import UserMessageBubble from '@pages/test/components/UserMessageBubble';
import LoadingBubble from '@pages/test/components/LoadingBubble';
import AdaptiveCardRenderer from '@pages/test/components/AdaptiveCardRenderer';
import ChatbotItemWrapper from '@pages/test/components/ChatbotItemWrapper';
import { adaptiveCardData } from '@pages/test/components/AdaptiveCardData';
import { Box, styled } from '@mui/material';
import type { JSX } from 'react';

interface ChatMessageItemProps {
  talkMessage: TalkMessage;
  index: number;
  messagesLength: number;
  lastDiffHeight: number | null;
  scrollToBottom: () => void;
}

const ChatMessageItem = ({
  talkMessage,
  index,
  messagesLength,
  lastDiffHeight,
  scrollToBottom,
}: ChatMessageItemProps) => {
  if (talkMessage.sender === Sender.CHATBOT) {
    const isLast = index === messagesLength - 1;
    let content: JSX.Element | null = null;

    if (talkMessage.sender === Sender.CHATBOT && talkMessage.isLoading) {
      content = <LoadingBubble />;
    } else if (
      (talkMessage.type === MessageType.MESSAGE && talkMessage.fallback) ||
      (talkMessage.type === MessageType.ADAPTIVE_CARD && talkMessage.fallback)
    ) {
      content = <ChatbotFallbackBubble index={index} />;
    } else if (talkMessage.type === MessageType.MESSAGE) {
      content = <ChatbotMessageBubble tokens={talkMessage.streamingToken ?? ''} index={index} />;
    } else if (talkMessage.type === MessageType.ADAPTIVE_CARD) {
      content = (
        <AdaptiveCardContainer>
          <AdaptiveCardRenderer
            card={adaptiveCardData}
            onSubmit={(data) => {
              const formData = data as Record<string, string>;

              const startKeys = Object.keys(formData).filter((key) => key.startsWith('startTime'));

              for (const startKey of startKeys) {
                const regex = /^startTime(\d+)$/;
                const match = regex.exec(startKey); // 끝의 숫자만 추출
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
        scrollToBottom={scrollToBottom}
      >
        {content}
      </ChatbotItemWrapper>
    );
  }

  if (talkMessage.sender === Sender.USER) {
    return <UserMessageBubble m={talkMessage} index={index} />;
  }

  return null;
};

export default ChatMessageItem;

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
