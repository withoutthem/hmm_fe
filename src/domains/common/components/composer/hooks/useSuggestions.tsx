// src/domains/common/components/composer/hooks/useSuggestions.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { chatbotService, type Suggestion } from '@domains/chatbot/services/chatbotService';
import { useInfiniteScroll } from '@domains/common/hooks/useInfiniteScroll';

interface UseSuggestionsOptions {
  minChars?: number;
  debounceMs?: number;
  pageSize?: number;
}

export const useSuggestions = (
  query: string,
  { minChars = 2, debounceMs = 180, pageSize = 10 }: UseSuggestionsOptions = {}
) => {
  const [allSuggestions, setAllSuggestions] = useState<Suggestion[]>([]);
  const { items: visibleSuggestions, onScroll } = useInfiniteScroll(allSuggestions, pageSize);

  const abortRef = useRef<AbortController | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    try {
      const results = await chatbotService.getSuggestions();
      // query 기반 필터링
      const filtered = results.filter((item) => item.body.toLowerCase().includes(q.toLowerCase()));
      setAllSuggestions(filtered);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name !== 'AbortError') {
          console.error('Suggestion API Error:', err.message);
        }
      } else {
        // Error 객체가 아닌 경우도 안전하게 처리
        console.error('Unknown error while fetching suggestions', err);
      }
    }
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < minChars) {
      setAllSuggestions([]);
      abortRef.current?.abort();
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const id = window.setTimeout(() => {
      void fetchSuggestions(q);
    }, debounceMs);

    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query, minChars, debounceMs, fetchSuggestions]);

  const clear = useCallback(() => {
    setAllSuggestions([]);
  }, []);

  const onSuggestionClick = useCallback(
    (text: string) => {
      clear();
      return text;
    },
    [clear]
  );

  const isOpen = query.trim().length >= minChars && allSuggestions.length > 0;

  return { isOpen, visibleSuggestions, onScroll, clear, onSuggestionClick };
};
