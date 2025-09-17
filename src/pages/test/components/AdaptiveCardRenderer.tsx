import React, { useEffect, useRef } from 'react';
import * as AdaptiveCards from 'adaptivecards';

interface AdaptiveCardRendererProps {
  card: AdaptiveCards.IAdaptiveCard;
  onSubmit?: (data: Record<string, unknown>) => void;
}

const AdaptiveCardRenderer: React.FC<AdaptiveCardRendererProps> = ({ card, onSubmit }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.parse(card);

    adaptiveCard.onExecuteAction = (action) => {
      if (action.getJsonTypeName() === 'Action.Submit') {
        const submitAction = action as AdaptiveCards.SubmitAction;
        const data = (submitAction.data ?? {}) as Record<string, unknown>;
        onSubmit?.(data);
      }
    };

    const renderedCard = adaptiveCard.render();
    if (containerRef.current && renderedCard) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(renderedCard);
    }
  }, [card, onSubmit]);

  return <div ref={containerRef} />;
};

export default AdaptiveCardRenderer;
