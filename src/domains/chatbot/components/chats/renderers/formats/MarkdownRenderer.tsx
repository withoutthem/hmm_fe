import { ChatbotBubbleWrap } from '@shared/ui/layoutUtilComponents';

interface MarkdownAnimatorProps {
  tokens: string;
}

const MarkdownRenderer = ({ tokens }: MarkdownAnimatorProps) => {
  //TODO: File Download 구현
  return (
    <ChatbotBubbleWrap className={'markdown_renderer'}>
      <div dangerouslySetInnerHTML={{ __html: tokens }} />
    </ChatbotBubbleWrap>
  );
};

export default MarkdownRenderer;
