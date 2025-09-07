# SSE 모듈 사용 설명서

이 문서는 React 환경에서 `useSSE` 훅을 사용하여 서버로부터 실시간 이벤트를 수신하는 방법에 집중합니다.
API 베이스 URL 연동, 자동 재연결(Retry) 등은 모듈 내부에서 자동으로 처리됩니다.

## 1) 준비: HTTP 모듈과 환경변수 공유

SSE 모듈은 별도의 환경변수 설정이 필요 없습니다.
기존 **HTTP 모듈이 사용하는 `.env` 파일의 `VITE_API_BASE_URL` 값을 자동으로 인식**하여 사용합니다.

```bash
# .env.dev (예시)
# 이 값을 SSE 모듈이 함께 사용합니다.
VITE_API_BASE_URL=https://api.hpc.example.com
```

## 2) 빠른 시작

React 컴포넌트에서 `useSSE` 훅을 가져와 바로 호출합니다.
서버에서 이벤트가 발생할 때마다 `onMessage` 핸들러가 실행됩니다.

```tsx
import { useState } from 'react'
import { useSSE } from '@/platform/sse'
import type { SseMessage } from '@/platform/sse'

const NotificationViewer = () => {
  const [notifications, setNotifications] = useState<string[]>([])

  useSSE(
    { pathOrUrl: '/api/events/notifications' },
    {
      onMessage: (msg: SseMessage) => {
        // 새 메시지가 도착하면 상태에 추가
        setNotifications((prev) => [...prev, msg.data])
      },
    }
  )

  return (
    <ul>
      {notifications.map((text, i) => (
        <li key={i}>{text}</li>
      ))}
    </ul>
  )
}
```

## 3) 핸들러 상세

`useSSE` 훅의 두 번째 인자로 다양한 이벤트 핸들러를 등록할 수 있습니다.

```tsx
useSSE(
  { pathOrUrl: '/api/events' },
  {
    // 연결 성공 시 1회 호출
    onOpen: (url) => console.log('✅ SSE connected to:', url),

    // 이름 없는 기본 메시지 수신 시 호출
    onMessage: (msg) => console.log('💬 Message:', msg.data),

    // 명명된 이벤트 수신 시 호출 (4번 항목 참고)
    onNamedEvent: (name, msg) => console.log(`📢 [${name}]:`, msg.data),

    // 에러 발생 시(연결 끊김 등) 호출
    onError: (err) => console.error('❌ SSE error:', err),

    // 자동 재연결 시도 시 호출
    onRetry: (attempt, delay) =>
      console.warn(`🔁 Retrying... (attempt: ${attempt}, delay: ${delay}ms)`),
  }
)
```

## 4) 명명 이벤트(Named Events) 사용

서버가 `event: <이름>` 형식으로 메시지를 구분해서 보낼 때 사용합니다.
`namedEvents` 배열에 수신할 이벤트 이름을 등록하고, `onNamedEvent` 핸들러로 처리합니다.

```tsx
useSSE(
  {
    pathOrUrl: '/api/dashboard-events',
    // 'userActivity'와 'systemAlert' 이벤트를 구독
    namedEvents: ['userActivity', 'systemAlert'],
  },
  {
    onNamedEvent: (name, msg) => {
      if (name === 'userActivity') {
        // 유저 활동 이벤트 처리
        const activity = JSON.parse(msg.data)
        updateUserActivity(activity)
      } else if (name === 'systemAlert') {
        // 시스템 알림 이벤트 처리
        showAlert(msg.data)
      }
    },
  }
)
```

## 5) 요청 옵션(UseSseOptions) 사용

훅의 첫 번째 인자로 다양한 설정을 커스터마이징할 수 있습니다.

```tsx
useSSE({
  pathOrUrl: '/api/events',

  // 쿼리 파라미터 추가
  query: { userId: 123, filter: 'important' },

  // 인증이 필요한 경우 (CORS 쿠키 등 전송)
  withCredentials: true,

  // 재시도 정책 변경
  retry: {
    enabled: true, // 재시도 활성화 (기본값)
    maxAttempts: 5, // 최대 5번만 재시도
    minDelayMs: 2000, // 최소 지연 2초
    maxDelayMs: 60000, // 최대 지연 60초
  },
})
```

## 6) 수동으로 연결 시작/종료

`autoStart: false` 옵션을 주고, 훅이 반환하는 `start()`와 `stop()` 함수로 연결을 직접 제어할 수 있습니다.

```tsx
const { start, stop, open } = useSSE(
  {
    pathOrUrl: '/api/realtime-log',
    autoStart: false, // 자동으로 시작하지 않음
  },
  { onMessage: (msg) => addLog(msg.data) }
)

// 사용자가 버튼을 클릭하면 연결 시작
return (
  <div>
    <button onClick={start} disabled={open}>
      로그 스트리밍 시작
    </button>
    <button onClick={stop} disabled={!open}>
      중지
    </button>
  </div>
)
```

## 7) 참고: 데이터 파싱

`onMessage`나 `onNamedEvent` 핸들러가 받는 `msg.data`는 항상 **문자열(string)**입니다.
서버가 JSON 객체를 문자열로 보냈다면, 아래와 같이 직접 파싱해서 사용해야 합니다.

```tsx
onMessage: (msg: SseMessage) => {
  try {
    const jsonData = JSON.parse(msg.data)
    // 파싱된 객체 사용
    console.log(jsonData.user.name)
  } catch (e) {
    console.error('Failed to parse SSE data:', e)
  }
}
```

끝.
