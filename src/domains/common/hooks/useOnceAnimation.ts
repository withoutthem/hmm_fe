import { useEffect, useState } from 'react';

const animatedSet = new Set<number>();

export const useOnceAnimation = (index: number) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!animatedSet.has(index)) {
      setAnimated(true);
      animatedSet.add(index); // 최초 한 번만 실행
    }
  }, [index]);

  return animated;
};
