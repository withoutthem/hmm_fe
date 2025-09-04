import { useEffect, useRef, useState, useCallback } from 'react'
import type { RefObject } from 'react'
import { Box, Button, styled } from '@mui/material'
import MDHTMLAnimator from '@domains/common/components/MDHTMLAnimator'
import {
  HTML_TEST_1,
  HTML_TEST_2,
  HTML_TEST_3,
  MD_TEST_1,
  MD_TEST_2,
  MD_TEST_3,
} from '@domains/common/components/testData'
import {
  htmlTestData1,
  htmlTestData2,
  htmlTestData3,
  markdownTestData1,
  markdownTestData2,
  markdownTestData3,
} from '@domains/common/components/animatorTestData'

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    const prev = document.body.style.overflow
    if (locked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = prev
    }
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}

function useKey(key: string, handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === key) handler()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [key, handler, enabled])
}

export function useResizeObserver<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  onResize: (height: number) => void
) {
  const lastHeightRef = useRef<number | null>(null)

  useEffect(() => {
    const root = targetRef.current
    if (!root) return

    // 관측 대상: 실제로 max-height가 걸린 요소
    const el = root.querySelector<HTMLElement>('.md_html_animator') || root
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height
        if (lastHeightRef.current !== h) {
          lastHeightRef.current = h
          onResize(h)
        }
      }
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [targetRef, onResize])
}

const TEST_DATA = [
  MD_TEST_1,
  MD_TEST_2,
  MD_TEST_3,
  HTML_TEST_1,
  HTML_TEST_2,
  HTML_TEST_3,
  markdownTestData1,
  markdownTestData2,
  markdownTestData3,
  htmlTestData1,
  htmlTestData2,
  htmlTestData3,
]

const MotionTestPage = () => {
  const [testIndex, setTestIndex] = useState(0)
  const styleRef = useRef<HTMLDivElement | null>(null)

  const MAX_CONTENT_HEIGHT = 300
  const [clamped, setClamped] = useState(false)
  const [floation, setFloation] = useState(false)

  // body 스크롤락 & ESC 닫기
  useBodyScrollLock(floation)
  useKey('Escape', () => setFloation(false), floation)

  const styledProviderClassName = [floation && 'floation_action'].filter(Boolean).join(' ')

  const handleResize = useCallback((height: number) => {
    setClamped(height >= MAX_CONTENT_HEIGHT)
    console.log(`[animator] h:${Math.round(height)} (clamped:${height >= MAX_CONTENT_HEIGHT})`)
  }, [])

  useResizeObserver(styleRef, handleResize)

  return (
    <Box>
      <ButtonBox>
        {TEST_DATA.map((_item, index) => {
          return (
            <Button
              key={index + 'asdf'}
              onClick={() => setTestIndex(index)}
              sx={{
                fontWeight: testIndex === index ? 'bold' : 'normal',
              }}
            >
              {`테스트데이터${index + 1}`}
            </Button>
          )
        })}
      </ButtonBox>
      {testIndex >= 0 && testIndex < TEST_DATA.length && (
        <StyleProvider ref={styleRef} className={styledProviderClassName}>
          {floation && (
            <button
              style={{ width: '40px', height: '40px', border: '1px solid', borderRadius: '50%' }}
              onClick={() => setFloation(false)}
            >
              X
            </button>
          )}

          <MDHTMLAnimator
            markdown={TEST_DATA[testIndex] as string}
            segment="char" // word/char/sentence 단위 선택
            speed={20}
            delayMs={100}
            showCaret
            className="md_html_animator"
          />
        </StyleProvider>
      )}

      {clamped && <button onClick={() => setFloation(true)}>이거생김</button>}
    </Box>
  )
}

export default MotionTestPage

const ButtonBox = styled(Box)({
  flexWrap: 'wrap',
  display: 'flex',
  alignItems: 'center',
})

const StyleProvider = styled(Box)({
  maxWidth: '300px',
  background: '#fff',
  borderRadius: '8px',
  padding: '16px 8px 16px 16px',
  border: '1px solid #ccc',
  position: 'relative',

  '& .prose': {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#333',
  },

  '& .md_html_animator': {
    overflow: 'hidden',
    maxHeight: '300px',
    position: 'relative',
  },

  '&.floation_action': {
    position: 'fixed',
    inset: 0, // top/left/right/bottom: 0
    zIndex: 99,
    width: '100vw',
    height: '100vh',
    maxWidth: 'none',
    borderRadius: '0px',
    border: 0,
    boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
    animation: 'popupIn .25s ease both',

    '& .md_html_animator': {
      maxHeight: '100%',
      height: 'calc(100% - 40px)',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      paddingRight: '8px',
    },
  },

  '@keyframes popupIn': {
    '0%': { opacity: 0, transform: 'scale(0.98)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
})
