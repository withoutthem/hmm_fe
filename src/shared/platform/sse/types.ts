/**
 * SSE 모듈에서 사용되는 모든 타입 정의와 커스텀 에러 클래스.
 */

// SSE 서버로부터 수신하는 표준 메시지 형태
export type SseMessage = {
  id?: string
  event?: string
  data: string
}

// SSE 연결 상태를 처리하는 콜백 함수 훅
export type SseHooks = {
  onOpen?: (es: EventSource) => void
  onMessage?: (msg: SseMessage) => void
  onError?: (err: SseError) => void
  onRetry?: (attempt: number, delayMs: number) => void
  onNamedEvent?: (name: string, msg: SseMessage) => void
}

// 자동 재연결 정책
export type SseRetry = {
  enabled?: boolean
  minDelayMs?: number
  maxDelayMs?: number
  /** undefined => 무한 재시도 */
  maxAttempts?: number
}

// `createSseClient` 생성자 옵션
export type SseOptions = SseHooks & {
  pathOrUrl: string
  withCredentials?: boolean
  query?: Record<string, string | number | boolean | undefined>
  retry?: SseRetry
  namedEvents?: string[]
  /** true일 경우 globalThis.__ACCESS_TOKEN__을 token 쿼리 파라미터로 자동 주입 (기본값: true) */
  autoAuth?: boolean
}

// SSE 연결을 제어하는 컨트롤러 인터페이스
export type SseController = {
  start: () => void
  stop: () => void
  isOpen: () => boolean
  getUrl: () => string
}

// SSE 표준 오류 (HttpError와 일관성 유지)
export class SseError extends Error {
  public readonly type = 'SseConnectionError'

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'SseError'
  }
}
