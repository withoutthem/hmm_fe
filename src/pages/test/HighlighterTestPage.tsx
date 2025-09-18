import { Box, Button, Input, styled, TextField, Typography } from '@mui/material';
import { AlignCenter, ColumnBox, FlexBox } from '@shared/ui/layoutUtilComponents';
import { Virtuoso } from 'react-virtuoso';
import React, {
  useCallback,
  useMemo,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import DOMPurify from 'dompurify';

/* =======================
   타입
======================= */
interface ChatMessage {
  type: 'chatbot' | 'user';
  text?: string;
  image?: string[]; // Base64 or URL
}

/* =======================
   순수 유틸 함수
======================= */
const escapeRegExp = (str: string) => str.replace(/[.*+?^=!:${}()|/\\]/g, '\\$&');

const highlightedHTML = (text: string, searchWords?: string[]) => {
  if (!text) return '';
  const words = (searchWords ?? []).filter(Boolean);
  if (words.length === 0) return DOMPurify.sanitize(text);

  let html = text;
  for (const w of words) {
    const regex = new RegExp(`(${escapeRegExp(w)})`, 'gi');
    html = html.replace(regex, '<mark>$1</mark>');
  }
  return DOMPurify.sanitize(html);
};

/* =======================
   프레젠테이셔널 컴포넌트
======================= */
const ChatMessageItem = React.memo(function ChatMessageItem({
  index,
  message,
  searchWords,
}: {
  index: number;
  message: ChatMessage;
  searchWords?: string[];
}) {
  if (message.type === 'user') {
    return (
      <UserBubble key={index}>
        <BubbleTypoBox>
          {Array.isArray(message.image) && message.image.length > 0 && (
            <div>
              {message.image.map((img, i) => (
                <img
                  key={img + i}
                  src={img}
                  alt={`user upload ${i + 1}`}
                  style={{ maxWidth: 200, borderRadius: 8, margin: 5 }}
                />
              ))}
            </div>
          )}
          {message.text && (
            <div
              dangerouslySetInnerHTML={{
                __html: highlightedHTML(message.text, searchWords),
              }}
            />
          )}
        </BubbleTypoBox>
      </UserBubble>
    );
  }

  // chatbot
  return (
    <ChatbotBubble key={index}>
      <BubbleTypoBox>
        {message.text && (
          <div
            dangerouslySetInnerHTML={{
              __html: highlightedHTML(message.text, searchWords),
            }}
          />
        )}
      </BubbleTypoBox>
    </ChatbotBubble>
  );
});

const ImagePreviewList = React.memo(function ImagePreviewList({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  return (
    <>
      {images.map((image, idx) => (
        <MessageImgBox key={image + idx}>
          <img
            src={image}
            alt={`미리보기 ${idx + 1}`}
            style={{ maxWidth: 200, border: '1px solid #ccc' }}
          />
        </MessageImgBox>
      ))}
    </>
  );
});

const MessageInput = React.memo(function MessageInput({
  value,
  onChange,
  onPasteImages,
  onSend,
  onKeyDown,
}: {
  value: string;
  onChange: (s: string) => void;
  onPasteImages: (files: File[]) => void;
  onSend: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
}) {
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items ?? [];
    const files: File[] = [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length > 0) onPasteImages(files);
  };

  return (
    <TextAreaBox>
      <TextField
        multiline
        maxRows={5}
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        onKeyDown={onKeyDown}
      />
      <SendButton onClick={onSend}>전송</SendButton>
    </TextAreaBox>
  );
});

const SearchBar = React.memo(function SearchBar({
  onChange,
}: {
  onChange: (words: string[]) => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const words = e.target.value
      .split(' ')
      .map((w) => w.trim())
      .filter(Boolean);
    onChange(words);
  };
  return (
    <AlignCenter sx={{ gap: '4px' }}>
      <Typography>검색</Typography>
      <Input sx={{ flex: 1 }} onChange={handleChange} />
    </AlignCenter>
  );
});

/* =======================
   페이지 컴포넌트
======================= */
const HighlighterTestPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [searchWords, setSearchWords] = useState<string[]>([]);

  const handlePasteFilesToPreviews = useCallback((files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }, []);

  const onSendChat = useCallback(() => {
    const hasText = !!message.trim();
    const hasImages = imagePreviews.length > 0;
    if (!hasText && !hasImages) return;

    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        ...(hasText ? { text: message } : {}),
        ...(hasImages ? { image: imagePreviews } : {}),
      },
    ]);
    setMessage('');
    setImagePreviews([]);
  }, [message, imagePreviews]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSendChat();
      }
    },
    [onSendChat]
  );

  const itemContent = useCallback(
    (index: number, item: ChatMessage) => (
      <ChatMessageItem index={index} message={item} searchWords={searchWords} />
    ),
    [searchWords]
  );

  // Virtuoso overscan 최적값은 상황에 따라 조정
  const virtuosoData = useMemo(() => messages, [messages]);

  return (
    <TestFlexBox>
      <Typography>공통설정값</Typography>
      <FlexBox>
        라벨
        <Input />
      </FlexBox>

      <Wrap>
        {/* 좌측: 라이브챗 Test */}
        <ChatBox className="chat-box">
          <ChatBoxCon>
            <TitleBox>
              <Typography>라이브챗 Test</Typography>
              <SearchBar onChange={setSearchWords} />
            </TitleBox>

            <ChatMessageCont>
              <Virtuoso data={virtuosoData} overscan={0} itemContent={itemContent} />
            </ChatMessageCont>

            <MessageInputContainer>
              <ImagePreviewList images={imagePreviews} />
              <MessageInput
                value={message}
                onChange={setMessage}
                onPasteImages={handlePasteFilesToPreviews}
                onSend={onSendChat}
                onKeyDown={handleKeyDown}
              />
            </MessageInputContainer>
          </ChatBoxCon>
        </ChatBox>

        {/* 우측 도구 패널 1 */}
        <InputBox className="input-box">
          <FlexBox>
            이메일 : <Input />
          </FlexBox>
          <FlexBox>
            USER ID : <Input />
          </FlexBox>
          <FlexBox>
            Label : <Input />
          </FlexBox>
          <FlexBox>
            Label : <Input />
          </FlexBox>
          <SendButton>전송</SendButton>

          <DataWrap>
            <Typography>보낸데이터</Typography>
            <DataViewer>
              {messages.map((msg, idx) => (
                <div key={String(msg.text) + idx}>
                  {msg.image && (
                    <div>
                      {msg.image.map((imgSrc, i) => (
                        <div key={imgSrc + i}>
                          <img
                            src={imgSrc}
                            alt={`uploaded-${i}`}
                            style={{ maxWidth: 200, borderRadius: 8 }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.text?.split('\n').map((line, i) => (
                    <span key={line + i}>
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
            <DataViewer />
          </DataWrap>
        </InputBox>

        {/* 우측 도구 패널 2 (샘플) */}
        <ChatBox className="chat-box">
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

        {/* 우측 도구 패널 3 (샘플) */}
        <InputBox className="input-box">
          <FlexBox>
            이메일 : <Input />
          </FlexBox>
          <FlexBox>
            USER ID : <Input />
          </FlexBox>
          <FlexBox>
            Label : <Input />
          </FlexBox>
          <FlexBox>
            Label : <Input />
          </FlexBox>
          <SendButton>전송</SendButton>
          <DataWrap>
            <Typography>보낸데이터</Typography>
            <DataViewer />
          </DataWrap>
          <DataWrap>
            <Typography>받은데이터</Typography>
            <DataViewer />
          </DataWrap>
        </InputBox>

        {/* 우측 도구 패널 4 (샘플) */}
        <ChatBox className="chat-box">
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
  );
};

export default HighlighterTestPage;

/* =======================
   스타일
======================= */
const TestFlexBox = styled(ColumnBox)({
  width: '100vw',
  height: '100vh',
  padding: '8px',
  gap: '8px',
});

const Wrap = styled(FlexBox)({
  display: 'flex',
  gap: '4px',
  flex: 1,
  overflow: 'hidden',
});

const ChatBox = styled(ColumnBox)({
  height: '100%',
  flex: 1,
});

const ChatBoxCon = styled(ColumnBox)({
  flex: 1,
  border: '1px solid #ccc',
  borderRadius: 8,
  height: '100%',
  overflow: 'hidden',
});

const TitleBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '4px 4px 4px 8px',
});

const ChatMessageCont = styled(ColumnBox)({
  flex: 1,
  padding: '8px',
  background: '#eee',
  overflowY: 'auto',
  scrollbarWidth: 'thin',

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
});

const ChatbotBubble = styled(Box)({});

const BubbleTypoBox = styled(Box)({
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 12,
  padding: '10px 12px',
  display: 'inline-block',
  maxWidth: 300,
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
});

const DataWrap = styled(ColumnBox)({
  flex: 1,
  overflow: 'hidden',
  maxWidth: 270,
});

const DataViewer = styled(Box)({
  background: '#fff',
  border: '1px solid black',
  overflowY: 'auto',
  padding: '8px',
  width: '100%',
  flex: 1,
  whiteSpace: 'pre-wrap',
});

const UserBubble = styled(Box)({ alignSelf: 'flex-end' });

const MessageInputContainer = styled(Box)({
  borderTop: '1px solid',
  padding: '6px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
});

const MessageImgBox = styled(Box)({});

const TextAreaBox = styled(FlexBox)({
  width: '100%',
  gap: '4px',
  alignItems: 'center',
  '&>div': { flex: 1 },
  '& input': { padding: 0 },
});

const SendButton = styled(Button)({
  width: 'fit-content',
  padding: '3px 12px',
  borderRadius: '4px',
  minWidth: 'auto',
  height: 'auto',
  background: 'black',
  color: 'white',
});

const InputBox = styled(ColumnBox)({
  paddingTop: 23,
  gap: '8px',
  '&>button': { marginLeft: 'auto' },
});
