// src/app/providers/StompProvider.tsx

import { createContext, type ReactNode, useContext, useEffect, useMemo } from 'react'
import { connectOnce, publish, stomp, subscribe } from '@/shared/platform/stomp'

// 컨텍스트에 필요한 퍼사드(facade) 최소 노출
type StompContextValue = {
  stomp: typeof stomp
  publish: typeof publish
  subscribe: typeof subscribe
}

// SSR 안전을 위한 기본값 null
const StompContext = createContext<StompContextValue | null>(null)

export function StompProvider({ children }: Readonly<{ children: ReactNode }>) {
  // 값은 싱글톤이므로 매 렌더마다 동일, useMemo로 레퍼런스 안정화
  const value = useMemo<StompContextValue>(() => ({ stomp, publish, subscribe }), [])

  useEffect(() => {
    // 앱 마운트에 맞춰 단 1회 연결 시도
    connectOnce()

    // 전역 연결은 일반적으로 앱 라이프사이클 동안 유지합니다.
  }, [])

  return <StompContext.Provider value={value}>{children}</StompContext.Provider>
}

// 앱 어디서든 호출해 사용하는 훅
export function useStomp() {
  const ctx = useContext(StompContext)
  if (!ctx) throw new Error('useStomp must be used within <StompProvider>')
  return ctx
}
