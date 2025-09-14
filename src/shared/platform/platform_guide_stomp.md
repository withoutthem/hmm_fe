# STOMP 실시간 모듈 사용 설명서 (SockJS 제거판 / Enterprise-Ready)

목적: React/Vite + TypeScript 환경에서 STOMP(WebSocket) 기반 실시간 메시징을 안전하고 일관된 방식으로 사용하기 위한 가이드입니다.  
구성: 빠른 시작 → 구조 설명 → API 레퍼런스 → ENV 매트릭스 → 운영 가이드(보안/장애/성능/테스트) → FAQ → 예시.

---

## 0) 지원 범위 & 전제

- 브라우저: 최신 Chrome/Edge/Safari/Firefox (DOM 환경)
- 번들러: Vite (+ TS path alias)
- 네트워크: WebSocket only (SockJS 제거)
- 인증: Authorization: Bearer <token> 헤더 또는 ?access_token= 쿼리(옵션)

---

## 1) 빠른 시작 (3분 컷)

### 1. 설치

```
pnpm add @stomp/stompjs
```

### 2. 환경변수(.env)

```
VITE_API_BASE_URL=http://localhost:18080/api
VITE_WS_BASE_URL=ws://localhost:18080
VITE_WS_PATH=/ws
VITE_WS_WITH_TOKEN_QUERY=false
VITE_WS_RETRY_MIN_MS=1000
VITE_WS_RETRY_MAX_MS=30000
VITE_WS_HEARTBEAT_MS=15000
VITE_WS_REQUEST_TIMEOUT_MS=20000
```

### 3. 앱 부팅 시 1회 연결 활성화

```
/* src/main.tsx (또는 App.tsx) */
import { connectOnce } from '@shared/platform/stomp'

connectOnce()
// 이후 ReactDOM.createRoot(...).render(<App />)
```

### 4. 화면에서 구독/발행 (아주 쉬운 예제)

```
import { useEffect, useState } from 'react'
import { publish, subscribe } from '@shared/platform/stomp'

type Msg = { id: string; value: string; timestamp: string }

export default function RealtimeExample() {
  const [list, setList] = useState<Msg[]>([])
  const topic = '/topic/data.updates'
  const appEndpoint = '/app/data.create'

  useEffect(() => {
    const off = subscribe<Msg>(topic, (m) => setList((prev) => [...prev, m]))
    return () => off()
  }, [])

  return (
    <div>
      <button onClick={() => publish(appEndpoint, { value: `new ${Date.now()}` })}>전송</button>
      <ul>{list.map((m) => <li key={m.id}>{m.value}</li>)}</ul>
    </div>
  )
}
```

---

## 2) 모듈 구조 개요

- env.ts
  - 런타임(globalThis.**APP_CONF**) + 빌드타임(import.meta.env)을 정규화해 STOMP_ENV 제공
  - ws://, wss:// 스킴 및 경로 결합 안전화(/ws/ws 중복 방지)

- stompClient.ts
  - 엔터프라이즈용 래퍼: 지수 백오프+지터, 정확한 구독 해지(refCount), 자동 재구독

- stompService.ts
  - 전역 싱글턴 인스턴스 + 퍼사드(publish/subscribe/connectOnce)

- StompProvider.tsx (선택)
  - React Context 훅(useStomp) 제공

---

## 3) API 레퍼런스

### 퍼사드 (@shared/platform/stomp)

- connectOnce(): void
  - 앱 수명주기 동안 최초 1회만 연결을 활성화

- publish(destination: string, data?: unknown): void
  - JSON 직렬화하여 서버로 발행(빈 페이로드 허용)

- subscribe<T>(destination: string, handler: (msg: T) => void): () => void
  - 토픽 구독. 반환 함수로 반드시 해지(cleanup)

- (옵션) stomp: StompClient
  - 저수준 이벤트/상태 제어가 필요할 때 접근

### 클라이언트 상태/이벤트

- 상태: stomp.getState() → 'idle' | 'connecting' | 'open' | 'closing' | 'closed'
- 활성: stomp.isActive() → boolean
- 이벤트: 'open' | 'connecting' | 'close' | 'error' | 'reconnecting' | 'message'

이벤트 리스너 등록/해제 예시:

```
const off = stomp.on('reconnecting', () => console.warn('네트워크 장애 감지'))
// 필요 시 off() 호출로 리스너 해제
```

---

## 4) 환경변수 매트릭스

