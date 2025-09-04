import { Box, type BoxProps, Button, styled, TextField } from '@mui/material'
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
      ...(trimmed ? { message: trimmed } : {}), // 값 있을 때만 키 추가
      ...(images.length ? { images } : {}), // 값 있을 때만 키 추가
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
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPaste={onPaste}
            variant="outlined"
            fullWidth
            onKeyDown={onMessageKeyDown}
          />
        </ImgTextField>

        {/* 보내기 버튼 */}
        <StyledButton onClick={onMessageSend}>보내기</StyledButton>
      </InputContainer>
    </StyledFooter>
  )
}

export default Footer

const StyledFooter = styled(Box)<BoxProps>({
  width: '100%',
  background: '#fff',
  padding: '5px',
  boxSizing: 'border-box',
  display: 'flex',
  fonSzie: '16px',
  flexDirection: 'column',
  justifyContent: 'center',
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
  top: '0px',
  right: '0px',
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
  gap: '8px',
})

const ImgTextField = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '8px 4px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  outline: '1px solid #0d0d0d0d',
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
    fontSize: '16px',
    lineHeight: '18px',
  },
})

const StyledButton = styled(Button)({
  height: 'auto',
  padding: '0',
})
