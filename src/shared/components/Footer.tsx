import { Box, type BoxProps, IconButton, List, ListItem, styled, TextField } from '@mui/material'
import useUIStore, { type UserMessage } from '@domains/common/ui/store/ui.store'
import { useState } from 'react'
import { ColumnBox, FlexBox } from '@shared/ui/layoutUtilComponents'
import DOMPurify from 'dompurify'

interface MockData {
  userId: number
  title: string
  body: string
}

const Footer = () => {
  const message = useUIStore((s) => s.message)
  const setMessage = useUIStore((s) => s.setMessage)
  const images = useUIStore((s) => s.images)
  const setImages = useUIStore((s) => s.setImages)
  const messages = useUIStore((s) => s.messages)
  const setMessages = useUIStore((s) => s.setMessages)

  const [allSuggestions, setAllSuggestions] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggestionsPage, setSuggestionsPage] = useState(1)

  // Ctrl + V로 이미지 붙여넣기
  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData.files.length > 0) {
      const pastedFiles = Array.from(e.clipboardData.files).filter((file) =>
        file.type.startsWith('image/')
      )
      if (pastedFiles.length > 0) {
        setImages([...images, ...pastedFiles]) // 직접 처리
      }
    }
  }

  // 이미지 삭제
  const onRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx)) // 직접 처리
  }

  const onMessageSend = () => {
    const trimmed = message.trim()

    if (!trimmed && images.length === 0) return

    const userMsg: UserMessage = {
      sender: 'user',
      type: 'message',
      ...(trimmed ? { message: trimmed } : {}),
      ...(images.length ? { images } : {}),
    }

    setMessages([...messages, userMsg])
    setMessage('')
    setImages([])
    setSuggestions([])
  }

  const onScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      // 다음 페이지 로드
      const nextPage = suggestionsPage + 1
      const nextItems = allSuggestions.slice(0, nextPage * 10)
      if (nextItems.length > suggestions.length) {
        setSuggestions(nextItems)
        setSuggestionsPage(nextPage)
      }
    }
  }

  // 엔터키 전송
  const onMessageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onMessageSend()
    }
  }

  // 자동완성 API 호출
  const fetchSuggestions = async (query: string) => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      const raw = (await res.json()) as unknown
      const data = raw as MockData[]

      const filtered = data
        .map((item: MockData) => item.title)
        .filter((title) => title.includes(query))

      setAllSuggestions(filtered) // 전체 저장
      setSuggestions(filtered.slice(0, 5)) // 처음 10개만 노출
      setSuggestionsPage(1)
    } catch (err) {
      console.error('API Error:', err)
    }
  }

  // 자동완성 갱신
  const onMessageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessage(value)

    if (value.length >= 2) {
      await fetchSuggestions(value)
    } else {
      setSuggestions([])
    }
  }

  // 자동완성 텍스트 하이라이트
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())

    if (idx === -1) return text

    const before = text.substring(0, idx)
    const match = text.substring(idx, idx + query.length)
    const after = text.substring(idx + query.length)

    const highlighted = `${before}<span>${match}</span>${after}`

    return DOMPurify.sanitize(highlighted)
  }

  // 자동완성 클릭
  const onSuggestionClick = (text: string) => {
    const userMsg: UserMessage = {
      sender: 'user',
      type: 'message',
      message: text,
    }

    setMessages([...messages, userMsg])
    setMessage('')
    setImages([])
    setSuggestions([])
  }

  return (
    <StyledFooter component={'footer'}>
      <InputContainer>
        <ImgTextField>
          {/* 붙여넣은 이미지 미리보기 */}
          {images.length > 0 && (
            <ImagePreview>
              {images.map((file, idx) => (
                <ImagePreviewItem key={idx}>
                  <img src={URL.createObjectURL(file)} alt={`pasted-${idx}`} />
                  <DeleteButton onClick={() => onRemoveImage(idx)}>×</DeleteButton>
                </ImagePreviewItem>
              ))}
            </ImagePreview>
          )}

          <ColumnBox>
            {/* 자동완성 */}
            {suggestions.length > 0 && (
              <SuggestionBox className={'suggestion-box'}>
                <SuggestionList onScroll={onScroll}>
                  {suggestions.map((s, idx) => (
                    <SuggestionListItem key={idx} onClick={() => onSuggestionClick(s)}>
                      <span dangerouslySetInnerHTML={{ __html: highlightMatch(s, message) }} />
                    </SuggestionListItem>
                  ))}
                </SuggestionList>
              </SuggestionBox>
            )}

            <ChatInputBar className={'chat-input-bar'}>
              {/* 메시지 입력 영역 */}
              <StyledTextField
                multiline
                maxRows={3}
                placeholder="궁금한 내용을 입력해주세요."
                value={message}
                onChange={onMessageChange}
                onPaste={onPaste}
                variant="outlined"
                fullWidth
                onKeyDown={onMessageKeyDown}
              />
              {/* 보내기 버튼 */}
              <SendButton onClick={onMessageSend}>
                <SendIcon />
              </SendButton>
            </ChatInputBar>
          </ColumnBox>
        </ImgTextField>
      </InputContainer>
    </StyledFooter>
  )
}

