import { Box, type BoxProps, IconButton, styled, TextField } from '@mui/material'
import useUIStore, { type ChatMessage } from '@domains/common/ui/store/ui.store'

const Footer = () => {
  const message = useUIStore((s) => s.message)
  const setMessage = useUIStore((s) => s.setMessage)
  const images = useUIStore((s) => s.images)
  const setImages = useUIStore((s) => s.setImages)
  const messages = useUIStore((s) => s.messages)
  const setMessages = useUIStore((s) => s.setMessages)

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

  // 보내기버튼 클릭
  type UserMessage = Extract<ChatMessage, { sender: 'user' }>

  const onMessageSend = () => {
    const trimmed = message.trim()
    if (!trimmed && images.length === 0) return

    const userMsg: UserMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'message',
      ...(trimmed ? { message: trimmed } : {}),
      ...(images.length ? { images } : {}),
    }

    setMessages([...messages, userMsg])
    setMessage('')
    setImages([])
  }
  const onMessageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onMessageSend()
    }
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

          {/* 메시지 입력 영역 */}
          <StyledTextField
            multiline
            maxRows={5}
            placeholder="궁금한 내용을 입력해주세요."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPaste={onPaste}
            variant="outlined"
            fullWidth
            onKeyDown={onMessageKeyDown}
          />
        </ImgTextField>

        {/* 보내기 버튼 */}
        <SendButton onClick={onMessageSend}>
          <SendIcon />
        </SendButton>
      </InputContainer>
    </StyledFooter>
  )
}

export default Footer

const StyledFooter = styled(Box)<BoxProps>({
  width: '100%',
  background: '#fff',
  padding: '8px 20px',
  boxSizing: 'border-box',
  display: 'flex',
  fonSzie: '16px',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: '0 -2px 4px rgba(23, 74, 146, 0.16)',
})

const ImagePreviewItem = styled(Box)({
  position: 'relative',
  width: '145px',
  height: '145px',
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
  gap: '8px',
})

const ImagePreview = styled(Box)({
  display: 'flex',
  gap: '8px',
  width: '100%',
  height: '145px',
  overflowY: 'auto',
  flexWrap: 'wrap',
  scrollbarWidth: 'thin',
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
