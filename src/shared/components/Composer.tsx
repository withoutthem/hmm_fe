import {
  Box,
  type BoxProps,
  IconButton,
  List,
  ListItem,
  styled,
  TextField,
  ClickAwayListener,
  keyframes,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import useMessageStore, { type UserMessage } from '@domains/common/ui/store/message.store';
import { useState } from 'react';
import { AlignCenter, ColumnBox, FlexBox } from '@shared/ui/layoutUtilComponents';
import DOMPurify from 'dompurify';
import { useInfiniteScroll } from '@domains/common/hooks/useInfiniteScroll';
import { SendIcon } from '@shared/icons/SendIcon';
import { AddIcon } from '@shared/icons/AddIcon';
import { ResetIcon } from '@shared/icons/ResetIcon';
import { ChatIcon } from '@shared/icons/ChatIcon';
import { HistoryIcon } from '@shared/icons/HistoryIcon';
import { FAQIcon } from '@shared/icons/FAQIcon';
import useUiStore from '@domains/common/ui/store/ui.store';

interface MockData {
  userId: number;
  title: string;
  body: string;
}

const Composer = () => {
  const message = useMessageStore((s) => s.message);
  const setMessage = useMessageStore((s) => s.setMessage);
  const images = useMessageStore((s) => s.images);
  const setImages = useMessageStore((s) => s.setImages);
  const messages = useMessageStore((s) => s.messages);
  const setMessages = useMessageStore((s) => s.setMessages);
  const setIsMenuOpen = useUiStore((s) => s.setIsMenuOpen);

  const [allSuggestions, setAllSuggestions] = useState<string[]>([]); // 모든 검색어

  const { items: visibleSuggestions, onScroll, reset } = useInfiniteScroll(allSuggestions, 10); // 자동스크롤

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsMenuOpen(event.currentTarget); // 버튼 기준으로 메뉴 위치 잡음
  };

  // Ctrl + V로 이미지 붙여넣기
  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData.files.length > 0) {
      const pastedFiles = Array.from(e.clipboardData.files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (pastedFiles.length > 0) {
        setImages([...images, ...pastedFiles]); // 직접 처리
      }
    }
  };

  // 이미지 삭제
  const onRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx)); // 직접 처리
  };

  const onMessageSend = () => {
    const trimmed = message.trim();
    if (!trimmed && images.length === 0) return;

    const userMsg: UserMessage = {
      sender: 'user',
      type: 'message',
      ...(trimmed ? { message: trimmed } : {}),
      ...(images.length ? { images } : {}),
    };

    setMessages([...messages, userMsg]); // 전체 메시지에 추가
    setMessage(''); // 메시지 초기화
    setImages([]); // 업로드 된 이미지 초기화
    setAllSuggestions([]); // 자동완성 초기화
    reset(); // 자동스크롤 초기화
  };

  // 엔터키 전송
  const onMessageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      onMessageSend();
    }
  };
  // 자동완성 API 호출
  const fetchSuggestions = async (query: string) => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      const raw = (await res.json()) as MockData[];

      const filtered = raw.map((item) => item.title).filter((title) => title.includes(query));

      setAllSuggestions(filtered);
      reset(); // 페이지네이션 초기화
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  // 자동완성 갱신
  const onMessageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (value.length >= 2) {
      // 검색어가 2개 이상될때 API 호출
      await fetchSuggestions(value);
    } else {
      // 검색어가 2개 미만이면 자동완성 노출 X
      setAllSuggestions([]);
      reset();
    }
  };

  // 자동완성 텍스트 하이라이트
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());

    if (idx === -1) return text;

    const before = text.substring(0, idx);
    const match = text.substring(idx, idx + query.length);
    const after = text.substring(idx + query.length);

    const highlighted = `${before}<span>${match}</span>${after}`;

    return DOMPurify.sanitize(highlighted);
  };

  // 자동완성 클릭
  const onSuggestionClick = (text: string) => {
    const userMsg: UserMessage = {
      sender: 'user',
      type: 'message',
      message: text,
    };

    setMessages([...messages, userMsg]);
    setMessage('');
    setImages([]);

    // 👇 자동완성 닫기
    setAllSuggestions([]);
    reset();
  };

  return (
    <ClickAwayListener onClickAway={() => setAllSuggestions([])}>
      <StyledComposer component={'footer'}>
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

            <ColumnBox sx={{ position: 'relative' }}>
              {/* 자동완성 */}
              {visibleSuggestions.length > 0 && (
                <SuggestionBox>
                  <SuggestionList onScroll={onScroll}>
                    {visibleSuggestions.map((s, idx) => (
                      <SuggestionListItem key={idx} onClick={() => onSuggestionClick(s)}>
                        <span dangerouslySetInnerHTML={{ __html: highlightMatch(s, message) }} />
                      </SuggestionListItem>
                    ))}
                  </SuggestionList>
                </SuggestionBox>
              )}
              <ChatInputBar className={'chat-input-bar'}>
                {/* Add 영역 */}
                <AddIconButton onClick={handleClick}>
                  <AddIcon />
                </AddIconButton>

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
      </StyledComposer>
    </ClickAwayListener>
  );
};

export default Composer;

const StyledComposer = styled(Box)<BoxProps>({
  width: '100%',
  background: '#fff',
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
});

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
});

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
});

const InputContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const ImgTextField = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const ImagePreview = styled(Box)({
  display: 'flex',
  gap: '8px',
  width: '100%',
  height: '66px',
  overflowY: 'auto',
  flexWrap: 'wrap',
  scrollbarWidth: 'thin',
  padding: '8px 8px 0 8px',
});

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(0%);
  }
  100% {
    opacity: 1;
    transform: translateY(-100%);
  }
`;

const SuggestionBox = styled(Box)({
  position: 'absolute',
  top: '0',
  left: '0',
  // transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
  willChange: 'transform, opacity',
  background: '#fff',
  boxShadow: '0 -8px 26px #22222214',
  borderRadius: '24px 24px 0 0',
  margin: 0,
  padding: '36px 0px 16px',
  width: '100%',
  opacity: 0,
  transform: 'translateY(0%)',
  animation: `${fadeInUp} .3s ease-out`,
  animationFillMode: 'forwards',
});

const SuggestionList = styled(List)({
  maxHeight: '102px',
  overflowY: 'auto',
  padding: '0',
});

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
});

const ChatInputBar = styled(AlignCenter)({
  gap: '12px',
  position: 'relative',
  padding: '8px 20px',
  background: '#fff',
  zIndex: '1',
});

const AddIconButton = styled(IconButton)({
  width: '22px',
  height: '22px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
});

const StyledTextField = styled(TextField)({
  padding: '8px 12px',
  backgroundColor: '#F1F3F5',
  borderRadius: '8px',
  flex: 1,

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

    '&::placeholder': {
      color: '#797C7B',
      opacity: '.5',
    },
  },
});

const SendButton = styled(IconButton)({
  padding: '0',
  width: '34px',
  height: '34px',
  background: '#1C2681',

  '&:disabled': {
    background: '#B2BBC3',
  },
});
