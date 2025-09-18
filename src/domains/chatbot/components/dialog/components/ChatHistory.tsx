import { List, ListItem, Box, styled } from '@mui/material';
import { useInfiniteScroll } from '@domains/common/hooks/useInfiniteScroll';
import { useState, useEffect } from 'react';

interface PostResponse {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface ChatItem {
  id: number;
  text: string;
}

const ChatHistory = () => {
  const [data, setData] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 실제 경로
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        // Error 경로
        // const res = await fetch('https://jsonplaceholder.typicode.com/xxx')

        // ❌ throw 대신 조건 분기로 처리
        if (!res.ok) {
          setError(`HTTP ${res.status}`);
          return;
        }

        const json = (await res.json()) as PostResponse[];
        const mapped: ChatItem[] = json.map((post) => ({
          id: post.id,
          text: post.title,
        }));
        // 3초 지연 후 데이터 설정
        await new Promise((resolve) => setTimeout(resolve, 3000));
        // 그냥 데이터 설정
        setData(mapped);
      } catch (err) {
        setError('데이터를 불러오지 못했습니다.');
        console.error('API error:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  const { items: visibleData, onScroll } = useInfiniteScroll<ChatItem>(data, 20); // 페이지 크기 5로 테스트

  if (loading) {
    return (
      <LoadingBox sx={{ background: 'red' }}>
        <span>Loading...</span>
      </LoadingBox>
    );
  }

  if (error) {
    return <ErrorBox>{error}</ErrorBox>;
  }

  return (
    <StList onScroll={onScroll}>
      {visibleData.map((item) => (
        <StListItem key={item.id}>{item.text}</StListItem>
      ))}
    </StList>
  );
};

export default ChatHistory;

const StList = styled(List)({
  padding: '0',
  display: 'block',
  flex: '1',
  gap: '8px',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
});

const StListItem = styled(ListItem)({
  height: '50px',
  padding: '8px 0',
});

const LoadingBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

const ErrorBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'yellow',
  padding: '16px',
  height: '100%',
});
