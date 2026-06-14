import { useState, useCallback, useRef } from 'react';

interface UseDragAndDropOptions {
  onCorrect?: (targetId: string, optionId: string) => void;
  onIncorrect?: (targetId: string, optionId: string) => void;
  correctPairs: Map<string, string>;
}

export const useDragAndDrop = ({
  onCorrect,
  onIncorrect,
  correctPairs,
}: UseDragAndDropOptions) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<Map<string, string>>(new Map());
  const [shakeTarget, setShakeTarget] = useState<string | null>(null);
  const [correctTarget, setCorrectTarget] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragPosition = useRef({ x: 0, y: 0 });

  const handleDragStart = useCallback((e: React.DragEvent, optionId: string) => {
    setDraggedItem(optionId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', optionId);
    
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverTarget(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTarget !== targetId) {
      setDragOverTarget(targetId);
    }
  }, [dragOverTarget]);

  const handleDragLeave = useCallback((targetId: string) => {
    if (dragOverTarget === targetId) {
      setDragOverTarget(null);
    }
  }, [dragOverTarget]);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const optionId = e.dataTransfer.getData('text/plain');
    
    if (!optionId) return;

    const correctOptionId = correctPairs.get(targetId);
    
    if (correctOptionId === optionId) {
      setPlacedItems((prev) => {
        const newMap = new Map(prev);
        newMap.set(targetId, optionId);
        return newMap;
      });
      setCorrectTarget(targetId);
      setTimeout(() => setCorrectTarget(null), 600);
      onCorrect?.(targetId, optionId);
    } else {
      setShakeTarget(targetId);
      setTimeout(() => setShakeTarget(null), 500);
      onIncorrect?.(targetId, optionId);
    }

    setDraggedItem(null);
    setDragOverTarget(null);
  }, [correctPairs, onCorrect, onIncorrect]);

  const removePlacedItem = useCallback((targetId: string) => {
    setPlacedItems((prev) => {
      const newMap = new Map(prev);
      newMap.delete(targetId);
      return newMap;
    });
  }, []);

  const resetAll = useCallback(() => {
    setPlacedItems(new Map());
    setDraggedItem(null);
    setDragOverTarget(null);
    setShakeTarget(null);
    setCorrectTarget(null);
  }, []);

  const isOptionPlaced = useCallback((optionId: string) => {
    return Array.from(placedItems.values()).includes(optionId);
  }, [placedItems]);

  const isAllCorrect = useCallback(() => {
    if (placedItems.size !== correctPairs.size) return false;
    
    for (const [targetId, correctOptionId] of correctPairs) {
      if (placedItems.get(targetId) !== correctOptionId) {
        return false;
      }
    }
    return true;
  }, [placedItems, correctPairs]);

  return {
    draggedItem,
    dragOverTarget,
    placedItems,
    shakeTarget,
    correctTarget,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removePlacedItem,
    resetAll,
    isOptionPlaced,
    isAllCorrect,
    dragPosition,
  };
};
