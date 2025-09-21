// BusinessTypeOrchestrator.tsx
import { Suspense, lazy, useMemo } from 'react';
import {
  BUSINESS_TYPE,
  type BusinessPayload,
} from '@domains/chatbot/components/chats/apiCaseBusinesses/types/businessType';
import businessViewLoaders from '@domains/chatbot/components/chats/apiCaseBusinesses/views';
import DefaultBusinessFallback from '@domains/chatbot/components/chats/apiCaseBusinesses/implementations/DefaultBusinessFallback';
import type { TalkMessage } from '@domains/common/ui/store/message.store';

interface BusinessTypeOrchestratorProps {
  businessType: BUSINESS_TYPE;
  payload?: BusinessPayload; // <-- payload는 optional
  talkMessage: TalkMessage;
}

const BusinessTypeOrchestrator = (props: Readonly<BusinessTypeOrchestratorProps>) => {
  const { businessType, payload } = props;

  const View = useMemo(() => {
    const loader = businessViewLoaders[businessType];
    return loader ? lazy(loader) : null;
  }, [businessType]);

  const viewProps = payload ? { data: payload } : {};
  const fallbackProps = payload ? { data: payload } : {};

  if (!View) return <DefaultBusinessFallback {...fallbackProps} />;

  return (
    <Suspense fallback={<DefaultBusinessFallback {...fallbackProps} />}>
      <View {...viewProps} />
    </Suspense>
  );
};

export default BusinessTypeOrchestrator;
