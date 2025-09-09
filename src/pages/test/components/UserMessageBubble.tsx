import { Box, styled } from '@mui/material'
import type { UserMessage } from '@domains/common/ui/store/ui.store'

const UserMessageBubble = ({ m, index }: { m: UserMessage; index: number }) => (
  <UserBubbleWrap key={index}>
    <UserBubbleCon>
      {m.images?.length ? (
        <UserImgBubble>
          {m.images.map((file, idx) => (
            <UserUpdateImgCon key={idx}>
              <UserUpdateImg src={URL.createObjectURL(file)} alt={`user-${index}-${idx}`} />
            </UserUpdateImgCon>
          ))}
        </UserImgBubble>
      ) : null}

      {m.message && <UserTextBubble>{m.message}</UserTextBubble>}
    </UserBubbleCon>
  </UserBubbleWrap>
)

export default UserMessageBubble

const UserBubbleWrap = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '8px',
  alignItems: 'flex-end',
  gap: 8,
})

const UserBubbleCon = styled(Box)({
  maxWidth: '500px',
})

const UserImgBubble = styled(Box)({
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  maxWidth: 500,
})

const UserUpdateImgCon = styled(Box)({
  width: 120,
  height: 120,
  overflow: 'hidden',
  borderRadius: 8,
  border: '1px solid #e0e0e0',
})

const UserUpdateImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

const UserTextBubble = styled(Box)({
  maxWidth: 640,
  padding: '16px',
  borderRadius: '20px 0 20px 20px',
  fontSize: '15px',
  lineHeight: 1.4,
  background: '#E9ECEF',
  whiteSpace: 'pre-wrap',
})
