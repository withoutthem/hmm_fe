import { ENV } from '../http'
import {
  type SseController,
  SseError,
  type SseMessage,
  type SseOptions,
} from '@shared/platform/sse/types'

/* ------------------ 유틸리티 함수 및 상수 ------------------ */

//  SSR 환경에서도 코드가 터지지 않도록 브라우저 환경인지 체크
const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined'

const isAbsUrl = (s: string): boolean => /^https?:\/\//i.test(s)
const normalizeBase = (base: string): string => (base.endsWith('/') ? base : `${base}/`)
const sleep = (ms: number): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, ms))

const toAbsoluteApiUrl = (pathOrUrl: string): string => {
  try {
    return new URL(pathOrUrl).toString()
  } catch {
    /* pass */
  }
  const base = ENV.API_BASE_URL
  if (isAbsUrl(base)) {
    const right0 = pathOrUrl.replace(/^\//, '')
    const right = right0.startsWith('api/') ? right0.slice(4) : right0
    return new URL(right, normalizeBase(base)).toString()
  }
  if (pathOrUrl.startsWith('/api/')) return pathOrUrl
  const right = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${base.replace(/\/+$/, '')}${right}`
}

const appendQuery = (url: string, q?: SseOptions['query']): string => {
  if (!q || !IS_BROWSER) return url
  const u = new URL(url, location.origin)
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null) u.searchParams.set(k, String(v))
  })
  return u.toString()
}

const appendAuthToken = (url: string): string => {
  if (!IS_BROWSER) return url
  const token = (globalThis as Record<string, unknown>).__ACCESS_TOKEN__
  if (typeof token === 'string' && token) {
    const u = new URL(url, location.origin)
    u.searchParams.set('token', token)
    return u.toString()
  }
  return url
}

const computeDelay = (attempt: number, minMs: number, maxMs: number): number => {
  const pow = Math.min(10, attempt)
  const raw = minMs * Math.pow(2, pow)
  const jitter = 0.8 + Math.random() * 0.4
  return Math.min(Math.floor(raw * jitter), maxMs)
}

/* ------------------ 메인 클라이언트 생성자 ------------------ */

export const createSseClient = (opts: SseOptions): SseController => {
  let es: EventSource | null = null
  let open = false
  let stopped = false
  let attempt = 0
  let connectedUrl = ''

  const { retry, namedEvents, autoAuth = true, ...hooks } = opts

  const buildUrl = (): string => {
    let url = toAbsoluteApiUrl(opts.pathOrUrl)
    url = appendQuery(url, opts.query)
    if (autoAuth) {
      url = appendAuthToken(url)
    }
    return url
  }

  const wire = (): void => {
    // ✅ 브라우저 환경이 아니면 아예 연결을 시도하지 않음
    if (!IS_BROWSER) {
      console.warn('SSE client: Not in a browser environment. Connection skipped.')
      return
    }

    const url = buildUrl()
    connectedUrl = url

    const eventSourceInit: EventSourceInit = {}
    if (typeof opts.withCredentials === 'boolean') {
      eventSourceInit.withCredentials = opts.withCredentials
    }

    es = new EventSource(url, eventSourceInit)

    es.onopen = () => {
      open = true
      attempt = 0
      hooks.onOpen?.(es!)
    }

    es.onmessage = (ev: MessageEvent<string>) => {
      const msg: SseMessage = { data: ev.data }
      if (ev.lastEventId) msg.id = ev.lastEventId
      hooks.onMessage?.(msg)
    }

    if (namedEvents) {
      namedEvents.forEach((name) => {
        es!.addEventListener(name, (ev: MessageEvent<string>) => {
          const msg: SseMessage = { data: ev.data, event: name }
          if (ev.lastEventId) msg.id = ev.lastEventId
          hooks.onNamedEvent?.(name, msg)
        })
      })
    }

    es.onerror = async (ev: Event) => {
      const err = new SseError(`SSE connection failed for URL: ${connectedUrl}`, { cause: ev })
      hooks.onError?.(err)

      open = false
      es?.close()
      es = null
      if (stopped || retry?.enabled === false) return

      attempt += 1
      const maxAttempts = retry?.maxAttempts
      if (typeof maxAttempts === 'number' && attempt > maxAttempts) return

      const minDelayMs = retry?.minDelayMs ?? 1000
      const maxDelayMs = retry?.maxDelayMs ?? 30_000
      const delay = computeDelay(attempt - 1, minDelayMs, maxDelayMs)
      hooks.onRetry?.(attempt, delay)
      await sleep(delay)
      if (!stopped) wire()
    }
  }

  const start = (): void => {
    if (es || open) return
    stopped = false
    wire()
  }

  const stop = (): void => {
    stopped = true
    open = false
    es?.close()
    es = null
  }

  return { start, stop, isOpen: () => open, getUrl: buildUrl }
}
