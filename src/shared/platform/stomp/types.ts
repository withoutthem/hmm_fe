// src/shared/platform/stomp/types.ts
import type { IFrame, IMessage } from '@stomp/stompjs'

export type StompState = 'idle' | 'connecting' | 'open' | 'closing' | 'closed'

export type TokenProvider = () => string | undefined | Promise<string | undefined>

export type StompConfig = {
  brokerURL?: string
  tokenProvider?: TokenProvider
  reconnectDelay?: number
  heartbeatOutgoing?: number
  heartbeatIncoming?: number
  log?: (level: 'debug' | 'warn' | 'error', ...args: unknown[]) => void
}

export type StompEventMap = {
  open: [frame: IFrame]
  connecting: []
  close: [] // onDisconnect
  error: [frame: IFrame] // onStompError
  reconnecting: [] // onWebSocketError -> reconnecting
  message: [message: IMessage]
}

export type StompEventName = keyof StompEventMap
export type StompListener<K extends StompEventName> = (...args: StompEventMap[K]) => void
