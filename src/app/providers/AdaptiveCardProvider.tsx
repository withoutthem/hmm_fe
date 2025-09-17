import React, { createContext, useContext, useState } from 'react';
import { Box } from '@mui/material';
import * as AdaptiveCards from 'adaptivecards';

interface AdaptiveCardContextProps {
  card: AdaptiveCards.AdaptiveCard | null;
  setCard: (card: AdaptiveCards.AdaptiveCard | null) => void;
  onExecuteAction?: (action: AdaptiveCards.Action) => void;
}

const AdaptiveCardContext = createContext<AdaptiveCardContextProps | null>(null);

const AdaptiveCardProvider = ({ children }: { children: React.ReactNode }) => {
  const [card, setCard] = useState<AdaptiveCards.AdaptiveCard | null>(null);

  const onExecuteAction = (action: AdaptiveCards.Action) => {
    console.log('AdaptiveCard Action executed:', action);
  };

  return (
    <AdaptiveCardContext.Provider value={{ card, setCard, onExecuteAction }}>
      <Box>{children}</Box>
    </AdaptiveCardContext.Provider>
  );
};

export const useAdaptiveCard = () => {
  const context = useContext(AdaptiveCardContext);
  if (!context) throw new Error('useAdaptiveCard must be used within AdaptiveCardProvider');
  return context;
};

export default AdaptiveCardProvider;
