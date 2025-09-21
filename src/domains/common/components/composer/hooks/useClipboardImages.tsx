// src/domains/common/components/composer/hooks/useClipboardImages.ts
import { useCallback, useEffect, useMemo, useRef, useState, type ClipboardEvent } from 'react';

export const useClipboardImages = () => {
  const [images, setImages] = useState<File[]>([]);
  const urlsRef = useRef<string[]>([]);

  const onPaste = useCallback((e: ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(e.clipboardData?.files ?? []).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length === 0) return;
    setImages((prev) => [...prev, ...files]);
  }, []);

  const removeAt = useCallback((idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  // 미리보기 URL 생성/해제 (메모리 누수 방지)
  const previewUrls = useMemo(() => {
    // 기존 revoke
    for (const u of urlsRef.current) URL.revokeObjectURL(u);
    urlsRef.current = images.map((f) => URL.createObjectURL(f));
    return urlsRef.current;
  }, [images]);

  useEffect(() => {
    return () => {
      for (const u of urlsRef.current) URL.revokeObjectURL(u);
      urlsRef.current = [];
    };
  }, []);

  return { images, onPaste, removeAt, clearImages, previewUrls };
};
