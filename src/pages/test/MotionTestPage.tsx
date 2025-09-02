import { Box, Button, styled } from '@mui/material'
import MDHTMLAnimator from '@domains/common/components/MDHTMLAnimator'
import {
  HTML_TEST_1,
  HTML_TEST_2,
  HTML_TEST_3,
  MD_TEST_1,
  MD_TEST_2,
  MD_TEST_3,
} from '@domains/common/components/testData'
import {
  htmlTestData1,
  htmlTestData2,
  htmlTestData3,
  markdownTestData1,
  markdownTestData2,
  markdownTestData3,
} from '@domains/common/components/animatorTestData'
import { AlignCenter } from '@shared/ui/layoutUtilComponents'
import { useState } from 'react'

const TEST_DATA = [
  MD_TEST_1,
  MD_TEST_2,
  MD_TEST_3,
  HTML_TEST_1,
  HTML_TEST_2,
  HTML_TEST_3,
  markdownTestData1,
  markdownTestData2,
  markdownTestData3,
  htmlTestData1,
  htmlTestData2,
  htmlTestData3,
]

const MotionTestPage = () => {
  const [testIndex, setTestIndex] = useState(0)

  return (
    <Box sx={{ maxWidth: '400px' }}>
      <AlignCenter>
        {TEST_DATA.map((_item, index) => {
          return (
            <Button
              key={index + 'asdf'}
              onClick={() => setTestIndex(index)}
              sx={{
                fontWeight: testIndex === index ? 'bold' : 'normal',
              }}
            >
              {`테스트데이터${index + 1}`}
            </Button>
          )
        })}
      </AlignCenter>
      {testIndex >= 0 && testIndex < TEST_DATA.length && (
        <StyleProvider>
          <MDHTMLAnimator
            markdown={TEST_DATA[testIndex] as string}
            segment="char" // word/char/sentence 단위 선택
            speed={20}
            delayMs={100}
            showCaret={true}
            className="md_html_animator"
          />
        </StyleProvider>
      )}
    </Box>
  )
}

export default MotionTestPage

const StyleProvider = styled(Box)({
  '& .prose': {
    // Tailwind CSS의 prose 클래스에 대한 스타일을 여기에 추가
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#333',
  },
  '& .md_html_animator': {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8',
  },
})
