/* eslint-disable */
import {
  Button,
  styled,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Divider,
  Box,
} from '@mui/material'
import { ColumnBox, FlexBox } from '@shared/ui/layoutUtilComponents'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useWs } from '@app/providers/WsProvider'
import { createStompFrame, type StompFrame } from '@shared/platform/ws/stomp'

type Msg = { type: 'chatbot' | 'user'; text: string; ts: number }

const TestPage = () => {
  // -------------------------------
  // auto-scroll
  const useAutoScroll = <T extends HTMLElement>(deps: unknown[]) => {
    const ref = useRef<T | null>(null)
    useEffect(() => {
      const el = ref.current
      if (el) el.scrollTop = el.scrollHeight
    }, deps)
    return ref
  }

  // -------------------------------
  // WebSocket
  const { publish, subscribe, ws } = useWs()
  const [wsTopic, setWsTopic] = useState('chat:test') // 클라 로컬 라우팅 키(그대로 유지)
  const [sendText, setSendText] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [wsLogs, setWsLogs] = useState<string[]>([])
  const chatRef = useAutoScroll<HTMLDivElement>([messages])
  const logRef = useAutoScroll<HTMLPreElement>([wsLogs])

  const log = (s: string) => setWsLogs((p) => [...p, `[${time()}] ${s}`])

  // 상태 표기
  const wsState = (() => {
    const s = (ws && (ws as any).readyState) as number | undefined
    return s ?? WebSocket.CLOSED
  })()
  const wsOpen = wsState === WebSocket.OPEN
  const wsStatus = useMemo(() => {
    switch (wsState) {
      case 0:
        return 'connecting'
      case 1:
        return 'connected'
      case 2:
        return 'closing'
      default:
        return 'disconnected'
    }
  }, [wsState])

  // 서버 구독/해제 (STOMP-Frame)
  useEffect(() => {
    if (!wsTopic.trim()) return
    if (wsOpen) {
      publish(wsTopic, createStompFrame('/test/bus/subscribe', { topic: wsTopic }))
      log(`→ subscribe ${wsTopic}`)
    }
    return () => {
      publish(wsTopic, createStompFrame('/test/bus/unsubscribe', { topic: wsTopic }))
      log(`→ unsubscribe ${wsTopic}`)
    }
    // wsOpen, wsTopic 변화 시 처리
  }, [wsOpen, wsTopic, publish])

  // 수신 렌더(클라 라우팅은 topic 기반 그대로)
  useEffect(() => {
    if (!wsTopic.trim()) return
    const off = subscribe(wsTopic, (m: unknown) => {
      const t = toText(m)
      log(`recv @${wsTopic}: ${t}`)
      setMessages((p) => [...p, { type: 'chatbot', text: t, ts: Date.now() }])
    })
    log(`handler ready for "${wsTopic}"`)
    return () => {
      off()
      log(`handler off for "${wsTopic}"`)
    }
  }, [wsTopic, subscribe])

  const sendPublish = () => {
    const text = sendText.trim()
    if (!text) return
    if (!wsOpen) {
      log('send blocked: socket not open')
      return
    }
    // STOMP-Frame: /test/bus/publish
    const f: StompFrame = createStompFrame('/test/bus/publish', { topic: wsTopic, data: { text } })
    publish(wsTopic, f)
    log(`publish @${wsTopic}: ${text}`)
    setMessages((p) => [...p, { type: 'user', text, ts: Date.now() }])
    setSendText('')
  }

  const startClock = () => {
    if (!wsOpen) {
      log('clock blocked: socket not open')
      return
    }
    // STOMP-Frame: /test/clock/start
    publish(wsTopic, createStompFrame('/test/clock/start'))
    log('clock start requested')
  }

  // -------------------------------
  // SSE
  const [ssePath, setSsePath] = useState('/api/test/sse') // 프록시 사용 시 /api 권장
  const [withCred, setWithCred] = useState(false)
  const [sseOpen, setSseOpen] = useState(false)
  const [sseLogs, setSseLogs] = useState<string[]>([])
  const [sseItems, setSseItems] = useState<string[]>([])
  const sseRef = useRef<EventSource | null>(null)
  const sseLogRef = useAutoScroll<HTMLPreElement>([sseLogs])
  const sseListRef = useAutoScroll<HTMLDivElement>([sseItems])
  const slog = (s: string) => setSseLogs((p) => [...p, `[${time()}] ${s}`])

  const startSse = () => {
    if (sseOpen) return
    const url = buildUrl(ssePath) // /api/test/sse → dev에서 Vite 프록시로 18080에 전달
    const es = new EventSource(url, { withCredentials: withCred })
    sseRef.current = es
    es.onopen = () => {
      setSseOpen(true)
      slog(`open: ${url}`)
    }
    es.onmessage = (ev) => {
      slog(`data: ${ev.data}`)
      setSseItems((p) => [...p, ev.data])
    }
    es.onerror = (ev) => {
      slog(`error: ${toText(ev)}`)
    }
  }
  const stopSse = () => {
    sseRef.current?.close()
    sseRef.current = null
    if (sseOpen) slog('closed')
    setSseOpen(false)
  }
  useEffect(() => () => stopSse(), [])

  // -------------------------------
  // UI
  return (
    <Root>
      {/* WS */}
      <Panel>
        <Header>
          <Typography variant="subtitle1">WebSocket (Livechat) Test</Typography>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendPublish()
              }
            }}
            disabled={!wsOpen}
          />
          <Button variant="contained" onClick={sendPublish} disabled={!wsOpen}>
            Send
          </Button>
          <Button variant="outlined" onClick={startClock} disabled={!wsOpen}>
            Start Clock
          </Button>
        </Row>

        <SubHeader>Received</SubHeader>
        <ChatArea ref={chatRef}>
          {messages.map((m, i) => (
            <MsgLine key={`${i}-${m.ts}`} data-type={m.type}>
              <span>{m.type === 'user' ? 'You' : 'Bot'}</span>
              <MsgBubble>{m.text}</MsgBubble>
              <small>{new Date(m.ts).toLocaleTimeString()}</small>
            </MsgLine>
          ))}
        </ChatArea>

        <SubHeader>WS Logs</SubHeader>
        <LogBox ref={logRef}>{wsLogs.join('\n') || 'no logs'}</LogBox>
      </Panel>

      <Divider orientation="vertical" flexItem />

      {/* SSE */}
      <Panel>
        <Header>
          <Typography variant="subtitle1">HTTP SSE Test</Typography>
          <FormControlLabel
            control={<Switch checked={withCred} onChange={(e) => setWithCred(e.target.checked)} />}
            label="withCredentials"
          />
        </Header>

        <Row>
          <TextField
            label="SSE Path or URL"
            size="small"
            value={ssePath}
            onChange={(e) => setSsePath(e.target.value)}
          />
          <Button variant="contained" onClick={startSse} disabled={sseOpen}>
            Start
          </Button>
          <Button variant="outlined" onClick={stopSse} disabled={!sseOpen}>
            Stop
          </Button>
        </Row>

        <SubHeader>Stream Logs</SubHeader>
        <LogBox ref={sseLogRef}>{sseLogs.join('\n') || 'no stream yet'}</LogBox>

        <SubHeader>Rendered Items</SubHeader>
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

