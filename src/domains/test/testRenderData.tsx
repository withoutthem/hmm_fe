import type { TalkMessage } from '@domains/common/ui/store/message.store';
import { MessageType, RenderType, Sender } from '@domains/common/ui/store/message.store';
import { adaptiveCardData } from '@domains/test/testData/adaptiveCardData';
import {
  BUSINESS_TYPE,
  type BusinessPayload,
} from '@domains/chatbot/components/chats/apiCaseBusinesses/types/businessType';

/** 공통 생성기 타입: 항상 CHATBOT/NORMAL 로 생성 */
export type TestMessageBuilder = () => TalkMessage;

/** ✅ 아주 긴 Markdown (min-height 넘어가는지 테스트 용) */
const buildMarkdownLong: TestMessageBuilder = () => ({
  sender: Sender.CHATBOT,
  renderType: RenderType.NORMAL,
  messageType: MessageType.MARKDOWN,
  streamingToken:
    '# 엄청 긴 마크다운 스트리밍 토큰 테스트\n' +
    '\n' +
    '아래는 **의도적으로 매우 긴** 본문입니다. 스크롤/가상화/`min-height` 보정이 제대로 동작하는지 확인하세요.\n' +
    '\n' +
    '## 섹션 1: 길게 늘어뜨린 문단\n' +
    Array.from({ length: 20 })
      .map(
        (_, i) =>
          `- (문단 ${i + 1}) Lorem ipsum dolor sit amet, consectetur adipiscing elit. ` +
          'Praesent sollicitudin, nisl a commodo condimentum, urna enim hendrerit sem, ' +
          'in sodales ex massa a mauris. Donec nec pharetra ipsum. Pellentesque habitant morbi ' +
          'tristique senectus et netus et malesuada fames ac turpis egestas. Sed vehicula, ' +
          'tellus sit amet posuere pharetra, quam odio interdum justo, eget lobortis neque arcu vel justo.'
      )
      .join('\n') +
    '\n\n' +
    '## 섹션 2: 코드 블록 (길이 + 레이아웃 확인)\n' +
    '```ts\n' +
    'type Massive = {\n' +
    '  id: string;\n' +
    '  title: string;\n' +
    '  content: string;\n' +
    '  tags: string[];\n' +
    '}\n' +
    '\n' +
    'const bigArray: Massive[] = [\n' +
    Array.from({ length: 30 })
      .map(
        (_, i) =>
          `  { id: "id-${i}", title: "항목 ${i}", content: "긴 내용 ${i}".repeat(20), tags: ["alpha","beta","gamma"] },\n`
      )
      .join('') +
    '];\n' +
    '\n' +
    'function heavyRender(a: Massive[]) {\n' +
    '  return a.map(x => `# ${x.title}\\n\\n${x.content}`).join("\\n\\n---\\n\\n");\n' +
    '}\n' +
    '\n' +
    'console.log(heavyRender(bigArray));\n' +
    '```\n' +
    '\n' +
    '## 섹션 3: 표\n' +
    '| 컬럼 A | 컬럼 B | 컬럼 C |\n' +
    '|:------:|:------:|:------:|\n' +
    Array.from({ length: 15 })
      .map((_, i) => `| A${i} | B${i} | C${i} |`)
      .join('\n') +
    '\n\n' +
    '## 섹션 4: 더미 텍스트 반복\n' +
    Array.from({ length: 25 })
      .map(
        () =>
          '이 줄은 min-height 보정이 실제로 충분히 긴 컨텐츠를 버텨주는지 검증하기 위한 샘플 텍스트입니다. ' +
          '스크롤은 자동으로 따라가지 않아야 하며, 하단으로 영역만 늘어나야 합니다.'
      )
      .join('\n') +
    '\n\n' +
    '> 끝. 위 내용이 한 번에 도착해도, 토큰 스트리밍 중간에 잘려 들어와도 레이아웃이 안정적이어야 합니다.\n',
});

/** 기존 Markdown(짧은 버전) */
const buildMarkdown: TestMessageBuilder = () => ({
  sender: Sender.CHATBOT,
  renderType: RenderType.NORMAL,
  messageType: MessageType.MARKDOWN,
  streamingToken:
    '### Markdown 응답 샘플\n' +
    '- 토큰 스트리밍처럼 렌더링되는지 확인\n' +
    '- **굵게**, *기울임*, `code`',
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
  buildMarkdownLong, // ✅ 제일 먼저 길이 압박 테스트
  buildMarkdown,
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
    const builder = TEST_CASES[r]!;
    return builder();
  }

  const builder = TEST_CASES[__idx % len]!;
  __idx++;
  return builder();
}
