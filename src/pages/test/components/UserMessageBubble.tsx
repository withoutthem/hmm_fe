import { Box, styled } from '@mui/material'
import type { UserMessage } from '@domains/common/ui/store/message.store'
import DOMPurify from 'dompurify'
import { useOnceAnimation } from '@domains/common/hooks/useOnceAnimation'
import { popIn } from '@domains/common/hooks/animations'
import { forwardRef } from 'react'

interface UserMessageBubbleProps {
  m: UserMessage
  index: number
}

const UserMessageBubble = forwardRef<HTMLDivElement, UserMessageBubbleProps>(
  ({ m, index }, ref) => {
    const animated = useOnceAnimation(index)
    const safeMessage = m.message ? DOMPurify.sanitize(m.message) : ''

    return (
      <UserBubbleWrap ref={ref}>
        <UserBubbleCon className={animated ? 'pop-in' : ''}>
          {m.images?.length ? (
            <UserImgBubble>
              {m.images.map((file, idx) => (
                <UserUpdateImgCon key={idx}>
                  <UserUpdateImg src={URL.createObjectURL(file)} alt={`user-${index}-${idx}`} />
                </UserUpdateImgCon>
              ))}
            </UserImgBubble>
          ) : null}

          {m.message && <UserTextBubble dangerouslySetInnerHTML={{ __html: safeMessage }} />}
        </UserBubbleCon>
      </UserBubbleWrap>
    )
  }
)

export default UserMessageBubble

const UserBubbleWrap = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 8,
})

const UserBubbleCon = styled(Box)({
  maxWidth: '500px',
  transformOrigin: 'top right',

  '&.pop-in': {
    animation: `${popIn} .4s cubic-bezier(0.6, 1, 0.36, 1) both`,
  },
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
  borderRadius: '20px 0px 20px 20px',
  fontSize: '15px',
  lineHeight: 1.4,
  background: '#E9ECEF',
  whiteSpace: 'pre-wrap',
})
