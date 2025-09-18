import { Autocomplete, Box, Button, ButtonGroup, styled, TextField } from '@mui/material';

const PublishFloating = () => {
  const options = ['가나다', '나다라', '마바사', '아자'];

  return (
    <StyledPublishFloating id={'publish'}>
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

      <StyledPublishContainer>
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

        <TestBubble></TestBubble>
      </StyledPublishContainer>
    </StyledPublishFloating>
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

const StyledPublishFloating = styled(Box)({
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

const StyledPublishContainer = styled(Box)({
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
