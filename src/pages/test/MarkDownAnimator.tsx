/* eslint-disable react-hooks/exhaustive-deps */
import { Box, IconButton, styled, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { marked, type RendererObject, type Tokens } from 'marked'
import { ColumnBox } from '@shared/ui/layoutUtilComponents'
import DOMPurify from 'dompurify'
import { stripHtml } from 'string-strip-html'
import { useOnceAnimation } from '@domains/common/hooks/useOnceAnimation'
import { popIn } from '@domains/common/hooks/animations' //html 태그 제거 라이브러리

type WSTestPageProps = {
  tokens: string[]
  speed?: number
  index: number
}

const MarkDownAnimator = ({ tokens, speed = 60, index }: WSTestPageProps) => {
  const [messages, setMessages] = useState('')
  const [done, setDone] = useState(false)
  const idxRef = useRef(0)
  const timerRef = useRef<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animated = useOnceAnimation(index)

  // 단순 태그로 렌더링 커스터마이징
  const renderer = useMemo<RendererObject>(
    () => ({
      heading(token: Tokens.Heading) {
        return `<h${token.depth}>${token.text}</h${token.depth}>`
      },
    }),
    []
  )

  // 마크다운을 HTML로 변환
  const parseMd = useMemo(() => {
    marked.use({ gfm: true, breaks: true, renderer })
    return (src: string) => marked.parse(src)
  }, [renderer])

  // 처리되지 않은 블록 요소 버퍼
  const pendingRef = useRef<{ quote?: string; fence?: string; list?: string }>({})

  const flushPending = () => {
    const p = pendingRef.current

    const out = [p.quote, p.fence, p.list].filter(Boolean).join('')
    pendingRef.current = {}
    return out
  }

  // 토큰 검사 후 버퍼에 쌓거나 바로 렌더링
  const appendToken = (raw: string) => {
    if (raw === '>' || raw === '> ' || /^>\s/.test(raw)) {
      pendingRef.current.quote = (pendingRef.current.quote ?? '') + raw
      return
    }
    if (raw === '```' || raw.startsWith('```')) {
      pendingRef.current.fence = (pendingRef.current.fence ?? '') + raw
      return
    }
    if (/^(\s*-\s|\s*\d+\.\s)$/.test(raw)) {
      pendingRef.current.list = (pendingRef.current.list ?? '') + raw
      return
    }

    const lead = flushPending()
    setMessages((prev) => prev + lead + raw)
  }

  // 타자기처럼 찍히는 효과
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      const i = idxRef.current
      if (i >= tokens.length) {
        const tail = flushPending()

        if (tail) setMessages((prev) => prev + tail)
        if (timerRef.current) window.clearInterval(timerRef.current)

        // 더이상 받아올 메세지가 없음
        setDone(true)
        return
      }

      const chunk = String(tokens[i] ?? '')
      idxRef.current = i + 1
      appendToken(chunk)
    }, speed)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [tokens, speed])

  // HTML 파싱
  const parsedHtml = useMemo(() => {
    const rawHtml = parseMd(messages) as string
    return DOMPurify.sanitize(rawHtml)
  }, [messages, parseMd])

  // 버블 복사하기
  const onCopy = () => {
    const raw = contentRef.current?.innerHTML ?? ''

    const safeHtml = DOMPurify.sanitize(raw)

    const { result } = stripHtml(safeHtml, {
      skipHtmlDecoding: false, // HTML 엔티티(&nbsp; 등)도 텍스트로 변환
    })

    // 3. textarea 방식으로 복사
    const textarea = document.createElement('textarea')
    textarea.value = result

    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '-9999px'

    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    try {
      document.execCommand('copy')
      console.log('복사 성공:', result)
    } catch (err) {
      console.error('복사 실패', err)
    }

    document.body.removeChild(textarea)
  }

  return (
    <StyledMarkdownWrap className={`chatbot-bubble-con ${animated ? 'pop-in' : ''}`}>
      <Typography variant="h6">GenAi</Typography>
      <WSBubble>
        {/*<WSBubbleContent>{JSON.stringify(tokens)}</WSBubbleContent>*/}
        <WSBubbleContent dangerouslySetInnerHTML={{ __html: parsedHtml }} ref={contentRef} />
      </WSBubble>
      {done && (
        <IconButton aria-label="delete" onClick={onCopy}>
          <Copy />
        </IconButton>
      )}
    </StyledMarkdownWrap>
  )
}

export default MarkDownAnimator

const StyledMarkdownWrap = styled(ColumnBox)({
  transformOrigin: 'top left',

  '&.pop-in': {
    animation: `${popIn} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both`,
  },
})

const WSBubble = styled(Box)({
  width: '500px',
  height: 'auto',
  background: '#fff',
  borderRadius: '8px',
  border: '1px solid #ccc',
})

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
  '& th': {
    backgroundColor: '#f9f9f9',
  },

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
})

const Copy = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20H17C18.1046 20 19 19.1046 19 18V13M17.5858 3.58579C18.3668 2.80474 19.6332 2.80474 20.4142 3.58579C21.1953 4.36683 21.1953 5.63316 20.4142 6.41421L11.8284 15H9L9 12.1716L17.5858 3.58579Z"
      stroke="#212528"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
