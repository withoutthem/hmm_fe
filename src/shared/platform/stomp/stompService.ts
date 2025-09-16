// src/shared/platform/stomp/stompService.ts
import { StompClient } from './stompClient';

export const stomp = new StompClient();

/** 지정된 STOMP destination으로 메시지를 발행 */
export const publish = (destination: string, data: unknown) => {
  stomp.publish(destination, data);
};

/** 지정된 STOMP destination을 구독하고 메시지를 수신 */
export const subscribe = <T = unknown>(destination: string, handler: (msg: T) => void) => {
  return stomp.subscribe<T>(destination, handler);
};

// 중복 connect 방지용
let connected = false;
/** 애플리케이션 라이프사이클 동안 단 한 번만 STOMP 연결을 시도 */
export const connectOnce = () => {
  if (connected) return;
  connected = true;
  stomp.connect();
};
