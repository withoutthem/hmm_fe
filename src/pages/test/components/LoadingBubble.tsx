import { Box, CircularProgress, styled } from '@mui/material'
import { AlignCenter } from '@shared/ui/layoutUtilComponents'

export const LoadingBubble = () => (
  <LoadingBubbleWrap>
    <LoadingBubbleCon>
      <AlignCenter>
        <CircularProgress size={16} />
        <span>로딩중…</span>
      </AlignCenter>
    </LoadingBubbleCon>
  </LoadingBubbleWrap>
)

export default LoadingBubble

const LoadingBubbleWrap = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
})

const LoadingBubbleCon = styled(Box)({
  width: 'auto',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 12,
  padding: '10px 12px',
})