// ---------- utils/style ----------
function time() {
  return new Date().toLocaleTimeString()
}
function toText(x: unknown) {
  try {
    if (typeof x === 'string') return x
    if (x instanceof Event) return `[Event type=${x.type}]`
    return JSON.stringify(x)
  } catch {
    return String(x)
  }
}
function buildUrl(pathOrUrl: string) {
  try {
    return new URL(pathOrUrl).toString()
  } catch {
    /* relative */
  }
  if (pathOrUrl.startsWith('/')) return `${location.origin}${pathOrUrl}`
  return `${location.origin}/${pathOrUrl}`
}

const Root = styled(FlexBox)({
  width: '100vw',
  height: '100vh',
  padding: '10px',
  gap: 12,
  paddingTop: '72px',
})
const Panel = styled(ColumnBox)({
  flex: 1,
  minWidth: 0,
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
  gridTemplateColumns: '40px 1fr auto',
  alignItems: 'start',
  gap: 8,
  '&[data-type="user"] span': { color: '#1976d2' },
  '&[data-type="chatbot"] span': { color: '#9c27b0' },
  '& small': { opacity: 0.6, fontSize: 11, alignSelf: 'center' },
})
const MsgBubble = styled('div')({
  display: 'inline-block',
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
  margin: 0,
  padding: '8px 12px',
  background: '#fff',
  border: '1px solid #eee',
  borderRadius: 6,
  overflow: 'auto',
  fontSize: 14,
})
