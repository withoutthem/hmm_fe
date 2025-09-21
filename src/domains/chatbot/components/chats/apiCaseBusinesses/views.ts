// src/domains/chatbot/components/chats/business/views.ts
import type { ComponentType } from 'react';
import type { BusinessPayload } from './types/businessType';
import { BUSINESS_TYPE } from './types/businessType';

// 각 비즈니스 컴포넌트의 props 시그니처(통일)
type ViewProps = { data?: BusinessPayload };

// lazy 로더 타입
type Loader = () => Promise<{ default: ComponentType<ViewProps> }>;

/**
 * BUSINESS_TYPE → 동적 import 매핑
 * - 코드 스플리팅: 필요한 뷰만 런타임에 로드
 * - TS 완전성 체크: satisfies로 누락/오타 컴파일 타임 검출
 */
const businessViewLoaders = {
  [BUSINESS_TYPE.RETRIEVE_BOOKING_NUMBER]: () =>
    import('./implementations/retrieveBookingNumber/RetrieveBookingNumber'),
  [BUSINESS_TYPE.OFFICE_CONTACT]: () => import('./implementations/officeContact/OfficeContact'),
  [BUSINESS_TYPE.POINT_TO_POINT]: () => import('./implementations/pointToPoint/PointToPoint'),
} satisfies Record<BUSINESS_TYPE, Loader>;

export default businessViewLoaders;
