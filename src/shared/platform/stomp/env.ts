// src/shared/platform/stomp/env.ts

export type RuntimeAppConfWS = {
  WS_BASE_URL?: string
  WS_PATH?: string
  WS_RETRY_MIN_MS?: number | string
  WS_RETRY_MAX_MS?: number | string
  WS_HEARTBEAT_MS?: number | string
  WS_REQUEST_TIMEOUT_MS?: number | string
  ACCESS_TOKEN?: string
  WS_TRANSPORT?: 'auto' | 'ws' | 'sockjs'
  WS_SOCKJS_PATH?: string
  WS_WITH_TOKEN_QUERY?: boolean | string
}

type StompEnv = {
  STOMP_TRANSPORT: 'auto' | 'ws' | 'sockjs'
  STOMP_BROKER_URL: string
  STOMP_SOCKJS_URL: string
  STOMP_RETRY_MIN_MS: number
  STOMP_RETRY_MAX_MS: number
  STOMP_HEARTBEAT_OUTGOING: number
  STOMP_HEARTBEAT_INCOMING: number
  STOMP_REQUEST_TIMEOUT_MS: number
  STOMP_WS_WITH_TOKEN_QUERY: boolean
  /** exactOptionalPropertyTypes=true 환경 대응: 필수 속성이되 값은 undefined 허용 */
  RUNTIME_ACCESS_TOKEN: string | undefined
}

/* ---------------- 내부 유틸 ---------------- */

function toNumber(v: unknown, fallback: number): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = Number(v)
    if (!Number.isNaN(n)) return n
  }
  return fallback
}

function toBoolean(v: unknown, fallback: boolean): boolean {
  if (typeof v === 'boolean') return v
  if (typeof v === 'string') {
    const lower = v.toLowerCase()
    if (lower === 'true') return true
    if (lower === 'false') return false
  }
  return fallback
}

type GlobalWithAppConf = { __APP_CONF__?: RuntimeAppConfWS }

function readRuntimeConf(): Partial<RuntimeAppConfWS> {
  const g = globalThis as GlobalWithAppConf
  return g.__APP_CONF__ ?? {}
}

type ViteEnv = {
  VITE_API_BASE_URL?: string
  VITE_WS_BASE_URL?: string
  VITE_WS_PATH?: string
  VITE_WS_RETRY_MIN_MS?: string
  VITE_WS_RETRY_MAX_MS?: string
  VITE_WS_HEARTBEAT_MS?: string
  VITE_WS_REQUEST_TIMEOUT_MS?: string
  VITE_WS_WITH_TOKEN_QUERY?: string
  VITE_WS_TRANSPORT?: 'auto' | 'ws' | 'sockjs'
  VITE_WS_SOCKJS_PATH?: string
  VITE_ACCESS_TOKEN?: string
}

function readViteEnv(): Partial<ViteEnv> | undefined {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: ViteEnv }).env) {
      return (import.meta as unknown as { env: ViteEnv }).env
    }
  } catch {
    // 반환값 처리
  }
  return undefined
}

function getWindowOrigin(): string | undefined {
  if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
    return window.location.origin
  }
  return undefined
}

/** apiBase(http[s]) → ws[s] host base */
function toWsBaseFromApi(apiBase?: string, origin?: string): string | undefined {
  if (!apiBase) return undefined
  try {
    const u = new URL(apiBase, origin)
    const https = u.protocol === 'https:' || u.protocol === 'wss:'
    u.protocol = https ? 'wss:' : 'ws:'
    u.pathname = ''
    u.search = ''
    u.hash = ''
    return u.toString()
  } catch {
    return undefined
  }
}

/** ws[s] base → http[s] base (SockJS용) */
function toHttpBaseFromWs(wsBase?: string, origin?: string): string | undefined {
  if (!wsBase) return undefined
  try {
    const u = new URL(wsBase, origin)
    const secure = u.protocol === 'wss:' || u.protocol === 'https:'
    u.protocol = secure ? 'https:' : 'http:'
    u.pathname = ''
    u.search = ''
    u.hash = ''
    return u.toString()
  } catch {
    return undefined
  }
}

