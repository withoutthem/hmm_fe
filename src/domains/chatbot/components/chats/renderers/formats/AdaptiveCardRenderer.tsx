import React, { useEffect, useRef } from 'react';
import * as AdaptiveCards from 'adaptivecards';
import { Action } from 'adaptivecards';
import { Box, styled } from '@mui/material';
import DatePickerIcon from '@assets/img/icon/ic_datepicker.svg';
import DownIcon from '@assets/img/icon/ic_down.svg';
import TimeIcon from '@assets/img/icon/ic_time.svg';

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
  '& button': { background: 'black', color: theme.palette.secondary.main },
  '& table': { width: '100%', borderCollapse: 'collapse' },
  '& td': { border: '1px solid #ddd' },
  '& .ac-horizontal-separator': { display: 'none !important' },

  '& .ac-textBlock': {
    fontSize: '15px !important',
    lineHeight: '1.4 !important',
    fontWeight: '600 !important',
    fontFamily: `"Pretendard", -apple-system, "Segoe UI", Roboto, sans-serif !important`,
    letterSpacing: '0px',
  },
  '& input, & select': {
    border: '1px solid #DEE2E6',
    borderRadius: '8px',
    padding: '12px 20px',
    color: '#343A40',
    height: '68px',

    '&.ac-input-validation-failed': { borderColor: '#F00', background: '#FCEEEE' },
  },

  '& input': {
    '&::placeholder': { color: '#878F96', fontWeight: '500' },

    '&[type="date"]::-webkit-calendar-picker-indicator': {
      // display: 'none',
      // WebkitAppearance: 'none',
      width: '20px',
      height: '20px',
      background: `url("${DatePickerIcon}") no-repeat center center`,
      backgroundSize: '20px 20px',
    },
    '&[type="time"]::-webkit-calendar-picker-indicator': {
      width: '20px',
      height: '20px',
      background: `url("${TimeIcon}") no-repeat center center`,
      backgroundSize: '20px 20px',
    },
  },

  '& select': {
    appearance: 'none' /* 공통 */,
    WebkitAppearance: 'none' /* 크롬/사파리 */,
    MozAppearance: 'none' /* 파이어폭스 */,
    background: `#FFF url("${DownIcon}") no-repeat right 20px center`,
  },
  '& #columnBox': { flexDirection: 'column !important', gap: '8px' },
  '& #flexBox': { flexDirection: 'row !important' },
  '& #rowBox': { flexDirection: 'row !important', gap: '8px', '>div': { flex: '1 !important' } },
  '& .ac-actionSet': { '& > button': { flex: '1 !important' } },
  '& .ac-pushButton': {
    height: '56px',
    borderRadius: '12px',
    padding: '16px 0',
    fontSize: '17px',
    fontWeight: '600',
    lineHeight: '1.4',
    background: '#20265B',
    color: '#fff',

    '&.style-destructive': { background: '#E9ECEF', color: '#343A40' },
  },
  '& #h16': { height: '16px' },
  '& #h24': { height: '24px' },
}));
