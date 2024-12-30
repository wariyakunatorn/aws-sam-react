
import { useState, useCallback } from 'react';

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);
  
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  return { isOpen, onOpen, onClose };
}