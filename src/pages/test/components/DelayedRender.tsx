import { type ReactNode, useEffect, useState } from 'react';

export const DelayedRender = ({
  delayMs,
  children,
  placeholder,
}: {
  delayMs: number;
  children: ReactNode;
  placeholder?: ReactNode;
}) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);
  return ready ? <>{children}</> : <>{placeholder ?? null}</>;
};

export default DelayedRender;
