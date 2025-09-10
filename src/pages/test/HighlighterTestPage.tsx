import { Box, Button, Input, styled, TextField, Typography } from '@mui/material'
import { AlignCenter, ColumnBox, FlexBox } from '@shared/ui/layoutUtilComponents'
import { Virtuoso } from 'react-virtuoso'
import { useState } from 'react'
import DOMPurify from 'dompurify'

interface ChatMessage {
  type: 'chatbot' | 'user'
  text?: string
  image?: string[] // 이미지 Base64 or URL
}

const HighlighterTestPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState('')
  const [imagePreviews, setImagePreviews] = useState<string[]>([]) // 여러 이미지 미리보기 상태로 변경
  const [searchWords, setSearchWords] = useState<string[]>([]) // 검색어

  // 채팅 전송
  const onSendChat = () => {
    if (!message.trim() && imagePreviews.length === 0) return // 이미지 미리보기도 체크

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: 'user',
        ...(message ? { text: message } : {}),
        ...(imagePreviews.length > 0 ? { image: imagePreviews } : {}), // 여러 이미지 배열을 그대로 넣음
      },
    ])

    setMessage('')
    setImagePreviews([])
  }

  // 이미지 붙여넣기
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = () => {
            setImagePreviews((prev) => [...prev, reader.result as string]) // 새로운 이미지를 배열에 추가
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  // Enter 시 message값을 m.text에 저장 (검색 가능하도록)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSendChat() // 채팅 전송
    }
  }

  // 검색어 변경
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 공백을 기준으로 단어의 갯수를 나눔
    const words = e.target.value.split(' ').filter((word) => word.trim() !== '')
    setSearchWords(words)
  }

  // 특수문자 검색어 이스케이프
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^=!:${}()|/\\]/g, '\\$&')
  }

  // 하이라이팅된 텍스트 생성
  const highlightedText = (text: string) => {
    if (searchWords.length === 0) return text

    // 각 searchWords를 mark 태그로 감싸기
    let highlighted = text
    searchWords.forEach((word) => {
      const escapedWord = escapeRegExp(word) // 정규식 안전하게 이스케이프
      const regex = new RegExp(`(${escapedWord})`, 'gi')
      highlighted = highlighted.replace(regex, '<mark>$1</mark>')
    })

    return DOMPurify.sanitize(highlighted) // XSS 공격 방지
  }

  return (
    <TestFlexBox>
      <Typography>공통설정값</Typography>
      <FlexBox>
        라벨
        <Input />
      </FlexBox>
      <Wrap>
        <ChatBox className={'chat-box'}>
          <ChatBoxCon>
            <TitleBox>
              <Typography>라이브챗 Test</Typography>
              <AlignCenter sx={{ gap: '4px' }}>
                <Typography>검색</Typography>
                <Input sx={{ flex: '1' }} onChange={handleSearchInputChange} />
              </AlignCenter>
            </TitleBox>
            <ChatMessageCont>
              <Virtuoso
                data={messages}
                overscan={0}
                itemContent={(index, m) => {
                  if (m.type === 'user') {
                    return (
                      <UserBubble key={index}>
                        <BubbleTypoBox>
                          {/*이미지미리보기*/}
                          {Array.isArray(m.image) && m.image.length > 0 && (
                            <div>
                              {m.image.map((img, index) => (
                                <img
                                  key={index}
                                  src={img}
                                  alt={`user upload ${index + 1}`}
                                  style={{ maxWidth: '200px', borderRadius: '8px', margin: '5px' }}
                                />
                              ))}
                            </div>
                          )}
                          {m.text && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: highlightedText(m.text), // 검색된 텍스트에 대해서만 하이라이팅 적용
                              }}
                            />
                          )}
                        </BubbleTypoBox>
                      </UserBubble>
                    )
                  }
                  if (m.type === 'chatbot') {
                    return (
                      <ChatbotBubble key={index}>
                        <BubbleTypoBox>
                          {m.text && (
                            /**
                             * 가져오는 값으로 수정해야 함
                             * 가져오는 값으로 수정해야 함
                             * */
                            <div
                              dangerouslySetInnerHTML={{
                                __html: highlightedText(m.text), // 검색된 텍스트에 대해서만 하이라이팅 적용
                              }}
                            />
                          )}
                        </BubbleTypoBox>
                      </ChatbotBubble>
                    )
                  }
                }}
              />
            </ChatMessageCont>
            <MessageInputContainer>
              {/* 이미지 미리보기 */}
              {imagePreviews.map((image, index) => (
                <MessageImgBox key={index}>
                  <img
                    src={image}
                    alt={`미리보기 ${index + 1}`}
                    style={{ maxWidth: '200px', border: '1px solid #ccc' }}
                  />
                </MessageImgBox>
              ))}

              <TextAreaBox>
                <TextField
                  multiline
                  maxRows={5}
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onPaste={handlePaste} // 이미지 붙여넣기 이벤트 처리
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e)}
                />
                <SendButton onClick={onSendChat}>전송</SendButton>
              </TextAreaBox>
            </MessageInputContainer>
          </ChatBoxCon>
        </ChatBox>

        <InputBox className={'input-box'}>
          <FlexBox>
            이메일 :
            <Input />
          </FlexBox>
          <FlexBox>
            USER ID :
            <Input />
          </FlexBox>
          <FlexBox>
            Label :
            <Input />
          </FlexBox>
          <FlexBox>
            Label :
            <Input />
          </FlexBox>
          <SendButton>전송</SendButton>
          <DataWrap>
            <Typography>보낸데이터</Typography>
            <DataViewer>
              {messages.map((msg, idx) => (
                <div key={idx}>
                  {/* 이미지 배열이 있는 경우, 여러 이미지 출력 */}
                  {msg.image && (
                    <div>
                      {msg.image.map((imgSrc, imageIndex) => (
                        <div key={imageIndex}>
                          <img
                            src={imgSrc}
                            alt={`uploaded-${imageIndex}`}
                            style={{ maxWidth: '200px', borderRadius: '8px' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 텍스트 출력 */}
                  {msg.text?.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              ))}
            </DataViewer>
          </DataWrap>
          <DataWrap>
            <Typography>받은데이터</Typography>
            <DataViewer></DataViewer>
          </DataWrap>
        </InputBox>

        <ChatBox className={'chat-box'}>
          <ChatBoxCon>
            <TitleBox>
              <Typography>DapTalk Test</Typography>
            </TitleBox>
            <ChatMessageCont>Bubble</ChatMessageCont>
            <MessageInputContainer>
              <TextAreaBox>
                <TextField />
                <SendButton>전송</SendButton>
              </TextAreaBox>
            </MessageInputContainer>
          </ChatBoxCon>
        </ChatBox>

        <InputBox className={'input-box'}>
          <FlexBox>
            이메일 :
            <Input />
          </FlexBox>
          <FlexBox>
            USER ID :
            <Input />
          </FlexBox>
          <FlexBox>
            Label :
            <Input />
          </FlexBox>
          <FlexBox>
            Label :
            <Input />
          </FlexBox>
          <SendButton>전송</SendButton>
          <DataWrap>
            <Typography>보낸데이터</Typography>
            <DataViewer></DataViewer>
          </DataWrap>
          <DataWrap>
            <Typography>받은데이터</Typography>
            <DataViewer></DataViewer>
          </DataWrap>
        </InputBox>

        <ChatBox className={'chat-box'}>
          <ChatBoxCon>
            <TitleBox>
              <Typography>실제화면</Typography>
            </TitleBox>
            <ChatMessageCont>Bubble</ChatMessageCont>
            <MessageInputContainer>
              <TextAreaBox>
                <TextField />
                <SendButton>전송</SendButton>
              </TextAreaBox>
            </MessageInputContainer>
          </ChatBoxCon>
        </ChatBox>
      </Wrap>
    </TestFlexBox>
  )
}

export default HighlighterTestPage

const TestFlexBox = styled(ColumnBox)({
  width: '100vw',
  height: '100vh',
  padding: '8px',
  gap: '8px',
})

const Wrap = styled(FlexBox)({
  display: 'flex',
  gap: '4px',
  flex: '1',
  overflow: 'hidden',
})

const ChatBox = styled(ColumnBox)({
  height: '100%',
  flex: '1',
})

const ChatBoxCon = styled(ColumnBox)({
  flex: '1',
  border: '1px solid #ccc',
  borderRadius: 8,
  height: '100%',
  overflow: 'hidden',
})

const TitleBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '4px 4px 4px 8px',
})

const ChatMessageCont = styled(ColumnBox)({
  flex: '1',
  padding: '8px',
  background: '#eee',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  gap: '8px',

  '& >div[data-testid="virtuoso-scroller"]': {
    scrollbarWidth: 'thin',
  },

  '& div[data-testid="virtuoso-item-list"]': {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  '& div[data-testid="virtuoso-item-list"] > div': {
    display: 'flex',
    flexDirection: 'column',
  },
})

const ChatbotBubble = styled(Box)({})

const BubbleTypoBox = styled(Box)({
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 12,
  padding: '10px 12px',
  display: 'inline-block',
  maxWidth: '300px',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
})

const DataWrap = styled(ColumnBox)({
  flex: '1',
  overflow: 'hidden',
  maxWidth: '270px',
})

const DataViewer = styled(Box)({
  background: '#fff',
  border: '1px solid black',
  overflowY: 'auto',
  padding: '8px',
  width: '100%',
  flex: '1',
  whiteSpace: 'pre-wrap',
})

const UserBubble = styled(Box)({ alignSelf: 'flex-end' })

const MessageInputContainer = styled(Box)({
  borderTop: '1px solid',
  padding: '6px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
})

const MessageImgBox = styled(Box)({})

const TextAreaBox = styled(FlexBox)({
  width: '100%',
  gap: '4px',
  alignItems: 'center',
  '&>div': { flex: '1' },
  '& input': { padding: '0' },
})

const SendButton = styled(Button)({
  width: 'fit-content',
  padding: '3px 12px',
  borderRadius: '4px',
  minWidth: 'auto',
  height: 'auto',
  background: 'black',
  color: 'white',
})

const InputBox = styled(ColumnBox)({
  paddingTop: '23px',
  gap: '8px',
  '&>button': { marginLeft: 'auto' },
})
