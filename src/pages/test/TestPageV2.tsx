/* eslint-disable */
import { Button, styled, TextField, Typography, Divider, Box } from '@mui/material';
import { ColumnBox, FlexBox } from '@shared/ui/layoutUtilComponents';
import { useEffect, useMemo, useRef, useState } from 'react';
import { publish, subscribe, stomp } from '@shared/platform/stomp';

// 단일 메시지 타입 정의
type Msg = { type: 'chatbot' | 'user'; text: string; ts: number };

const TestPage = () => {
  // -------------------------------
  // Auto-scroll 훅 (채팅/로그 박스 자동 스크롤)
  const useAutoScroll = <T extends HTMLElement>(deps: unknown[]) => {
    const ref = useRef<T | null>(null);
    useEffect(() => {
      const el = ref.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, deps);
    return ref;
  };

  // -------------------------------
  // STOMP (Livechat 테스트)
  const [topic, setTopic] = useState('/topic/chat.test');
  const [sendText, setSendText] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const chatRef = useAutoScroll<HTMLDivElement>([messages]);
  const logRef = useAutoScroll<HTMLPreElement>([logs]);

  const log = (s: string) => setLogs((p) => [...p, `🕑 [${time()}] ${s}`]);

  // STOMP 상태 구독
  const stompState = stomp.getState();
  const stompOpen = stompState === 'open';

  // 서버 구독/해제
  useEffect(() => {
    if (!topic.trim()) return;
    const off = subscribe<{ text: string }>(topic, (m) => {
      log(`💬 recv @${topic}: ${m.text}`);
      setMessages((p) => [...p, { type: 'chatbot', text: m.text, ts: Date.now() }]);
    });
    log(`📡 Subscribed to ${topic}`);
    return () => {
      off();
      log(`❌ Unsubscribed from ${topic}`);
    };
  }, [topic]);

  // 메시지 발행
  const sendPublish = () => {
    const text = sendText.trim();
    if (!text || !stompOpen) return;
    publish('/app/chat.send', { topic, text });
    log(`✉️ publish @${topic}: ${text}`);
    setMessages((p) => [...p, { type: 'user', text, ts: Date.now() }]);
    setSendText('');
  };

  // Clock 시작 요청
  const startClock = () => {
    if (!stompOpen) return;
    publish('/app/clock.start', { topic });
    log('⏰ Clock start requested');
  };

  // -------------------------------
  // UI
  return (
    <Root>
      <Panel>
        <Header>
          <Typography variant="subtitle1">💬 STOMP (Livechat)</Typography>
          <Status $ok={stompOpen}>{stompState}</Status>
        </Header>

        <Row>
          <TextField
            label="Topic"
            size="small"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </Row>
        <Row>
          <TextField
            label="Message"
            size="small"
            value={sendText}
            onChange={(e) => setSendText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendPublish()}
            disabled={!stompOpen}
          />
          <Button variant="contained" onClick={sendPublish} disabled={!stompOpen}>
            Send
          </Button>
          <Button variant="outlined" onClick={startClock} disabled={!stompOpen}>
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

        <SubHeader>📝 STOMP Logs</SubHeader>
        <LogBox ref={logRef}>{logs.join('\n') || 'no logs yet'}</LogBox>
      </Panel>
    </Root>
  );
};

export default TestPage;

// ---------- utils ----------
const time = () => new Date().toLocaleTimeString();

// ---------- styles ----------
const Root = styled(FlexBox)({
  width: '100vw',
  height: '100vh',
  gap: 12,
  padding: '72px 10px 10px',
});
const Panel = styled(ColumnBox)({
  flex: 1,
  border: '1px solid #ddd',
  borderRadius: 8,
  padding: 12,
  gap: 10,
  overflow: 'hidden',
});
const Header = styled(FlexBox)({ alignItems: 'center', justifyContent: 'space-between' });
const SubHeader = styled(Typography)({ fontSize: 12, opacity: 0.8 });
const Row = styled(FlexBox)({ gap: 8, alignItems: 'center' });
const Status = styled('span')<{ $ok: boolean }>(({ $ok }) => ({
  padding: '2px 8px',
  borderRadius: 999,
  fontSize: 12,
  border: '1px solid',
  borderColor: $ok ? '#0a0' : '#a00',
  color: $ok ? '#0a0' : '#a00',
}));
const ChatArea = styled('div')({
  flex: 1,
  minHeight: 140,
  maxHeight: 260,
  overflowY: 'auto',
  background: '#f7f7f7',
  border: '1px solid #eee',
  borderRadius: 6,
  padding: 8,
});
const MsgLine = styled('div')({
  display: 'grid',
  gridTemplateColumns: '60px 1fr auto',
  alignItems: 'start',
  gap: 8,
  '&[data-type="user"] span': { color: '#1976d2' },
  '&[data-type="chatbot"] span': { color: '#9c27b0' },
  '& small': { opacity: 0.6, fontSize: 11, alignSelf: 'center' },
});
const MsgBubble = styled('div')({
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: 12,
  padding: '8px 10px',
  maxWidth: 520,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});
const LogBox = styled('pre')({
  height: 160,
  background: '#000',
  color: '#0f0',
  padding: 8,
  borderRadius: 6,
  overflow: 'auto',
  fontSize: 12,
  lineHeight: 1.5,
});
