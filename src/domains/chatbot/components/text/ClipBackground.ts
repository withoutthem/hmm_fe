// 하이라이트 왕복 애니메이션
import { Box, styled, keyframes } from '@mui/material';

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

export const ClipBackground = styled(Box)({
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
