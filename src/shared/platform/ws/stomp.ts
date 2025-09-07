// src/shared/ws/stomp.ts
export type StompFrame<B = unknown> = {
  destination: string
  // exactOptionalPropertyTypes 대응: undefined 포함
  body?: B | undefined
}

// 오버로드 시그니처(타입)
type CreateStompFrame = {
  (destination: string): StompFrame<never>
  <B>(destination: string, body: B): StompFrame<B>
}

// - body가 undefined/null이면 필드 생략 -> StompFrame<never>
// - 값이 있으면 그대로 body 포함 -> StompFrame<B>
export const createStompFrame: CreateStompFrame = ((destination: string, body?: unknown) => {
  if (body === undefined || body === null) {
    const frame: StompFrame<never> = { destination }
    return frame
  }
  return { destination, body } as StompFrame<typeof body>
}) as CreateStompFrame