export default Footer

const StyledFooter = styled(Box)<BoxProps>({
  width: '100%',
  background: '#fff',
  // padding: '8px 20px',
  boxSizing: 'border-box',
  display: 'flex',
  fonSzie: '16px',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: '0px 0px .5px rgba(23, 74, 146, 0.16), 0px 2px 8px rgba(23, 74, 146, 0.12)',

  '&:has(ul)': {
    boxShadow: 'none',

    '& .chat-input-bar': {
      boxShadow: '0px 0px .5px rgba(23, 74, 146, 0.16), 0px 2px 8px rgba(23, 74, 146, 0.12)',
    },
  },
})

const ImagePreviewItem = styled(Box)({
  position: 'relative',
  width: '58px',
  height: '58px',
  borderRadius: '4px',
  overflow: 'hidden',
  border: '1px solid',

  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '4px',
    display: 'block',
  },
})

const DeleteButton = styled('button')({
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  fontSize: '12px',
  cursor: 'pointer',
  lineHeight: 1,
  padding: 0,
})

const InputContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

const ImgTextField = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})

const ImagePreview = styled(Box)({
  display: 'flex',
  gap: '8px',
  width: '100%',
  height: '66px',
  overflowY: 'auto',
  flexWrap: 'wrap',
  scrollbarWidth: 'thin',
  padding: '8px 8px 0 8px',
})

const SuggestionBox = styled(Box)({
  background: '#fff',
  boxShadow: '0 -8px 26px #22222214',
  borderRadius: '24px 24px 0 0',
  margin: 0,
  padding: '36px 0px 16px',
})

const SuggestionList = styled(List)({
  maxHeight: '122px',
  overflowY: 'auto',
  padding: '0',
})

const SuggestionListItem = styled(ListItem)({
  padding: '6px 24px',
  cursor: 'pointer',
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#6D747B',
  fontWeight: '600',

  '& span>span': {
    color: '#1C2681',
  },
})

const ChatInputBar = styled(FlexBox)({
  gap: '8px',
  padding: '8px 20px',
})

const StyledTextField = styled(TextField)({
  padding: '8px 12px',
  backgroundColor: '#F1F3F5',
  borderRadius: '8px',

  '& > div': {
    padding: '0',
  },

  '& .MuiInputBase-colorPrimary fieldset, & .MuiInputBase-root.Mui-focused fieldset, & .MuiInputBase-colorPrimary:hover fieldset':
    {
      borderColor: 'transparent',
    },

  '& textarea': {
    resize: 'none',
    color: '#343A40',
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '140%',
    margin: '3.5px 0',
  },
})

const SendButton = styled(IconButton)({
  padding: '0',
  width: '38px',
  height: '38px',
  background: 'linear-gradient(to bottom right, #51ADF9, #516DFA)',
})

const SendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.3865 3.31836L2.7899 7.88262C1.6087 8.27636 1.49217 9.90122 2.60509 10.4595L7.69315 13.0117L17.3865 3.31836Z"
      fill="white"
    />
    <path
      d="M8.98954 14.3082L11.5417 19.3961C12.1 20.5091 13.7249 20.3925 14.1186 19.2113L18.6828 4.61496L8.98954 14.3082Z"
      fill="white"
    />
  </svg>
)
