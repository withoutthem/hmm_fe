# STOMP 실시간 모듈 사용 설명서 (Enterprise-Ready)

> 목적: **React/Vite + TypeScript** 환경에서 **STOMP(WebSocket/SockJS)** 기반 실시간 메시징을 **안전하고 일관된 방식으로** 사용하기 위한 가이드입니다.  
> 이 문서는 **빠른 시작 → 구조 설명 → API 레퍼런스 → ENV 매트릭스 → 운영 가이드(장애/보안/성능/테스트)** 순으로 구성됩니다.

---

## 0. 지원 범위 & 전제

- 브라우저: 최신 Chrome/Edge/Safari/Firefox (DOM 환경)
- 번들러: Vite(+ TS path alias)
- 네트워크: WebSocket 우선, **자동 폴백**으로 SockJS 지원
- 인증: `Authorization: Bearer <token>` 헤더 또는 `?access_token=` 쿼리(옵션)

---

## 1. 빠른 시작 (3분 컷)

### 1) 설치

```bash
# 런타임
pnpm add @stomp/stompjs sockjs-client
# 타입(선택): TS7016 방지
pnpm add -D @types/sockjs-client
```

### 2) 환경변수(.env)

```env
VITE_API_BASE_URL=http://localhost:18080/api
VITE_WS_BASE_URL=ws://localhost:18080
VITE_WS_PATH=/ws
VITE_WS_TRANSPORT=auto              # auto|ws|sockjs
VITE_WS_WITH_TOKEN_QUERY=false      # true면 URL에 ?access_token=
VITE_WS_SOCKJS_PATH=/sockjs
VITE_WS_RETRY_MIN_MS=1000
VITE_WS_RETRY_MAX_MS=30000
VITE_WS_HEARTBEAT_MS=15000
VITE_WS_REQUEST_TIMEOUT_MS=20000
```

### 3) 앱 부팅 시 연결(한 번만)

앱 진입점에서 **최초 1회** 연결을 활성화합니다.

```tsx
// src/main.tsx (또는 App.tsx)
import { connectOnce } from '@shared/platform/stomp'

connectOnce()

// 이후 ReactDOM.createRoot(...).render(<App />)
```

### 4) 화면에서 구독/발행(아주 쉬운 예제)

