import { useState, useCallback, useEffect, type UIEvent } from 'react';

/**
 * @param allItems 전체 데이터 배열
 * @param pageSize 페이지당 아이템 개수 (기본 10)
 */
export function useInfiniteScroll<T>(allItems: T[], pageSize: number = 10) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);

  // allItems가 바뀌면 items도 초기화
  useEffect(() => {
    setPage(1);
    setItems(allItems.slice(0, pageSize));
  }, [allItems, pageSize]);

  /**
   * 스크롤 이벤트 핸들러
   * 실제 스크롤이 일어나는 영역에 붙여줘야 함
   */
  const onScroll = useCallback(
    (e: UIEvent<HTMLElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        const nextPage = page + 1;
        const nextItems = allItems.slice(0, nextPage * pageSize);

        if (nextItems.length > items.length) {
          setItems(nextItems);
          setPage(nextPage);
        }
      }
    },
    [allItems, items.length, page, pageSize]
  );

  // allItems가 바뀌면 초기화
  const reset = useCallback(() => {
    setPage(1);
    setItems(allItems.slice(0, pageSize));
  }, [allItems, pageSize]);

  /**
   * visibleSuggestions : 현재 보여지는 검색어 (페이지네이션)
   * onScroll : 스크롤 이벤트 핸들러
   * reset : allSuggestions가 바뀌면 페이지네이션 초기화
   */
  return { items, onScroll, reset };
}