| 키                         | 타입/예시            | 설명                                      | 기본값        |
| -------------------------- | -------------------- | ----------------------------------------- | ------------- |
| VITE_WS_BASE_URL           | ws://host:port       | WS 베이스(스킴 포함). 없으면 API에서 유도 | API 기준 유도 |
| VITE_WS_PATH               | /ws                  | STOMP 엔드포인트 경로                     | /ws           |
| VITE_WS_WITH_TOKEN_QUERY   | true/false           | 헤더 대신 ?access_token= 부착             | false         |
| VITE_WS_RETRY_MIN_MS       | 1000                 | 재연결 백오프 최소                        | 1000          |
| VITE_WS_RETRY_MAX_MS       | 30000                | 재연결 백오프 최대                        | 30000         |
| VITE_WS_HEARTBEAT_MS       | 15000                | in/out 하트비트                           | 10000         |
| VITE_WS_REQUEST_TIMEOUT_MS | 20000                | 요청 타임아웃(확장 시 사용)               | 20000         |
| VITE_API_BASE_URL          | http://host:port/api | WS 베이스 자동 유도 시 기준               | —             |
| VITE_ACCESS_TOKEN          | <jwt>                | 초기 토큰(런타임 덮어쓰기 가능)           | —             |

런타임 오버라이드(globalThis.**APP_CONF**):

- 동일 키(WS_BASE_URL, WS_PATH, ACCESS_TOKEN, …)로 브라우저 전역에서 덮어쓰기 가능

---

## 5) 보안/인증 가이드

- 기본: STOMP connectHeaders.Authorization = "Bearer <token>"
- 프록시/게이트웨이에서 헤더가 차단되면: VITE_WS_WITH_TOKEN_QUERY=true → URL에 ?access_token=
- 토큰 갱신: tokenProvider 교체(서비스 레이어) → 재연결 시 최신 토큰 적용
- 주의: 쿼리에 토큰 노출은 히스토리/로그에 남을 수 있으니 가능하면 헤더 우선

---

## 6) 장애/재연결 동작

- WebSocket 오류 → 'reconnecting' 이벤트 발생
- 지수 백오프+지터로 재연결 시도; 성공 시 백오프 리셋
- disconnect() 호출 시 자동 재연결 없음
- 구독 refCount 및 핸들러는 재연결 후 자동 복구(내부적으로 재구독)

---

## 7) 성능/품질 팁

- 대량 이벤트: 화면단 콜백에서 스로틀/배치 처리(예: requestAnimationFrame 기반)
- JSON 파싱: 페이로드를 평평(flat)한 구조로 유지
- 렌더링: 리스트 가상화(react-window/virtuoso 등) 권장

---

## 8) 테스트 전략

- 통합: 브로커 모킹 + e2e(연결/재연결/토큰 만료/네트워크 단절)
- 단위: subscribe/unsubscribe refCount 검증, JSON 파싱 실패 경로, 이벤트 브로드캐스트

---

## 9) FAQ

Q1. 연결은 되는데 메시지가 안 와요.  
A. 토픽 경로(/topic/...)와 권한(서버 라우팅 설정) 확인, JSON 스키마 확인(파싱 실패 로그 확인)

Q2. 기업망에서 연결 실패합니다.  
A. WebSocket 차단 여부 확인. 불가피하면 수신 전용 채널은 SSE 모듈 고려

Q3. Authorization 헤더가 전달되지 않습니다.  
A. 게이트웨이에서 헤더 스트립 여부 확인 → 임시로 VITE_WS_WITH_TOKEN_QUERY=true 사용

Q4. 메모리 누수가 걱정됩니다.  
A. subscribe() 반환된 해지 함수를 반드시 useEffect cleanup에서 호출

---

## 10) Provider 훅 사용 예시(선택)

ApplicationProvider 구성:

```
import { ThemeProvider } from '@mui/material/styles'
import theme from '@theme/theme'
import { type ReactNode } from 'react'
import { QueryProvider } from '@shared/platform/query'
import { StompProvider } from '@app/providers/StompProvider'

interface ApplicationProvidersProps { children: ReactNode }

const ApplicationProvider = ({ children }: ApplicationProvidersProps) => (
  <QueryProvider>
    <StompProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StompProvider>
  </QueryProvider>
)

export default ApplicationProvider
```

화면 컴포넌트:

```
import { useEffect } from 'react'
import { useStomp } from '@app/providers/StompProvider'

export default function WithProviderHook() {
  const { publish, subscribe } = useStomp()

  useEffect(() => {
    const off = subscribe<{ msg: string }>('/topic/ping', (m) => console.log(m.msg))
    return () => off()
  }, [subscribe])

  return <button onClick={() => publish('/app/ping', { at: Date.now() })}>Ping</button>
}
```

---

## 11) 변경 로그(핵심)

- SockJS 완전 제거 → WebSocket only
- 지연 구독 + 재연결 시 자동 재구독
- exactOptionalPropertyTypes 대응(ENV 타입 안전)
- TS/ESLint 경고 제로 지향(불필요 코드/분기 제거)

끝.
