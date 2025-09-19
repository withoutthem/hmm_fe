// src/domains/common/components/composer/hooks/useClipboardImages.ts
import { useCallback, useEffect, useMemo, type ClipboardEvent } from 'react';
import useMessageStore from '@domains/common/ui/store/message.store';

export const useClipboardImages = () => {
  const images = useMessageStore((s) => s.images);
  const setImages = useMessageStore((s) => s.setImages);

  const onPaste = useCallback(
    (e: ClipboardEvent<HTMLDivElement>) => {
      if (e.clipboardData.files.length === 0) return;
      const pasted = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith('image/'));
      if (pasted.length === 0) return;
      // 값 전달형 setter 시그니처일 경우
      setImages([...images, ...pasted]);
    },
    [images, setImages]
  );

  const removeAt = useCallback(
    (idx: number) => {
      setImages(images.filter((_, i) => i !== idx));
    },
    [images, setImages]
  );

  // 미리보기 URL 생성/해제
  const previewUrls = useMemo(() => images.map((f) => URL.createObjectURL(f)), [images]);
  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previewUrls]);

  const clearImages = useCallback(() => setImages([]), [setImages]);

  return { images, onPaste, removeAt, previewUrls, clearImages };
};