```tsx
import { useEffect, useState } from 'react'
import { publish, subscribe } from '@shared/platform/stomp'

type Msg = { id: string; value: string; timestamp: string }

export default function RealtimeExample() {
  const [list, setList] = useState<Msg[]>([])
  const topic = '/topic/data.updates'
  const appEndpoint = '/app/data.create'

  useEffect(() => {
    // 구독: 컴포넌트 언마운트 시 반드시 해지!
    const off = subscribe<Msg>(topic, (m) => setList((prev) => [...prev, m]))
    return () => off()
  }, [])

  const send = () => {
    publish(appEndpoint, { value: `new ${Date.now()}` })
  }

  return (
    <div>
      <button onClick={send}>전송</button>
      <ul>
        {list.map((m) => (
          <li key={m.id}>{m.value}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 2. 모듈 구조 개요

- `env.ts`
  - 런타임 `__APP_CONF__` + 빌드타임 `import.meta.env`를 **정규화**하여 최종 `STOMP_ENV`를 제공합니다.
  - `/ws/ws` 같은 경로 중복을 **방지**하고, SockJS URL(HTTP 베이스)도 생성합니다.
- `stompClient.ts`
  - 엔터프라이즈용 **STOMP 클라이언트 래퍼**.
  - **지수 백오프+지터**, **1회 SockJS 폴백**, **정확한 구독 해지(id 기반)**, **이벤트 버스**.
- `stompService.ts`
  - 전역 싱글턴 인스턴스 + 퍼사드(`publish/subscribe/connectOnce`).
- `StompProvider.tsx` (선택)
  - React Context 훅(`useStomp`)을 쓰고 싶을 때 사용.

---

## 3. API 레퍼런스

### 3.1 퍼사드 API (`@shared/platform/stomp`)

- `connectOnce(): void`
  - 앱 수명주기 동안 **최초 1회만** 연결.
- `publish(destination: string, data?: unknown): void`
  - 서버로 JSON 직렬화하여 발행. 빈 페이로드 허용.
- `subscribe<T>(destination: string, handler: (msg: T) => void): () => void`
  - 토픽 구독. **반환 함수로 반드시 해지**.
- (옵션) `stomp: StompClient`
  - 저수준 제어(이벤트 on/off, 상태 조회)가 필요할 때.

### 3.2 클라이언트 이벤트 (옵셔널)

- `open(frame)`, `connecting()`, `close()`, `error(frame)`, `reconnecting()`, `message(msg)`
- 사용 예:

```ts
const off = stomp.on('reconnecting', () => console.warn('네트워크 장애 감지'))
// 필요 시 off() 호출로 리스너 해제
```

### 3.3 상태 조회

```ts
stomp.getState() // 'idle' | 'connecting' | 'open' | 'closing' | 'closed'
stomp.isActive() // boolean
```

---

## 4. 환경변수 매트릭스(요약)

| 키                           | 타입/예시                  | 설명                                                 | 기본값          |
| ---------------------------- | -------------------------- | ---------------------------------------------------- | --------------- |
| `VITE_WS_TRANSPORT`          | `auto` \| `ws` \| `sockjs` | 전송 전략 선택. `auto`는 WS 실패시 1회 SockJS로 폴백 | `auto`          |
| `VITE_WS_BASE_URL`           | `ws://host:port`           | WS 베이스(스킴 포함). 비워두면 API 베이스에서 유도   | (API 기준 유도) |
| `VITE_WS_PATH`               | `/ws`                      | STOMP 엔드포인트 경로                                | `/ws`           |
| `VITE_WS_SOCKJS_PATH`        | `/sockjs`                  | SockJS HTTP 엔드포인트 경로                          | `/sockjs`       |
| `VITE_WS_WITH_TOKEN_QUERY`   | `true/false`               | 헤더 대신 `?access_token=`로 부착                    | `false`         |
| `VITE_WS_RETRY_MIN_MS`       | `1000`                     | 백오프 최소                                          | `1000`          |
| `VITE_WS_RETRY_MAX_MS`       | `30000`                    | 백오프 최대                                          | `30000`         |
| `VITE_WS_HEARTBEAT_MS`       | `15000`                    | in/out 하트비트                                      | `10000`(기본)   |
| `VITE_WS_REQUEST_TIMEOUT_MS` | `20000`                    | 요청 타임아웃(확장용)                                | `20000`         |
| `VITE_API_BASE_URL`          | `http://host:port/api`     | WS 베이스 자동 유도 시 기준                          | —               |
| `VITE_ACCESS_TOKEN`          | `<jwt>`                    | 초기 토큰(런타임 덮어쓰기 가능)                      | —               |

**런타임 오버라이드(`__APP_CONF__`)**

- 동일 키(`WS_BASE_URL`, `WS_PATH`, `ACCESS_TOKEN`, …)로 브라우저 전역에서 덮어쓸 수 있습니다.
- 예: 페이지 삽입 스크립트에서 `globalThis.__APP_CONF__ = { ACCESS_TOKEN: '...' }`.

---

## 5. 보안/인증 가이드

- **기본**: STOMP `connectHeaders.Authorization = "Bearer <token>"` 적용.
- **프록시/게이트웨이에서 헤더 차단**: `VITE_WS_WITH_TOKEN_QUERY=true`로 전환 → URL에 `?access_token=` 부착.
- **토큰 갱신**: `tokenProvider` 교체(서비스 레이어) → 재연결 시 최신 토큰 사용.
- **주의**: URL 쿼리에 토큰을 노출하면 브라우저 히스토리/로그에 남을 수 있습니다. 가능한 헤더 사용을 권장합니다.

---

## 6. 장애/재연결 동작

- 웹소켓 오류 발생 시:
  1. 이벤트 `reconnecting` 발생
  2. `transport='auto'`이고 아직이면 **SockJS로 1회 전환**
  3. 그 외에는 **지수 백오프+지터**로 재연결
- 연결 성공 시: 백오프 **리셋**
- 수동 종료(`disconnect`) 후에는 자동 재연결 **하지 않음**

