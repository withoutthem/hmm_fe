import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  keyframes,
  styled,
  TextField,
} from '@mui/material';

const PublishFloating = () => {
  const options = ['가나다', '나다라', '마바사', '아자'];

  return (
    <StPublishFloating id={'publish'}>
      <PublushButton
        onClick={() => {
          const el = document.getElementById('publish');
          if (el) {
            el.style.display = 'none';
          }
        }}
      >
        X
      </PublushButton>

      <StPublishContainer>
        <TestBubble>
          <ButtonGroup variant={'symmetry'}>
            <Button variant={'secondary'} disabled>
              다음
            </Button>
            <Button variant={'primary'} disabled>
              확인
            </Button>
          </ButtonGroup>

          <TestCodeBox>
            {`
            <ButtonGroup variant={'symmetry'}>
              <Button variant={'secondary'} disabled>
                다음
              </Button>
              <Button variant={'primary'} disabled>
                확인
              </Button>
            </ButtonGroup>
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <ButtonGroup variant={'asymmetry'}>
            <Button variant={'secondary'}>다음</Button>
            <Button variant={'primary'}>확인</Button>
          </ButtonGroup>

          <TestCodeBox>
            {`
            <ButtonGroup variant={'asymmetry'}>
              <Button variant={'secondary'}>다음</Button>
              <Button variant={'primary'}>확인</Button>
            </ButtonGroup>
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <ButtonGroup variant={'column'}>
            <Button variant={'primary'}>Button</Button>
            <Button variant={'secondary'}>Button</Button>
          </ButtonGroup>

          <TestCodeBox>
            {`
            <ButtonGroup variant={'column'}>
              <Button variant={'primary'}>Button</Button>
              <Button variant={'secondary'}>Button</Button>
            </ButtonGroup>
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <Autocomplete
            disablePortal
            id="autocomplete-example"
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose an option"
                size="small"
                fullWidth
                InputLabelProps={{ className: '' }}
              />
            )}
          />
          <TestCodeBox>
            {`
            <Autocomplete
            disablePortal
            id="autocomplete-example"
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose an option"
                size="small"
                fullWidth
                InputLabelProps={{ className: '' }}
              />
            )}
          />
            `}
          </TestCodeBox>
        </TestBubble>

        <TestBubble>
          <ClipBackground>변하는 글씨 만들기</ClipBackground>
          <TestCodeBox>
            {`
            <ClipBackground>변하는 글씨 만들기</ClipBackground>
            `}
          </TestCodeBox>
        </TestBubble>
      </StPublishContainer>
    </StPublishFloating>
  );
};

export default PublishFloating;

export const PublushButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: theme.palette.primary.dark, // theme 바로 사용
  padding: '5px 10px',
  height: 'auto',
  color: '#fff',
}));

const StPublishFloating = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  overflowY: 'auto',
  background: '#fff',
  display: 'none',
  zIndex: 999,
});

const StPublishContainer = styled(Box)({
  width: '100%',
  height: '100%',
  padding: '16px',
});

const TestBubble = styled(Box)({
  background: '#fff',
  borderRadius: '12px',
  border: '1px solid',
  padding: '16px',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const TestCodeBox = styled('pre')({
  borderRadius: '8px',
  border: '1px dashed',
  padding: '8px',
  background: '#f8f9fa',
  fontFamily: 'monospace',
  fontSize: '13px',
  lineHeight: 1.4,
  margin: 0,
  whiteSpace: 'pre-wrap', // 줄바꿈 반영
});

// 하이라이트 왕복 애니메이션
const shimmer = keyframes`
    0% { background-position: 0 0; }
    50% { background-position: 100% 0; }
    100% { background-position: 0 0; }
`;

// 배경색 전환 애니메이션
const colorShift = keyframes`
  0% { background-color: #0037EB; }
  45% { background-color: #0037EB; }
  50% { background-color: #6D1AFE; }
  95% { background-color: #6D1AFE; }
  100% { background-color: #0037EB; }
`;

const ClipBackground = styled(Box)({
  fontSize: '14px',
  fontWeight: 'bold',
  // 기본 배경 (퍼플 시작)
  backgroundColor: 'purple',

  // 하얀 빛줄기
  backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
  backgroundSize: '200% 100%',
  backgroundRepeat: 'no-repeat',

  // 텍스트 클리핑
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',

  // 두 애니메이션 동시 실행
  animation: `
    ${shimmer} 5s ease-in-out infinite,
    ${colorShift} 10s linear infinite
  `,
});
