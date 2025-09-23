// src/domains/chatbot/services/chatbotService.ts
import { GET } from '@/shared/platform/http';

export interface Suggestion {
  userId: number;
  title: string;
  body: string;
}

export interface DaptalkSendMessageDto {
  message: string;
}

export const chatbotService = {
  getSuggestions: async (): Promise<Suggestion[]> => {
    const res = await GET<Suggestion[]>('https://jsonplaceholder.typicode.com/posts');
    return res.data;
  },

  sendDapTalkMessage: async (message: DaptalkSendMessageDto): Promise<void> => {},
};
