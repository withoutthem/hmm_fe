// src/shared/platform/stomp/stompService.ts
import { StompClient } from './stompClient'

export const stomp = new StompClient()

/**
 * 지정된 STOMP destination으로 메시지를 발행(publish)합니다.
 * @param destination 메시지를 보낼 목적지 (예: '/app/chat')
 * @param data 전송할 데이터 (JSON으로 직렬화됩니다)
 */
export const publish = (destination: string, data: unknown) => {
  stomp.publish(destination, data)
}

/**
 * 지정된 STOMP destination을 구독하고 메시지를 수신합니다.
 * 컴포넌트 unmount 시 반드시 반환된 함수를 호출하여 구독을 해지해야 합니다.
 * @param destination 구독할 목적지 (예: '/topic/messages')
 * @param handler 메시지 수신 시 호출될 콜백 함수
 * @returns 구독 해지 함수
 */
export const subscribe = <T = unknown>(destination: string, handler: (msg: T) => void) => {
  return stomp.subscribe<T>(destination, handler)
}

// 중복 connect 방지용
let connected = false
/**
 * 애플리케이션 라이프사이클 동안 단 한 번만 STOMP 연결을 시도합니다.
 * WsProvider 등에서 앱 초기화 시 호출하는 것을 권장합니다.
 */
export const connectOnce = () => {
  if (connected) return
  connected = true
  stomp.connect()
}
