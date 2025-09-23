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
  [key: string]: string | boolean | undefined; // 인덱스 시그니처 추가
}

export const parkingData: IAdaptiveCard = {
  type: 'AdaptiveCard',
  version: '1.3',
  body: [
    // 입출차일자
    {
      type: 'Container',
      id: 'columnBox',
      items: [
        { type: 'TextBlock', text: '입출차일자 *', wrap: true },
        {
          type: 'Input.Date',
          id: 'date',
          isRequired: true,
        },
      ],
    },

    // 사이간격
    {
      type: 'Container',
      id: 'h16',
      items: [],
    },

    // 입차시간 , 출차시간
    {
      type: 'Container',
      id: 'rowBox',
      items: [
        {
          type: 'Container',
          id: 'columnBox',
          items: [
            { type: 'TextBlock', text: '입차시간 *', wrap: true },
            {
              type: 'Input.ChoiceSet',
              id: 'startTime',
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
        {
          type: 'Container',
          id: 'columnBox',
          items: [
            { type: 'TextBlock', text: '출차시간 *', wrap: true },
            {
              type: 'Input.ChoiceSet',
              id: 'endTime',
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
      ],
    },

    // 사이간격
    {
      type: 'Container',
      id: 'h16',
      items: [],
    },

    // 차량번호
    {
      type: 'Container',
      id: 'columnBox',
      items: [
        { type: 'TextBlock', text: '차량번호 *', wrap: true },
        {
          type: 'Container',
          id: 'rowBox',
          items: [
            {
              type: 'Input.Text',
              id: 'carNumberPrefix',
              isRequired: true,
              placeholder: '예시) 123가',
            },
            {
              type: 'Input.Text',
              id: 'carNumberSuffix',
              isRequired: true,
              placeholder: '예시) 4567',
            },
          ],
        },
      ],
    },

    //사이간격
    {
      type: 'Container',
      id: 'h16',
      items: [],
    },

    //차량명
    {
      type: 'Container',
      id: 'columnBox',
      items: [
        { type: 'TextBlock', text: '차량명 *', wrap: true },
        {
          type: 'Input.Text',
          id: 'carName',
          isRequired: true,
          placeholder: '차량명을 입력해주세요.',
        },
      ],
    },

    //사이간격
    {
      type: 'Container',
      id: 'h16',
      items: [],
    },

    //소속
    {
      type: 'Container',
      id: 'columnBox',
      items: [
        { type: 'TextBlock', text: '소속 *', wrap: true },
        {
          type: 'Input.Text',
          id: 'company',
          isRequired: true,
          placeholder: '내방객의 소속을 입력해주세요.',
        },
      ],
    },

    //사이간격
    {
      type: 'Container',
      id: 'h16',
      items: [],
    },

    //호칭
    {
      type: 'Container',
      id: 'columnBox',
      items: [
        { type: 'TextBlock', text: '호칭 *', wrap: true },
        {
          type: 'Input.Text',
          id: 'jobTitle',
          isRequired: true,
          placeholder: '내방객의 호칭을 입력해주세요.',
        },
      ],
    },

    //사이간격
    {
      type: 'Container',
      id: 'h16',
      items: [],
    },

    //성명
    {
      type: 'Container',
      id: 'columnBox',
      items: [
        { type: 'TextBlock', text: '성명 *', wrap: true },
        {
          type: 'Input.Text',
          id: 'name',
          isRequired: true,
          placeholder: '내방객의 성명을 입력해주세요.',
        },
      ],
    },

    //사이간격
    {
      type: 'Container',
      id: 'h16',
      items: [],
    },

    //전화번호
    {
      type: 'Container',
      id: 'columnBox',
      items: [
        { type: 'TextBlock', text: '전화번호 *', wrap: true },
        {
          type: 'Input.Text',
          id: 'phoneNumber',
          isRequired: true,
          placeholder: '내방객의 전화번호을 입력해주세요.',
          regex: '^01[0-9]{9}$',
          style: 'Tel',
        },
      ],
    },

    //사이간격
    {
      type: 'Container',
      id: 'h24',
      items: [],
    },
  ],
  actions: [
    {
      type: 'Action.Submit',
      title: '취소',
      associatedInputs: 'none', // 필수값 무시!
      data: { action: 'cancel' },
      style: 'destructive',
    },
    { type: 'Action.Submit', title: '확인' },
  ],
} as unknown as AdaptiveCards.IAdaptiveCard;

export const lifeEventData: IAdaptiveCard = {
  type: 'AdaptiveCard',
  version: '1.3',
  body: [
    // 시업시간
    {
      type: 'Container',
      id: 'columnBox',
      items: [
        { type: 'TextBlock', text: '시업시간(출근시간) *', wrap: true },
        {
          type: 'Input.ChoiceSet',
          id: 'startWorkTime',
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

    //사이간격
    {
      type: 'Container',
      id: 'h16',
      items: [],
    },

    //경조유형
    {
      type: 'Container',
      id: 'columnBox',
      items: [
        { type: 'TextBlock', text: '경조유형 *', wrap: true },
        {
          type: 'Input.ChoiceSet',
          id: 'eventType',
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

    //사이간격
    {
      type: 'Container',
      id: 'h16',
      items: [],
    },

    //경조발생일자
    {
      type: 'Container',
      id: 'columnBox',
      items: [
        { type: 'TextBlock', text: '경조 발생일자 *', wrap: true },
        {
          type: 'Input.Date',
          id: 'eventDate',
          isRequired: true,
        },
      ],
    },

    //사이간격
    {
      type: 'Container',
      id: 'h16',
      items: [],
    },

    //경조발생일시
    {
      type: 'Container',
      id: 'columnBox',
      items: [
        { type: 'TextBlock', text: '경조 발생일시 *', wrap: true },
        {
          type: 'Input.Time',
          id: 'eventTime',
          isRequired: true,
        },
      ],
    },

    //사이간격
    {
      type: 'Container',
      id: 'h24',
      items: [],
    },
  ],
  actions: [
    {
      type: 'Action.Submit',
      title: '취소',
      associatedInputs: 'none', // 필수값 무시!
      data: { action: 'cancel' },
      style: 'destructive',
    },
    { type: 'Action.Submit', title: '확인' },
  ],
} as unknown as AdaptiveCards.IAdaptiveCard;
