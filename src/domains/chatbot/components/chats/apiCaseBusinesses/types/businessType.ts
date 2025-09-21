export enum BUSINESS_TYPE {
  RETRIEVE_BOOKING_NUMBER = 'RETRIEVE_BOOKING_NUMBER',
  OFFICE_CONTACT = 'OFFICE_CONTACT',
  POINT_TO_POINT = 'POINT_TO_POINT',
}

export interface BusinessPayload {
  [key: string]: string;
}
