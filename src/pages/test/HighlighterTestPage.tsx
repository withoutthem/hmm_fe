import { Box, Button, Input, styled, TextField, Typography } from '@mui/material'
import { AlignCenter, ColumnBox, FlexBox } from '@shared/ui/layoutUtilComponents'
import { Virtuoso } from 'react-virtuoso'
import Highlighter from 'react-highlight-words'
import { useState } from 'react'

interface ChatMessage {
  type: 'chatbot' | 'user'
  text?: string
  image?: string // 이미지 Base64 or URL
}

const HighlighterTestPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [searchWords, setSearchWords] = useState<string>('') // 검색어 상태를 문자열로 변경

  // 채팅 전송
  const onSendChat = () => {
    if (!message.trim() && !imagePreview) return

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: 'user',
        ...(message ? { text: message } : {}),
        ...(imagePreview ? { image: imagePreview } : {}),
      },
    ])

    setMessage('')
    setImagePreview(null) // 이미지 초기화
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
            setImagePreview(reader.result as string)
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
    setSearchWords(e.target.value) // 입력값을 그대로 searchWords에 반영
  }

  // 하이라이팅된 텍스트 생성
  const highlightedText = (text: string) => {
    if (!searchWords) return text // 검색어가 비어있으면 그대로 반환

    // 정규식을 사용하여 검색어 부분을 <mark>로 감싸줍니다.
    const regex = new RegExp(`(${searchWords})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
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
                <Input
                  sx={{ flex: '1' }}
                  onChange={handleSearchInputChange} // 입력값을 searchWords에 반영
                />
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
                          {m.image && (
                            <div>
                              <img
                                src={m.image}
                                alt="user upload"
                                style={{ maxWidth: '200px', borderRadius: '8px' }}
                              />
                            </div>
                          )}
                          {m.text && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: highlightedText(m.text), // 최신 텍스트에 대해서만 하이라이팅 적용
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
                            <Highlighter
                              highlightClassName="highlight"
                              searchWords={[searchWords]} // 하나의 문자열로 searchWords 전달
                              autoEscape
                              textToHighlight={m.text}
                            />
                          )}
                        </BubbleTypoBox>
                      </ChatbotBubble>
                    )
                  }
                }}
              />
            </ChatMessageCont>
            <div>
              {/* 이미지 미리보기 */}
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    style={{ maxWidth: '200px', border: '1px solid #ccc' }}
                  />
                </div>
              )}

              <TextAreaBox>
                <TextField
                  multiline
                  maxRows={5}
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onPaste={handlePaste}
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e)}
                />
                <SendButton onClick={onSendChat}>전송</SendButton>
              </TextAreaBox>
            </div>
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
                  {msg.image && (
                    <div>
                      <img
                        src={msg.image}
                        alt="uploaded"
                        style={{ maxWidth: '200px', borderRadius: '8px' }}
                      />
                    </div>
                  )}
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
            <TextAreaBox>
              <TextField />
              <SendButton>전송</SendButton>
            </TextAreaBox>
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
            <TextAreaBox>
              <TextField />
              <SendButton>전송</SendButton>
            </TextAreaBox>
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

const TextAreaBox = styled(FlexBox)({
  gap: '4px',
  padding: '6px',
  alignItems: 'center',
  borderTop: '1px solid',
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