/** base 절대 URL + path 결합 */
function buildUrl(baseAbs: string, path?: string): string {
  if (!path) return baseAbs
  const u = new URL(baseAbs)
  const left = u.pathname.endsWith('/') ? u.pathname.slice(0, -1) : u.pathname
  const right = path.startsWith('/') ? path : `/${path}`
  u.pathname = `${left}${right}`
  return u.toString()
}

function isAbsoluteUrl(s: string): boolean {
  try {
    // 절대 URL만 true

    new URL(s)
    return true
  } catch {
    return false
  }
}

/* ---------------- ENV 정규화 ---------------- */

export const STOMP_ENV: StompEnv = (() => {
  const rt = readRuntimeConf()
  const ve = readViteEnv()
  const origin = getWindowOrigin()

  // 1) WS base
  const wsBaseFromApi = toWsBaseFromApi(ve?.VITE_API_BASE_URL, origin)
  const defaultWsBase = origin
    ? origin.startsWith('https')
      ? origin.replace(/^https:/, 'wss:')
      : origin.replace(/^http:/, 'ws:')
    : 'ws://localhost'

  const chosenWsBase = rt.WS_BASE_URL ?? ve?.VITE_WS_BASE_URL ?? wsBaseFromApi ?? defaultWsBase
  const wsBaseAbs = isAbsoluteUrl(chosenWsBase) ? chosenWsBase : defaultWsBase

  // path는 기본 '/ws' (base에는 host만, path에 엔드포인트)
  const wsPath = rt.WS_PATH ?? ve?.VITE_WS_PATH ?? '/ws'
  const brokerUrl = buildUrl(wsBaseAbs, wsPath)

  // 2) SockJS URL: http base + sockjs path
  const httpBase = toHttpBaseFromWs(wsBaseAbs, origin) ?? 'http://localhost'
  const sockJsPath = rt.WS_SOCKJS_PATH ?? ve?.VITE_WS_SOCKJS_PATH ?? '/sockjs'
  const sockJsUrl = buildUrl(httpBase, sockJsPath)

  // 3) 타이밍
  const retryMin = toNumber(rt.WS_RETRY_MIN_MS ?? ve?.VITE_WS_RETRY_MIN_MS, 1000)
  const retryMaxRaw = toNumber(rt.WS_RETRY_MAX_MS ?? ve?.VITE_WS_RETRY_MAX_MS, 30000)
  const retryMax = Math.max(retryMin, retryMaxRaw)
  const heartbeat = toNumber(rt.WS_HEARTBEAT_MS ?? ve?.VITE_WS_HEARTBEAT_MS, 10000)
  const reqTimeout = toNumber(rt.WS_REQUEST_TIMEOUT_MS ?? ve?.VITE_WS_REQUEST_TIMEOUT_MS, 20000)

  // 4) 토큰 전달
  const withTokenQuery = toBoolean(
    rt.WS_WITH_TOKEN_QUERY ?? ve?.VITE_WS_WITH_TOKEN_QUERY ?? false,
    false
  )

  // 5) 트랜스포트
  const transport: 'auto' | 'ws' | 'sockjs' = rt.WS_TRANSPORT ?? ve?.VITE_WS_TRANSPORT ?? 'auto'

  return {
    STOMP_TRANSPORT: transport,
    STOMP_BROKER_URL: brokerUrl,
    STOMP_SOCKJS_URL: sockJsUrl,
    STOMP_RETRY_MIN_MS: retryMin,
    STOMP_RETRY_MAX_MS: retryMax,
    STOMP_HEARTBEAT_OUTGOING: heartbeat,
    STOMP_HEARTBEAT_INCOMING: heartbeat,
    STOMP_REQUEST_TIMEOUT_MS: reqTimeout,
    STOMP_WS_WITH_TOKEN_QUERY: withTokenQuery,
    RUNTIME_ACCESS_TOKEN: rt.ACCESS_TOKEN ?? ve?.VITE_ACCESS_TOKEN, // string | undefined
  }
})()

/** 런타임 토큰 조회 — __APP_CONF__ 우선, 없으면 STOMP_ENV.RUNTIME_ACCESS_TOKEN */
export function getRuntimeAccessToken(): string | undefined {
  const g = globalThis as GlobalWithAppConf
  return g.__APP_CONF__?.ACCESS_TOKEN ?? STOMP_ENV.RUNTIME_ACCESS_TOKEN
}
