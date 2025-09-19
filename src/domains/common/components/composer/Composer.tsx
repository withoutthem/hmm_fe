// src/domains/common/components/composer/Composer.tsx
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
} from '@mui/material';
import { AlignCenter, ColumnBox } from '@shared/ui/layoutUtilComponents';
import useUIStore from '@domains/common/ui/store/ui.store';
import { useCallback, type MouseEvent } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useSuggestions } from '@domains/common/components/composer/hooks/useSuggestions';
import { useClipboardImages } from '@domains/common/components/composer/hooks/useClipboardImages';
import { useSendMessage } from '@domains/common/components/composer/hooks/useSendMessage';
import { SendIcon } from '@shared/icons/SendIcon';
import { AddIcon } from '@shared/icons/AddIcon';
import { highlightMatch } from '@domains/common/utils/utils';

interface ComposerFormValues {
  message: string;
}

const Composer = () => {
  // ┣━━━━━━━━━━━━━━━━ Hooks ━━━━━━━━━━━━━━━━┫
  const { control, reset: resetForm } = useForm<ComposerFormValues>({
    mode: 'onChange',
    defaultValues: { message: '' },
  });
  const message = useWatch({ control, name: 'message' }) ?? '';

  /**
   * 자동완성
   */
  const { isOpen, visibleSuggestions, onScroll, clear, onSuggestionClick } = useSuggestions(
    message,
    { minChars: 2, debounceMs: 180 }
  );

  /**
   * 클립보드
   */
  const { images, onPaste, removeAt, previewUrls, clearImages } = useClipboardImages();

  /**
   * 메시지 전송
   */
  const { send, sendPicked, onKeyDownEnterToSend } = useSendMessage({
    getMessage: () => message,
    images,
    clearForm: () => resetForm({ message: '' }),
    clearImages,
    afterSend: clear,
  });

  // ┣━━━━━━━━━━━━━━━━ Stores ━━━━━━━━━━━━━━┫
  const setIsMenuOpen = useUIStore((s) => s.setIsMenuOpen);

  // ┣━━━━━━━━━━━━━━━━ Handlers ━━━━━━━━━━━━┫
  const onPlusIconClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setIsMenuOpen(event.currentTarget);
    },
    [setIsMenuOpen]
  );

  return (
    <ClickAwayListener onClickAway={clear}>
      <StComposer component={'footer'}>
        <InputContainer>
          <ImgTextField>
            {/* 붙여넣은 이미지 미리보기 */}
            {images.length > 0 && (
              <ImagePreview>
                {previewUrls.map((url, idx) => (
                  <ImagePreviewItem key={url + idx}>
                    <img src={url} alt={`pasted-${idx}`} />
                    <DeleteButton onClick={() => removeAt(idx)}>×</DeleteButton>
                  </ImagePreviewItem>
                ))}
              </ImagePreview>
            )}

            <ColumnBox sx={{ position: 'relative' }}>
              {/* 자동완성 */}
              {isOpen && visibleSuggestions.length > 0 && (
                <SuggestionBox>
                  <SuggestionList onScroll={onScroll}>
                    {visibleSuggestions.map((suggestion, idx) => (
                      <SuggestionListItem
                        key={suggestion.body + idx}
                        onClick={() => {
                          const picked = onSuggestionClick(suggestion.body);
                          sendPicked(picked); // 선택 즉시 전송
                        }}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(suggestion.body, message),
                          }}
                        />
                      </SuggestionListItem>
                    ))}
                  </SuggestionList>
                </SuggestionBox>
              )}

              <ChatInputBar className={'chat-input-bar'}>
                {/* Add 영역 */}
                <AddIconButton onClick={onPlusIconClick}>
                  <AddIcon />
                </AddIconButton>

                {/* 메시지 입력 영역 */}
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <StTextField
                      multiline
                      maxRows={3}
                      placeholder="궁금한 내용을 입력해주세요."
                      value={field.value}
                      onChange={(e) => field.onChange(e)}
                      onPaste={onPaste}
                      variant="outlined"
                      fullWidth
                      onKeyDown={onKeyDownEnterToSend}
                    />
                  )}
                />

                {/* 보내기 버튼 */}
                <SendButton onClick={send}>
                  <SendIcon />
                </SendButton>
              </ChatInputBar>
            </ColumnBox>
          </ImgTextField>
        </InputContainer>
      </StComposer>
    </ClickAwayListener>
  );
};

export default Composer;

/* ====================== styles ====================== */

const StComposer = styled(Box)<BoxProps>({
  width: '100%',
  background: '#fff',
  boxSizing: 'border-box',
  display: 'flex',
  fontSize: '16px',
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

const StTextField = styled(TextField)({
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