---

## 7. 폴백·호환성

- **SockJS**: WS가 막힌 기업망/모바일/프록시 환경에서 **HTTP 기반 터널**로 동작.
- **SSE(옵션)**: 수신 전용이 필요한 환경에서는 **SSE 전송 모듈**을 별도 추가하여 같은 퍼사드의 `subscribe`만 사용하고, `publish`는 REST로 분리하는 것을 권장.

---

## 8. 성능/품질 팁

- **대량 토픽**: 화면단 콜백에서 **스로틀/배치**(예: 16ms 단위) 적용을 고려하세요.
- **JSON 파싱 비용**: 메시지 포맷을 가능한 **평평(flat)**하게 유지하면 파싱/GC 부담이 낮습니다.
- **리스트 렌더링**: 가상화(list virtualization) 사용을 권장.

---

## 9. 테스트 전략

- **통합 테스트**: Stomp 브로커 모킹(예: 임시 브로커 컨테이너) + e2e 시나리오
  - 연결/재연결/토큰 만료/네트워크 단절/SockJS 폴백
- **단위 테스트**:
  - `subscribe`/`unsubscribe` refCount 및 실제 `unsubscribe()` 호출 검증
  - JSON 파싱 실패 경로, 이벤트 버스 브로드캐스트

---

## 10. 트러블슈팅(FAQ)

**Q1. 연결은 되는데 메시지가 안 와요.**

- 토픽 경로(`/topic/...`)와 권한(서버 라우팅 설정) 확인
- JSON 스키마가 서버와 일치하는지 확인(파싱 실패 로그 체크)

**Q2. 기업망에서 연결 실패합니다.**

- `VITE_WS_TRANSPORT=sockjs` 강제
- 프록시에서 WebSocket 차단 여부 확인, 필요 시 **SSE 대체** 고려

**Q3. Authorization 헤더가 전달되지 않습니다.**

- 게이트웨이가 헤더를 스트립하는지 확인
- 임시로 `VITE_WS_WITH_TOKEN_QUERY=true` 사용(가능하면 헤더 복원 권장)

**Q4. 구독 해지를 깜박했습니다. 메모리 누수가 걱정됩니다.**

- `subscribe()` 반환 함수를 **반드시** `useEffect` cleanup에서 호출하세요.

---

## 11. 예시: Provider를 사용한 훅 패턴(선택)

### ApplicationProvider

```tsx
import { ThemeProvider } from '@mui/material/styles'
import theme from '@theme/theme'
import { type ReactNode } from 'react'
import { QueryProvider } from '@shared/platform/query'
import { StompProvider } from '@app/providers/StompProvider'

interface ApplicationProvidersProps {
  children: ReactNode
}

const ApplicationProvider = ({ children }: ApplicationProvidersProps) => (
  <QueryProvider>
    <StompProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StompProvider>
  </QueryProvider>
)

export default ApplicationProvider
```

### 화면 예시(Provider 훅 사용)

```tsx
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

## 12. 변경 로그(요점)

- 정확한 구독 해지(id 기반) 및 refCount 관리
- 지수 백오프+지터, 성공 시 리셋
- WebSocket 실패 시 **1회 SockJS 폴백**
- ENV 정규화(`/ws/ws` 방지), 토큰 헤더/쿼리 양방향 지원
- `exactOptionalPropertyTypes`, `no-unsafe-*` 등 **TS/ESLint 제로 경고** 지향

---

## 13. 라이선스/저작권

- 내부 서비스/프로젝트 표준에 따르며, 외부 배포 시 각 의존 모듈(stompjs, sockjs-client)의 라이선스를 준수하세요.

---

### 부록 A. 문제 해결 체크리스트(요약)

- 타입 오류: `@types/sockjs-client` 설치 또는 로컬 d.ts
- 경로 별칭: `tsconfig.json`의 `baseUrl`/`paths` 확인
- DOM 누락: `tsconfig.compilerOptions.lib`에 `"DOM"` 포함
- 네트워크: 프록시/방화벽 정책 확인, 필요 시 `sockjs` 또는 `SSE` 옵션 검토

---
