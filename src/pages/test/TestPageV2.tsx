/* eslint-disable */
import { Button, styled, TextField, Typography, Divider, Box } from '@mui/material'
import { ColumnBox, FlexBox } from '@shared/ui/layoutUtilComponents'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useWs } from '@app/providers/WsProvider'
import { createStompFrame, type StompFrame } from '@shared/platform/ws/stomp'
import { useSSE } from '@shared/platform/sse' // ✅ 새로 만든 SSE 훅

// 단일 메시지 타입 정의
type Msg = { type: 'chatbot' | 'user'; text: string; ts: number }

const TestPage = () => {
  // -------------------------------
  // Auto-scroll 훅 (채팅/로그 박스 자동 스크롤)
  const useAutoScroll = <T extends HTMLElement>(deps: unknown[]) => {
    const ref = useRef<T | null>(null)
    useEffect(() => {
      const el = ref.current
      if (el) el.scrollTop = el.scrollHeight
    }, deps)
    return ref
  }

  // -------------------------------
  // WebSocket (Livechat 테스트)
  const { publish, subscribe, ws } = useWs()
  const [wsTopic, setWsTopic] = useState('chat:test')
  const [sendText, setSendText] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [wsLogs, setWsLogs] = useState<string[]>([])
  const chatRef = useAutoScroll<HTMLDivElement>([messages])
  const logRef = useAutoScroll<HTMLPreElement>([wsLogs])

  const log = (s: string) => setWsLogs((p) => [...p, `🕑 [${time()}] ${s}`])

  // 현재 WebSocket 상태
  const wsState = (ws && (ws as any).readyState) ?? WebSocket.CLOSED
  const wsOpen = wsState === WebSocket.OPEN
  const wsStatus = useMemo(() => {
    return ['connecting', 'connected', 'closing', 'disconnected'][wsState] ?? 'idle'
  }, [wsState])

  // 서버 구독/해제
  useEffect(() => {
    if (!wsTopic.trim()) return
    if (wsOpen) {
      publish(wsTopic, createStompFrame('/test/bus/subscribe', { topic: wsTopic }))
      log(`📡 Subscribed to ${wsTopic}`)
    }
    return () => {
      publish(wsTopic, createStompFrame('/test/bus/unsubscribe', { topic: wsTopic }))
      log(`❌ Unsubscribed from ${wsTopic}`)
    }
  }, [wsOpen, wsTopic, publish])

  // 메시지 수신
  useEffect(() => {
    if (!wsTopic.trim()) return
    const off = subscribe(wsTopic, (m: unknown) => {
      const t = toText(m)
      log(`💬 recv @${wsTopic}: ${t}`)
      setMessages((p) => [...p, { type: 'chatbot', text: t, ts: Date.now() }])
    })
    return () => off()
  }, [wsTopic, subscribe])

  // 메시지 발행
  const sendPublish = () => {
    const text = sendText.trim()
    if (!text || !wsOpen) return
    const f: StompFrame = createStompFrame('/test/bus/publish', {
      topic: wsTopic,
      data: { text },
    })
    publish(wsTopic, f)
    log(`✉️ publish @${wsTopic}: ${text}`)
    setMessages((p) => [...p, { type: 'user', text, ts: Date.now() }])
    setSendText('')
  }

  // Clock 시작 요청
  const startClock = () => {
    if (!wsOpen) return
    publish(wsTopic, createStompFrame('/test/clock/start'))
    log('⏰ Clock start requested')
  }

  // -------------------------------
  // SSE (테스트 스트리밍)
  const [sseLogs, setSseLogs] = useState<string[]>([])
  const [sseItems, setSseItems] = useState<string[]>([])
  const sseLogRef = useAutoScroll<HTMLPreElement>([sseLogs])
  const sseListRef = useAutoScroll<HTMLDivElement>([sseItems])

  const {
    open: sseOpen,
    start: startSse,
    stop: stopSse,
  } = useSSE(
    { pathOrUrl: '/api/test/sse', autoStart: false, namedEvents: ['tick'] },
    {
      onOpen: (url) => setSseLogs((p) => [...p, `✅ open: ${url}`]),
      onMessage: (m) => {
        setSseItems((p) => [...p, m.data])
        setSseLogs((p) => [...p, `📥 data: ${m.data}`])
      },
      onNamedEvent: (eventName, message) => {
        const data = message.data
        setSseItems((p) => [...p, data])
        setSseLogs((p) => [...p, `📥 [${eventName}] data: ${data}`])
      },
      onError: (err) => setSseLogs((p) => [...p, `❌ error: ${err}`]),
      onRetry: (a, d) => setSseLogs((p) => [...p, `🔁 retry #${a} in ${d}ms`]),
    }
  )

  // -------------------------------
  // UI
  return (
    <Root>
      {/* WebSocket 패널 */}
      <Panel>
        <Header>
          <Typography variant="subtitle1">💬 WebSocket (Livechat)</Typography>
          <Status $ok={wsOpen}>{wsStatus}</Status>
        </Header>

        <Row>
          <TextField
            label="Topic"
            size="small"
            value={wsTopic}
            onChange={(e) => setWsTopic(e.target.value)}
          />
        </Row>
        <Row>
          <TextField
            label="Message"
            size="small"
            value={sendText}
            onChange={(e) => setSendText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendPublish()}
            disabled={!wsOpen}
          />
          <Button variant="contained" onClick={sendPublish} disabled={!wsOpen}>
            Send
          </Button>
          <Button variant="outlined" onClick={startClock} disabled={!wsOpen}>
            Start Clock
          </Button>
        </Row>

        <SubHeader>📥 Received</SubHeader>
        <ChatArea ref={chatRef}>
          {messages.map((m, i) => (
            <MsgLine key={`${i}-${m.ts}`} data-type={m.type}>
              <span>{m.type === 'user' ? '🙋 You' : '🤖 Bot'}</span>
              <MsgBubble>{m.text}</MsgBubble>
              <small>{new Date(m.ts).toLocaleTimeString()}</small>
            </MsgLine>
          ))}
        </ChatArea>

        <SubHeader>📝 WS Logs</SubHeader>
        <LogBox ref={logRef}>{wsLogs.join('\n') || 'no logs yet'}</LogBox>
      </Panel>

      <Divider orientation="vertical" flexItem />

      {/* SSE 패널 */}
      <Panel>
        <Header>
          <Typography variant="subtitle1">📡 SSE (Server-Sent Events)</Typography>
          <Status $ok={sseOpen}>{sseOpen ? 'connected' : 'disconnected'}</Status>
        </Header>

        <Row>
          <Button variant="contained" onClick={startSse} disabled={sseOpen}>
            ▶️ Start
          </Button>
          <Button variant="outlined" onClick={stopSse} disabled={!sseOpen}>
            ⏹ Stop
          </Button>
        </Row>

        <SubHeader>📝 SSE Logs</SubHeader>
        <LogBox ref={sseLogRef}>{sseLogs.join('\n') || 'no logs yet'}</LogBox>

        <SubHeader>📥 SSE Items</SubHeader>
        <ListBox ref={sseListRef}>
          {sseItems.map((line, idx) => (
            <div key={`${idx}-${line.slice(0, 8)}`}>{line}</div>
          ))}
        </ListBox>
      </Panel>
    </Root>
  )
}

