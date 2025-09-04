// MDHTMLAnimator.tsx
import { type ComponentProps, useEffect, useMemo, useRef } from 'react'
import { motion } from 'motion/react'
import { marked } from 'marked'

/** 표시 단위 */
type SegmentMode = 'word' | 'char' | 'sentence'

export interface MDHTMLAnimatorProps extends Omit<ComponentProps<typeof motion.div>, 'children'> {
  readonly markdown?: string
  readonly html?: string
  readonly segment?: SegmentMode // 기본 'word'
  readonly speed?: number // 초당 토큰 수 (기본 40)
  readonly delayMs?: number // 시작 지연(ms)
  readonly showCaret?: boolean // 커서 표시 (기본 true)
  readonly onDone?: () => void
}

/* --------------------------- 전역 CSS 주입 --------------------------- */
let cssInjected = false
function ensureGlobalCss() {
  if (cssInjected || typeof document === 'undefined') return
  const css = `
  @keyframes mdha-blink { 50% { opacity: 0; } }
  .mdha-caret { display:inline-block;width:1px;height:1em;vertical-align:-0.1em;
                background: currentColor;margin-left:2px;animation: mdha-blink 1s steps(1) infinite; }

  /* 공개 전 스타일 숨김(텍스트/테이블 등) */
  [data-mdha-pending] {
-   color: transparent !important;
-   border-color: transparent !important;
-   background: transparent !important;
+   visibility: hidden !important;      /* ✅ 레이아웃 유지하며 숨김 */
+   pointer-events: none !important;    /* 상호작용 막기 */
    display: none !important;
  }

  /* 블록 요소의 초기 여백 제거 */
  p[data-mdha-pending], h1[data-mdha-pending], h2[data-mdha-pending], h3[data-mdha-pending],
  h4[data-mdha-pending], h5[data-mdha-pending], h6[data-mdha-pending],
  ul[data-mdha-pending], ol[data-mdha-pending], blockquote[data-mdha-pending],
  pre[data-mdha-pending], table[data-mdha-pending] {
    margin: 0 !important;
    padding: 0 !important;
  }

  /* 리스트 마커 숨김 */
  li[data-mdha-pending] { list-style: none !important; }
  li[data-mdha-pending]::marker { content: "" !important; }

  /* hr/br 은 공간도 차지하지 않게 (예외적으로 display:none 유지) */
  hr[data-mdha-pending] { display: none !important; }
  br[data-mdha-pending] { display: none !important; }
- *[data-mdha-pending] { display:none !important; }
+ /* 위의 visibility 규칙이 모든 요소를 커버하므로 이 줄은 제거 */

  /* 이미지: 레이아웃 튐 방지를 위해 visibility 사용 */
  img[data-mdha-pending] { visibility: hidden !important; }
  `
  const tag = document.createElement('style')
  tag.setAttribute('data-mdha-css', 'true')
  tag.appendChild(document.createTextNode(css))
  document.head.appendChild(tag)
  cssInjected = true
}

/* --------------------------- 보안 화이트리스트 --------------------------- */
const ALLOWED_TAGS = new Set([
  'p',
  'span',
  'div',
  'strong',
  'em',
  'b',
  'i',
  'u',
  's',
  'code',
  'pre',
  'kbd',
  'mark',
  'blockquote',
  'ul',
  'ol',
  'li',
  'hr',
  'br',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'a',
  'img',
  'sub',
  'sup',
])
const EXPLICIT_REVEAL_TAGS = new Set(['hr', 'img', 'br'])
const GLOBAL_ALLOWED_ATTR = new Set(['class', 'title'])
const A_ALLOWED_ATTR = new Set(['href', 'target', 'rel', 'title', 'class'])
const IMG_ALLOWED_ATTR = new Set(['src', 'alt', 'title', 'width', 'height', 'class'])

