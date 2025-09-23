// src/domains/chatbot/components/chats/orchestrators/MessageTypeOrchestrator.tsx

import MarkDownRenderer from '../renderers/formats/MarkdownRenderer';
import AdaptiveCardRenderer from '../renderers/formats/AdaptiveCardRenderer';
import BusinessTypeOrchestrator from './BusinessTypeOrchestrator';
import { onAdaptiveCardSubmit } from '@domains/common/utils/utils';
import { parkingData } from '@domains/test/testData/parkingData';
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
 * 1. messageType (MARKDOWN, ADAPTIVE_CARD, JSON) 분기
 * 2. JSON 메시지는 BusinessTypeOrchestrator에 위임
 */
const MessageTypeOrchestrator = (props: MessageTypeOrchestratorProps) => {
  switch (props.talkMessage.messageType) {
    case MessageType.MARKDOWN: {
      const tokens = props.talkMessage.streamingToken ?? props.talkMessage.message ?? '';
      return <MarkDownRenderer tokens={tokens} />;
    }

    case MessageType.ADAPTIVE_CARD: {
      const card = props.talkMessage.adaptiveCardInfo ?? parkingData;
      return <AdaptiveCardRenderer card={card} onSubmit={onAdaptiveCardSubmit} />;
    }

    case MessageType.JSON:
      return (
        <BusinessTypeOrchestrator
          talkMessage={props.talkMessage}
          businessType={props.talkMessage?.businessType ?? BUSINESS_TYPE.FALLBACK}
          payload={props.talkMessage?.payload as BusinessPayload}
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