export default TestPage

// ---------- utils ----------
const time = () => new Date().toLocaleTimeString()
const toText = (x: unknown) => {
  try {
    if (typeof x === 'string') return x
    if (x instanceof Event) return `[Event type=${x.type}]`
    return JSON.stringify(x)
  } catch {
    return String(x)
  }
}

// ---------- styles ----------
const Root = styled(FlexBox)({
  width: '100vw',
  height: '100vh',
  gap: 12,
  padding: '72px 10px 10px',
})
const Panel = styled(ColumnBox)({
  flex: 1,
  border: '1px solid #ddd',
  borderRadius: 8,
  padding: 12,
  gap: 10,
  overflow: 'hidden',
})
const Header = styled(FlexBox)({ alignItems: 'center', justifyContent: 'space-between' })
const SubHeader = styled(Typography)({ fontSize: 12, opacity: 0.8 })
const Row = styled(FlexBox)({ gap: 8, alignItems: 'center' })
const Status = styled('span')<{ $ok: boolean }>(({ $ok }) => ({
  padding: '2px 8px',
  borderRadius: 999,
  fontSize: 12,
  border: '1px solid',
  borderColor: $ok ? '#0a0' : '#a00',
  color: $ok ? '#0a0' : '#a00',
}))
const ChatArea = styled('div')({
  flex: 1,
  minHeight: 140,
  maxHeight: 260,
  overflowY: 'auto',
  background: '#f7f7f7',
  border: '1px solid #eee',
  borderRadius: 6,
  padding: 8,
})
const MsgLine = styled('div')({
  display: 'grid',
  gridTemplateColumns: '60px 1fr auto',
  alignItems: 'start',
  gap: 8,
  '&[data-type="user"] span': { color: '#1976d2' },
  '&[data-type="chatbot"] span': { color: '#9c27b0' },
  '& small': { opacity: 0.6, fontSize: 11, alignSelf: 'center' },
})
const MsgBubble = styled('div')({
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: 12,
  padding: '8px 10px',
  maxWidth: 520,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
})
const LogBox = styled('pre')({
  height: 160,
  background: '#000',
  color: '#0f0',
  padding: 8,
  borderRadius: 6,
  overflow: 'auto',
  fontSize: 12,
  lineHeight: 1.5,
})
const ListBox = styled(Box)({
  height: 160,
  padding: '8px 12px',
  background: '#fff',
  border: '1px solid #eee',
  borderRadius: 6,
  overflow: 'auto',
  fontSize: 14,
})