function sanitizeHref(href: string): string | null {
  const v = href.trim()
  if (v.startsWith('#') || v.startsWith('/') || v.startsWith('./') || v.startsWith('../')) return v
  try {
    const u = new URL(v)
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null
  } catch {
    return null
  }
}
function isSafeImgSrc(src: string): boolean {
  const v = src.trim()
  if (/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(v)) return true
  try {
    const u = new URL(v)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

/* --------------------------- 토큰 & 복제 --------------------------- */
type TextEntry = { kind: 'text'; tokens: string[]; target: Text }
type RevealEntry = { kind: 'reveal'; el: Element }
type Entry = TextEntry | RevealEntry

function tokenize(s: string, mode: SegmentMode): string[] {
  if (!s) return []
  switch (mode) {
    case 'char':
      return Array.from(s)
    case 'sentence':
      return s.match(/[^.!?…]+[.!?…]*|\s+/g) ?? []
    default:
      return s.match(/\s+|\S+/g) ?? []
  }
}

function markPending(el: Element) {
  el.setAttribute('data-mdha-pending', '1')
}
function reveal(el: Element | null) {
  if (el) el.removeAttribute('data-mdha-pending')
}

function revealUpwards(node: Node) {
  let p: Node | null = node.parentNode
  while (p && p.nodeType === Node.ELEMENT_NODE) {
    const el = p as Element
    if (el.hasAttribute('data-mdha-pending')) el.removeAttribute('data-mdha-pending')
    p = p.parentNode
  }
}

function cloneTreeWithEntries(node: Node, entries: Entry[], seg: SegmentMode): Node | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const tokens = tokenize((node as Text).data, seg)
    const t = document.createTextNode('')
    if (tokens.length) entries.push({ kind: 'text', tokens, target: t })
    return t
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const srcEl = node as Element
    const tag = srcEl.tagName.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) {
      const span = document.createElement('span')
      markPending(span)
      for (const child of Array.from(srcEl.childNodes)) {
        const c = cloneTreeWithEntries(child, entries, seg)
        if (c) span.appendChild(c)
      }
      return span
    }
    const dstEl = document.createElement(tag)
    markPending(dstEl)
    for (const { name, value } of Array.from(srcEl.attributes)) {
      const lower = name.toLowerCase()
      if (lower.startsWith('on') || lower === 'style') continue
      if (tag === 'a') {
        if (!A_ALLOWED_ATTR.has(lower)) continue
        if (lower === 'href') {
          const safe = sanitizeHref(value)
          if (!safe) continue
          dstEl.setAttribute('href', safe)
          dstEl.setAttribute('rel', 'nofollow noopener noreferrer')
          dstEl.setAttribute('target', '_blank')
          continue
        }
      } else if (tag === 'img') {
        if (!IMG_ALLOWED_ATTR.has(lower)) continue
        if (lower === 'src' && !isSafeImgSrc(value)) continue
      } else if (!GLOBAL_ALLOWED_ATTR.has(lower)) continue
      dstEl.setAttribute(lower, value)
    }
    const hasNoTextContent = srcEl.textContent?.trim() === ''
    if (EXPLICIT_REVEAL_TAGS.has(tag) || (tag === 'span' && hasNoTextContent)) {
      entries.push({ kind: 'reveal', el: dstEl })
    }
    for (const child of Array.from(srcEl.childNodes)) {
      const c = cloneTreeWithEntries(child, entries, seg)
      if (c) dstEl.appendChild(c)
    }
    return dstEl
  }
  return null
}

/* --------------------------- 컴포넌트 --------------------------- */
export default function MDHTMLAnimator({
  markdown,
  html,
  segment = 'word',
  speed = 500,
  delayMs = 0,
  showCaret = true,
  onDone,
  ...motionProps
}: MDHTMLAnimatorProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const modeMemo = useMemo<'md' | 'html' | 'empty'>(() => {
    if (markdown && markdown.trim().length > 0) return 'md'
    if (html && html.trim().length > 0) return 'html'
    return 'empty'
  }, [markdown, html])

  useEffect(() => {
    ensureGlobalCss()
    const host = hostRef.current
    if (!host) return
    host.innerHTML = ''
    if (modeMemo === 'empty') {
      onDone?.()
      return
    }
    const entries: Entry[] = []
    let rafId = 0
    let timerId: number | null = null
    let caret: HTMLElement | null = null

    const mountFromRoot = (rootEl: HTMLElement) => {
      const skeleton = document.createElement('div')
      markPending(skeleton)
      for (const child of Array.from(rootEl.childNodes)) {
        const cloned = cloneTreeWithEntries(child, entries, segment)
        if (cloned) skeleton.appendChild(cloned)
      }
      host.append(...Array.from(skeleton.childNodes))
      if (showCaret) {
        caret = document.createElement('span')
        caret.className = 'mdha-caret'
        host.appendChild(caret)
      }
    }

    const startTyping = () => {
      let entryIdx = 0,
        tokenIdx = 0,
        last = performance.now()
      const step = (now: number) => {
        const dt = now - last
        last = now
        let budget = Math.max(1, Math.floor((speed / 1000) * dt))
        while (budget > 0 && entryIdx < entries.length) {
          const e = entries[entryIdx]
          if (!e) break
          if (e.kind === 'reveal') {
            reveal(e.el)
            entryIdx++
            continue
          }
          const tok = e.tokens[tokenIdx]
          if (tok === undefined) {
            entryIdx++
            tokenIdx = 0
            continue
          }
          e.target.textContent = (e.target.textContent ?? '') + tok
          revealUpwards(e.target)
          tokenIdx++
          budget--
          if (tokenIdx >= e.tokens.length) {
            entryIdx++
            tokenIdx = 0
          }
        }
        if (entryIdx < entries.length) rafId = requestAnimationFrame(step)
        else {
          caret?.remove()
          onDone?.()
        }
      }
      rafId = requestAnimationFrame(step)
    }

    const parser = new DOMParser()

    if (modeMemo === 'html') {
      const doc = parser.parseFromString(html ?? '', 'text/html')
      mountFromRoot(doc.body)
      if (delayMs > 0) timerId = window.setTimeout(startTyping, delayMs)
      else startTyping()
    } else {
      // Markdown → HTML 문자열 (raw HTML 포함)
      const mdHtml = marked.parse(markdown ?? '') as string
      const doc = parser.parseFromString(mdHtml, 'text/html')
      mountFromRoot(doc.body)
      if (delayMs > 0) timerId = window.setTimeout(startTyping, delayMs)
      else startTyping()
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (timerId) clearTimeout(timerId)
    }
  }, [modeMemo, markdown, html, segment, speed, delayMs, showCaret, onDone])

  const defaultMotion = {
    initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  } as const

  return <motion.div {...defaultMotion} {...motionProps} ref={hostRef} aria-live="polite" />
}
