import * as AdaptiveCards from 'adaptivecards';
import type { IAdaptiveCard } from 'adaptivecards';

export interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  startTime?: string;
  endTime?: string;
  task1?: boolean;
  task2?: boolean;
  task3?: boolean;
  [key: string]: string | boolean | undefined; // 👈 인덱스 시그니처 추가
}

export const adaptiveCardData: IAdaptiveCard = {
  type: 'AdaptiveCard',
  version: '1.3',
  body: [
    //필수값 체크
    // isRequired: true,

    // 1. 기본 텍스트
    { type: 'TextBlock', text: 'Small Text / Lighter Weight', size: 'small', weight: 'lighter' },
    {
      type: 'TextBlock',
      text: 'Default Text / Default Weight',
      size: 'default',
      weight: 'default',
    },
    { type: 'TextBlock', text: 'Medium Text / Bolder Weight', size: 'medium', weight: 'bolder' },
    { type: 'TextBlock', text: 'Large Text', size: 'large' },
    { type: 'TextBlock', text: 'Extra Large Text', size: 'extraLarge' },

    // 2. 입력폼
    {
      type: 'Input.Text',
      id: 'name',
      placeholder: '이름 (한글/영문만 입력)',
      // regex: '^[a-zA-Z가-힣]+$',
    },
    {
      type: 'Input.Text',
      id: 'email',
      placeholder: '이메일을 입력하세요',
      // isRequired: true,
      style: 'Email',
      // regex: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
    },
    {
      type: 'Input.Text',
      id: 'phone',
      placeholder: "휴대전화번호('-' 제외, 11자리)",
      // regex: '^01[0-9]{9}$',
      style: 'Tel',
    },

    // 3. 체크리스트
    {
      type: 'Input.Toggle',
      id: 'task1',
      title: 'id : task1',
      valueOn: 'true',
      valueOff: 'false',
    },
    {
      type: 'Input.Toggle',
      id: 'task2',
      title: 'id : task2',
      valueOn: 'true',
      valueOff: 'false',
    },
    {
      type: 'Input.Toggle',
      id: 'task3',
      title: 'id : task3',
      valueOn: 'true',
      valueOff: 'false',
      horizontalAlignment: true,
    },

    // 4. 날짜 선택
    // { type: 'Input.Date', id: 'date', title: '날짜 선택' },
    // { type: 'Input.Time', id: 'time', title: '날짜 선택' },
    // {
    //   type: 'Container',
    //   id: 'timeBox',
    //   items: [
    //     { type: 'TextBlock', text: '입차시간1', weight: 'Bolder', wrap: true },
    //     {
    //       type: 'Input.ChoiceSet',
    //       id: 'startTime1',
    //       isRequired: true,
    //       style: 'compact',
    //       choices: [
    //         { title: '09:00', value: '09:00' },
    //         { title: '09:30', value: '09:30' },
    //         { title: '10:00', value: '10:00' },
    //       ],
    //     },
    //     { type: 'TextBlock', text: '출차시간1', weight: 'Bolder', wrap: true },
    //     {
    //       type: 'Input.ChoiceSet',
    //       id: 'endTime1',
    //       isRequired: true,
    //       style: 'compact',
    //       choices: [
    //         { title: '09:00', value: '09:00' },
    //         { title: '09:30', value: '09:30' },
    //         { title: '10:00', value: '10:00' },
    //       ],
    //     },
    //   ],
    // },
    {
      type: 'Container',
      id: 'timeBox',
      items: [
        { type: 'TextBlock', text: '입차시간2', weight: 'Bolder', wrap: true },
        {
          type: 'Input.ChoiceSet',
          id: 'startTime2',
          isRequired: true,
          style: 'compact',
          choices: [
            { title: '09:00', value: '09:00' },
            { title: '09:30', value: '09:30' },
            { title: '10:00', value: '10:00' },
          ],
        },
        { type: 'TextBlock', text: '출차시간2', weight: 'Bolder', wrap: true },
        {
          type: 'Input.ChoiceSet',
          id: 'endTime2',
          isRequired: true,
          style: 'compact',
          choices: [
            { title: '09:00', value: '09:00' },
            { title: '09:30', value: '09:30' },
            { title: '10:00', value: '10:00' },
          ],
        },
      ],
    },
    //
    // // 5. 이미지 + 이미지 그룹
    // { type: 'Image', url: 'https://picsum.photos/400/200', size: 'Stretch' },
    // {
    //   type: 'ImageSet',
    //   imagesize: 'medium',
    //   images: [
    //     { type: 'Image', url: 'https://picsum.photos/200/150?1' },
    //     { type: 'Image', url: 'https://picsum.photos/200/150?2' },
    //     { type: 'Image', url: 'https://picsum.photos/200/150?3' },
    //   ],
    // },
    //
    // // 6. FactSet (테이블)
    // {
    //   type: 'FactSet',
    //   facts: [
    //     { title: '상품', value: '노트북' },
    //     { title: '수량', value: '1' },
    //     { title: '가격', value: '₩1,500,000' },
    //   ],
    // },
  ],
  actions: [
    { type: 'Action.Submit', title: '확인' },
    { type: 'Action.Execute', title: '취소' },
    { type: 'Action.OpenUrl', title: '자세히 보기', url: 'https://example.com' },
  ],
} as unknown as AdaptiveCards.IAdaptiveCard;
