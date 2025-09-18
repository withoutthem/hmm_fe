import React, { useEffect, useRef } from 'react';
import * as AdaptiveCards from 'adaptivecards';
import { Action } from 'adaptivecards';

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

  return <div ref={containerRef} />;
};

export default AdaptiveCardRenderer;
