export enum BUSINESS_TYPE {
  RETRIEVE_BOOKING_NUMBER = 'RETRIEVE_BOOKING_NUMBER',
  OFFICE_CONTACT = 'OFFICE_CONTACT',
  POINT_TO_POINT = 'POINT_TO_POINT',

  // 기본 Fallback 뷰 (정의되지 않은 businessType 처리용)
  FALLBACK = 'FALLBACK',
}

export interface BusinessPayload {
  [key: string]: string;
}
