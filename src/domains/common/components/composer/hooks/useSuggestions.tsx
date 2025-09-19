import { useCallback, useEffect, useState } from 'react';
import { useInfiniteScroll } from '@domains/common/hooks/useInfiniteScroll';
import { chatbotService } from '@domains/chatbot/services/chatbotService';

type Options = {
  minChars?: number;
  debounceMs?: number;
  pageSize?: number;
};

export const useSuggestions = (
  query: string,
  { minChars = 2, debounceMs = 180, pageSize = 10 }: Options = {}
) => {
  const [allSuggestions, setAllSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const {
    items: visibleSuggestions,
    onScroll,
    reset,
  } = useInfiniteScroll(allSuggestions, pageSize);

  const fetchSuggestions = useCallback(
    async (q: string) => {
      try {
        const rows = await chatbotService.getSuggestions();
        const filtered = rows
          .map((item) => item.title)
          .filter((title) => title.toLowerCase().includes(q.toLowerCase()));
        setAllSuggestions(filtered);
        setIsOpen(filtered.length > 0);
        reset();
      } catch (err) {
        console.error('Suggestion API Error:', err);
        setAllSuggestions([]);
        setIsOpen(false);
      }
    },
    [reset]
  );

  useEffect(() => {
    const q = (query ?? '').trim();
    if (q.length < minChars) {
      setAllSuggestions([]);
      setIsOpen(false);
      reset();
      return;
    }
    const id = window.setTimeout(() => {
      void fetchSuggestions(q);
    }, debounceMs);
    return () => window.clearTimeout(id);
  }, [query, minChars, debounceMs, fetchSuggestions, reset]);

  const clear = useCallback(() => {
    setAllSuggestions([]);
    setIsOpen(false);
    reset();
  }, [reset]);

  const onSuggestionClick = useCallback(
    (text: string) => {
      clear();
      return text; // 선택된 결과 반환
    },
    [clear]
  );

  return {
    isOpen,
    visibleSuggestions,
    onScroll,
    clear,
    onSuggestionClick,
  };
};
