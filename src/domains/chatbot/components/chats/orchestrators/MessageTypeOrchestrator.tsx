// src/domains/chatbot/components/chats/orchestrators/MessageTypeOrchestrator.tsx

import MarkDownAnimator from '../renderers/formats/MarkdownAnimator';
import AdaptiveCard from '../renderers/formats/AdaptiveCard';
import BusinessTypeOrchestrator from './BusinessTypeOrchestrator';

// (테스트용 샘플 데이터) 실제 메시지에 adaptiveCardInfo 있으면 그걸 사용
import { onAdaptiveCardSubmit } from '@domains/common/utils/utils';
import { adaptiveCardData } from '@domains/test/testData/adaptiveCardData';
import { MessageType, type TalkMessage } from '@domains/common/ui/store/message.store';
import {
  BUSINESS_TYPE,
  type BusinessPayload,
} from '@domains/chatbot/components/chats/apiCaseBusinesses/types/businessType';

interface MessageTypeOrchestratorProps {
  talkMessage: TalkMessage;
}

/**
 * MessageTypeOrchestrator
 * ------------------------
 * 1. messageType (HTML, MARKDOWN, ADAPTIVE_CARD, JSON) 분기
 * 2. JSON 메시지는 BusinessTypeOrchestrator에 위임
 */
const MessageTypeOrchestrator = (props: MessageTypeOrchestratorProps) => {
  switch (props.talkMessage.messageType) {
    case MessageType.HTML:
      return;
    case MessageType.MARKDOWN: {
      const tokens = props.talkMessage.streamingToken ?? props.talkMessage.message ?? '';
      return <MarkDownAnimator tokens={tokens} />;
    }

    case MessageType.ADAPTIVE_CARD: {
      const card = props.talkMessage.adaptiveCardInfo ?? adaptiveCardData;
      return <AdaptiveCard card={card} onSubmit={onAdaptiveCardSubmit} />;
    }

    case MessageType.JSON:
      return (
        <BusinessTypeOrchestrator
          talkMessage={props.talkMessage}
          businessType={BUSINESS_TYPE.RETRIEVE_BOOKING_NUMBER}
          payload={props.talkMessage.payload as BusinessPayload}
        />
      );

    default:
      if (import.meta.env.DEV) {
        console.warn(
          '[MessageTypeOrchestrator] Unhandled messageType:',
          props.talkMessage.messageType
        );
      }
      return null;
  }
};

export default MessageTypeOrchestrator;
