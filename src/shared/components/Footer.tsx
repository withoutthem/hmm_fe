import { useState } from 'react'
import { Box, type BoxProps, Button, styled, TextField } from '@mui/material'
import useUIStore from '@domains/common/ui/store/ui.store'

const Footer = () => {
  const message = useUIStore((state) => state.message)
  const setMessage = useUIStore((state) => state.setMessage)
  const [images, setImages] = useState<File[]>([])

  /** Ctrl + V로 이미지 붙여넣기 핸들러 */
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData.files.length > 0) {
      const pastedFiles = Array.from(e.clipboardData.files).filter((file) =>
        file.type.startsWith('image/')
      )
      if (pastedFiles.length > 0) {
        setImages((prev) => [...prev, ...pastedFiles])
      }
    }
  }

  /** 이미지 삭제 */
  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSend = () => {
    if (!message.trim() && images.length === 0) return

    console.log('보낼 메시지:', message)
    console.log('보낼 이미지:', images)

    // TODO: 서버로 메시지와 이미지 업로드 로직 추가
    setMessage('')
    setImages([])
  }

  return (
    <StyledFooter component={'footer'}>
      <InputContainer>
        <ImgTextField>
          {images.length > 0 && (
            <ImagePreview>
              {images.map((file, idx) => (
                <ImagePreviewItem key={idx}>
                  <img src={URL.createObjectURL(file)} alt={`pasted-${idx}`} />
                  <DeleteButton onClick={() => handleRemoveImage(idx)}>×</DeleteButton>
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
            onPaste={handlePaste}
            variant="outlined"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
        </ImgTextField>

        {/* 보내기 버튼 */}
        <StyledButton onClick={handleSend}>보내기</StyledButton>
      </InputContainer>

      {/* 붙여넣은 이미지 미리보기 */}
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
  width: '50px',
  height: '50px',
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
