import { Box, styled, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { marked, type RendererObject, type Tokens } from 'marked'
import { ColumnBox } from '@shared/ui/layoutUtilComponents'

type WSTestPageProps = {
  tokens: string[]
  speed?: number
}

const MarkDownAnimator = ({ tokens, speed = 60 }: WSTestPageProps) => {
  const [messages, setMessages] = useState('')
  const idxRef = useRef(0)
  const timerRef = useRef<number | null>(null)

  // ✅ heading에 id 안 붙게 renderer 수정 (marked v5+)
  const renderer = useMemo<RendererObject>(
    () => ({
      heading(token: Tokens.Heading) {
        return `<h${token.depth}>${token.text}</h${token.depth}>`
      },
    }),
    []
  )

  // ✅ marked 옵션 한 번만 설정
  const parseMd = useMemo(() => {
    marked.use({ gfm: true, breaks: true, renderer })
    return (src: string) => marked.parse(src)
  }, [renderer])

  // ✅ 스트리밍 버퍼 (blockquote / fenced code / list)
  const pendingRef = useRef<{ quote?: string; fence?: string; list?: string }>({})

  const flushPending = () => {
    const p = pendingRef.current

    const out = [p.quote, p.fence, p.list].filter(Boolean).join('')
    pendingRef.current = {}
    return out
  }

  const appendToken = (raw: string) => {
    if (raw === '>' || raw === '> ' || /^>\s/.test(raw)) {
      pendingRef.current.quote = (pendingRef.current.quote ?? '') + raw
      return
    }
    if (raw === '```' || /^```/.test(raw)) {
      pendingRef.current.fence = (pendingRef.current.fence ?? '') + raw
      return
    }
    if (/^(\s*-\s|\s*\d+\.\s)$/.test(raw)) {
      pendingRef.current.list = (pendingRef.current.list ?? '') + raw
      return
    }

    const lead = flushPending()
    setMessages((prev) => prev + lead + raw) // ✅ \n도 그대로 쌓음
  }

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      const i = idxRef.current
      if (i >= tokens.length) {
        // 남은 버퍼 플러시
        const tail = flushPending()

        if (tail) setMessages((prev) => prev + tail)
        if (timerRef.current) window.clearInterval(timerRef.current)
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

  const parsedHtml = useMemo(() => parseMd(messages), [messages, parseMd])

  return (
    <ColumnBox>
      <Typography variant="h6">GenAi</Typography>
      <WSBubble>
        {/*<WSBubbleContent>{JSON.stringify(tokens)}</WSBubbleContent>*/}
        <WSBubbleContent dangerouslySetInnerHTML={{ __html: parsedHtml }} />
      </WSBubble>
    </ColumnBox>
  )
}

export default MarkDownAnimator

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
