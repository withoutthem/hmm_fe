import React, { useEffect, useRef } from 'react';
import * as AdaptiveCards from 'adaptivecards';
import { Action } from 'adaptivecards';
import { Box, styled } from '@mui/material';

interface AdaptiveCardRendererProps {
  card: AdaptiveCards.IAdaptiveCard;
  onSubmit?: (data: Record<string, unknown>) => void;
}

AdaptiveCards.AdaptiveCard.onProcessMarkdown = (text, result) => {
  result.outputHtml = text;
  result.didProcess = true;
};

const AdaptiveCardRenderer = ({ card, onSubmit }: AdaptiveCardRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.parse(card);
    const renderedCard = adaptiveCard.render();

    adaptiveCard.onExecuteAction = (action: Action) => {
      if (action.getJsonTypeName() === 'Action.Submit') {
        const submitAction = action as AdaptiveCards.SubmitAction;
        const data = (submitAction.data ?? {}) as Record<string, unknown>;
        onSubmit?.(data);
      }
    };

    if (containerRef.current && renderedCard) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(renderedCard);
    }
  }, [card, onSubmit]);

  return (
    <AdaptiveCardStyleProvider className={'adaptive_card adaptive_card_style_provider'}>
      <Box ref={containerRef} />
    </AdaptiveCardStyleProvider>
  );
};

export default AdaptiveCardRenderer;

/** AdaptiveCard 스타일 */
const AdaptiveCardStyleProvider = styled(Box)(({ theme }) => ({
  '& input, & select': {
    border: '1px solid black',
    '&.ac-input-validation-failed': { borderColor: 'red', color: 'red' },
  },
  '& button': { background: 'black', color: theme.palette.secondary.main },
  '& table': { width: '100%', borderCollapse: 'collapse' },
  '& td': { border: '1px solid #ddd' },
  '& .ac-horizontal-separator': { display: 'none !important' },
  '& #timeBox': { flexDirection: 'row !important', '& > div': { flex: '1 !important' } },
}));
