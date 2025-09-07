import { useEffect, useMemo, useRef, useState } from 'react'
import type { SseController, SseMessage, SseOptions, SseError } from './types'
import { createSseClient } from '@shared/platform/sse/client'

type Handlers = {
  onOpen?: (url: string) => void
  onMessage?: (msg: SseMessage) => void
  onError?: (err: SseError) => void
  onRetry?: (attempt: number, delayMs: number) => void
  onNamedEvent?: (name: string, msg: SseMessage) => void
}

export type UseSseOptions = Omit<
  SseOptions,
  'onOpen' | 'onMessage' | 'onError' | 'onRetry' | 'onNamedEvent'
> & {
  autoStart?: boolean
}

export const useSSE = (opts: UseSseOptions, handlers?: Handlers) => {
  const { autoStart = true, ...rest } = opts
  const [open, setOpen] = useState<boolean>(false)

  // ✅ PATCH ①: 핸들러를 ref에 저장하여 참조 안정성 확보
  const handlersRef = useRef(handlers)
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  // 옵션이 변경될 때만 재연결을 트리거하기 위한 의존성 키
  const depKey = useMemo<string>(() => {
    const retry = rest.retry ?? {}
    const query = rest.query ?? {}
    const named = rest.namedEvents ?? []
    return JSON.stringify({
      path: rest.pathOrUrl,
      cred: rest.withCredentials ?? false,
      autoAuth: rest.autoAuth ?? true,
      query,
      retry: {
        enabled: retry.enabled ?? true,
        min: retry.minDelayMs ?? 1000,
        max: retry.maxDelayMs ?? 30000,
        attempts: rest.retry?.maxAttempts ?? null,
      },
      named,
    })
  }, [rest])

  const controller = useMemo<SseController>(() => {
    const c = createSseClient({
      ...rest,
      // ✅ PATCH ①: 항상 최신 핸들러를 참조하도록 ref 사용
      onOpen: () => {
        setOpen(true)
        handlersRef.current?.onOpen?.(c.getUrl())
      },
      onMessage: (m: SseMessage) => handlersRef.current?.onMessage?.(m),
      onError: (e: SseError) => {
        setOpen(false)
        handlersRef.current?.onError?.(e)
      },
      onRetry: (attempt: number, delayMs: number) =>
        handlersRef.current?.onRetry?.(attempt, delayMs),
      onNamedEvent: (name: string, msg: SseMessage) =>
        handlersRef.current?.onNamedEvent?.(name, msg),
    })
    return c
    // ✅ PATCH ①: 의존성 배열에서 handlers 제거, 이제 옵션(depKey) 변경 시에만 재생성
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey])

  useEffect(() => {
    if (autoStart) {
      controller.start()
    }
    return () => {
      controller.stop()
    }
  }, [controller, autoStart])

  return {
    start: controller.start,
    stop: controller.stop,
    isOpen: controller.isOpen,
    getUrl: controller.getUrl,
    open,
  }
}
