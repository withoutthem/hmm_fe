import type { TalkMessage } from '@domains/common/ui/store/message.store';
import { MessageType, RenderType, Sender } from '@domains/common/ui/store/message.store';
import { adaptiveCardData } from '@domains/test/testData/adaptiveCardData';
import {
  BUSINESS_TYPE,
  type BusinessPayload,
} from '@domains/chatbot/components/chats/apiCaseBusinesses/types/businessType';

/** 공통 생성기 타입: 항상 CHATBOT/NORMAL 로 생성 */
export type TestMessageBuilder = () => TalkMessage;

/** HTML */
const buildHtml: TestMessageBuilder = () => ({
  sender: Sender.CHATBOT,
  renderType: RenderType.NORMAL,
  messageType: MessageType.HTML,
  message: `
    <div>
      <h3 style="margin:0 0 8px 0;">HTML 응답 샘플</h3>
      <p>이것은 <strong>HTML</strong> 형식의 테스트 메시지입니다.</p>
      <ul><li>리스트 1</li><li>리스트 2</li></ul>
    </div>
  `,
});

/** Markdown */
const buildMarkdown: TestMessageBuilder = () => ({
  sender: Sender.CHATBOT,
  renderType: RenderType.NORMAL,
  messageType: MessageType.MARKDOWN,
  // backtick은 작은따옴표 안에서 이스케이프 불필요
  streamingToken:
    '### Markdown 응답 샘플\n- 토큰 스트리밍처럼 렌더링되는지 확인\n- **굵게**, *기울임*, `code`',
});

/** Adaptive Card */
const buildAdaptiveCard: TestMessageBuilder = () => ({
  sender: Sender.CHATBOT,
  renderType: RenderType.NORMAL,
  messageType: MessageType.ADAPTIVE_CARD,
  message: '챗봇 응답: Adaptive Card 예시',
  adaptiveCardInfo: adaptiveCardData,
});

/** JSON → BusinessType: 예약번호 조회 */
const buildJsonRetrieveBookingNumber: TestMessageBuilder = () => {
  const payload: BusinessPayload = {
    // 실제 도메인에 맞게 샘플 필드 구성
    bookingNo: 'HMMU1234567',
    customerName: 'ACME Logistics',
    status: 'CONFIRMED',
  } as unknown as BusinessPayload;

  return {
    sender: Sender.CHATBOT,
    renderType: RenderType.NORMAL,
    messageType: MessageType.JSON,
    businessType: BUSINESS_TYPE.RETRIEVE_BOOKING_NUMBER,
    payload,
  } as TalkMessage;
};

/** JSON → BusinessType: 사무소 연락처 */
const buildJsonOfficeContact: TestMessageBuilder = () => {
  const payload: BusinessPayload = {
    officeName: 'HMM Seoul HQ',
    phone: '+82-2-1234-5678',
    email: 'seoul.office@hmm.com',
    address: '서울시 중구...',
  } as unknown as BusinessPayload;

  return {
    sender: Sender.CHATBOT,
    renderType: RenderType.NORMAL,
    messageType: MessageType.JSON,
    businessType: BUSINESS_TYPE.OFFICE_CONTACT,
    payload,
  } as TalkMessage;
};

/** JSON → BusinessType: P2P 운임 조회 */
const buildJsonPointToPoint: TestMessageBuilder = () => {
  const payload: BusinessPayload = {
    origin: 'BUSAN',
    destination: 'LONG BEACH',
    etd: '2025-10-03',
    eta: '2025-10-17',
    priceUSD: 1234.56,
  } as unknown as BusinessPayload;

  return {
    sender: Sender.CHATBOT,
    renderType: RenderType.NORMAL,
    messageType: MessageType.JSON,
    businessType: BUSINESS_TYPE.POINT_TO_POINT,
    payload,
  } as TalkMessage;
};

export const TEST_CASES: TestMessageBuilder[] = [
  buildMarkdown,
  buildHtml,
  buildAdaptiveCard,
  buildJsonRetrieveBookingNumber,
  buildJsonOfficeContact,
  buildJsonPointToPoint,
];

/** 순차/랜덤 선택 유틸 */
let __idx = 0;
export type PickMode = 'all' | 'roundRobin' | 'random';

export function nextTestMessage(mode: PickMode = 'roundRobin'): TalkMessage {
  const len = TEST_CASES.length;
  if (len === 0) throw new Error('[testRenderData] TEST_CASES is empty.');

  if (mode === 'random') {
    const r = Math.floor(Math.random() * len);
    const builder = TEST_CASES[r]!; // len > 0 보장, non-null 단언
    return builder();
  }

  const builder = TEST_CASES[__idx % len]!; // round-robin 보정
  __idx++;
  return builder();
}
