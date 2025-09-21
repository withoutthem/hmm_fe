import { ChatbotBubbleWrap } from '@shared/ui/layoutUtilComponents';

interface MarkdownAnimatorProps {
  tokens: string;
}

const MarkdownAnimator = ({ tokens }: MarkdownAnimatorProps) => {
  return (
    <ChatbotBubbleWrap>
      <div dangerouslySetInnerHTML={{ __html: tokens }} />
    </ChatbotBubbleWrap>
  );
};

export default MarkdownAnimator;
