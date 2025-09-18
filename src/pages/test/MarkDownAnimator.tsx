/* eslint-disable react-hooks/exhaustive-deps */
import { Box, IconButton, styled, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { marked, type RendererObject, type Tokens } from 'marked';
import { ColumnBox } from '@shared/ui/layoutUtilComponents';
import DOMPurify from 'dompurify';
import { stripHtml } from 'string-strip-html';
import { useOnceAnimation } from '@domains/common/hooks/useOnceAnimation';
import { popIn } from '@domains/common/hooks/animations';
import { CopyIcon } from '@shared/icons/CopyIcon';

/* ===== marked 전역 설정 (모듈 스코프에서 1회) ===== */
const renderer: RendererObject = {
  heading(token: Tokens.Heading) {
    return `<h${token.depth}>${token.text}</h${token.depth}>`;
  },
};
marked.use({ gfm: true, breaks: true, renderer });

type WSTestPageProps = {
  tokens: string[];
  speed?: number;
  index: number;
};

const MarkDownAnimator = ({ tokens, speed = 60, index }: WSTestPageProps) => {
  const [messages, setMessages] = useState('');
  const [done, setDone] = useState(false);

  const idxRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const animated = useOnceAnimation(index);

  const pendingRef = useRef<{ quote?: string; fence?: string; list?: string }>({});

  const flushPending = () => {
    const p = pendingRef.current;
    const out = [p.quote, p.fence, p.list].filter(Boolean).join('');
    pendingRef.current = {};
    return out;
  };

  const appendToken = (raw: string) => {
    if (raw === '>' || raw === '> ' || /^>\s/.test(raw)) {
      pendingRef.current.quote = (pendingRef.current.quote ?? '') + raw;
      return;
    }
    if (raw === '```' || raw.startsWith('```')) {
      pendingRef.current.fence = (pendingRef.current.fence ?? '') + raw;
      return;
    }
    if (/^(\s*-\s|\s*\d+\.\s)$/.test(raw)) {
      pendingRef.current.list = (pendingRef.current.list ?? '') + raw;
      return;
    }
    const lead = flushPending();
    setMessages((prev) => prev + lead + raw);
  };

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      const i = idxRef.current;
      if (i >= tokens.length) {
        const tail = flushPending();
        if (tail) setMessages((prev) => prev + tail);
        if (timerRef.current) window.clearInterval(timerRef.current);
        setDone(true);
        return;
      }
      const chunk = String(tokens[i] ?? '');
      idxRef.current = i + 1;
      appendToken(chunk);
    }, speed);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [tokens, speed]);

  const parsedHtml = useMemo(() => {
    const rawHtml = marked.parse(messages) as string;
    return DOMPurify.sanitize(rawHtml);
  }, [messages]);

  const onCopy = async () => {
    const raw = contentRef.current?.innerHTML ?? '';
    const safeHtml = DOMPurify.sanitize(raw);
    const { result } = stripHtml(safeHtml, { skipHtmlDecoding: false });

    try {
      await navigator.clipboard.writeText(result);
      return;
    } catch {
      // 폴백: selection만 해두고 사용자에게 수동 복사 유도 (execCommand 미사용)
      const textarea = document.createElement('textarea');
      textarea.value = result;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      // 여기서 별도 명령은 실행하지 않음. UI 토스트로 "Ctrl+C/Cmd+C로 복사" 안내 권장.
      // 제거는 약간 지연해 사용자 복사 시간을 제공해도 됨.
      setTimeout(() => {
        document.body.removeChild(textarea);
      }, 2000);
    }
  };

  return (
    <MarkdownWrap className={`chatbot-bubble-con ${animated ? 'pop-in' : ''}`}>
      <Typography variant="h6">GenAi</Typography>
      <WSBubble>
        <WSBubbleContent ref={contentRef} dangerouslySetInnerHTML={{ __html: parsedHtml }} />
      </WSBubble>
      {done && (
        <IconButton aria-label="copy" onClick={onCopy}>
          <CopyIcon />
        </IconButton>
      )}
    </MarkdownWrap>
  );
};

export default MarkDownAnimator;

/* ===== 스타일 ===== */
const MarkdownWrap = styled(ColumnBox)({
  transformOrigin: 'top left',
  '&.pop-in': {
    animation: `${popIn} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both`,
  },
});

const WSBubble = styled(Box)({
  width: '500px',
  height: 'auto',
  background: '#fff',
  borderRadius: '8px',
  border: '1px solid #ccc',
});

const WSBubbleContent = styled(Box)({
  padding: '12px 16px',
  lineHeight: 1.6,
  fontSize: '14px',
  '& table': {
    borderCollapse: 'collapse',
    margin: '12px 0',
    width: '100%',
  },
  '& th, & td': {
    border: '1px solid #ccc',
    padding: '6px 10px',
    textAlign: 'left',
  },
  '& th': { backgroundColor: '#f9f9f9' },
  '& input[type="checkbox"]': {
    marginRight: '8px',
    transform: 'scale(1.1)',
  },
  '& pre': {
    background: '#f6f8fa',
    padding: '12px',
    borderRadius: '6px',
    scrollbarWidth: 'thin',
    overflowX: 'auto',
    fontSize: '13px',
  },
  '& code': {
    background: '#f2f2f2',
    padding: '2px 4px',
    borderRadius: '4px',
    fontFamily: 'monospace',
  },
  '& blockquote': {
    borderLeft: '4px solid #ddd',
    margin: '12px 0',
    padding: '0 12px',
    color: '#555',
    fontStyle: 'italic',
  },
  '& img': {
    maxWidth: '100%',
    borderRadius: '4px',
    margin: '8px 0',
  },
});
