import React, { useState, createContext, useContext } from 'react';
import { GripVertical } from 'lucide-react';

export interface DragEndEvent {
  active: { id: string };
  over: { id: string } | null;
}

export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const result = [...array];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

interface DragCtxValue {
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

const DragCtx = createContext<DragCtxValue | null>(null);

export const DragSortContext: React.FC<{
  onDragEnd: (event: DragEndEvent) => void;
  children: React.ReactNode;
}> = ({ onDragEnd, children }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  return (
    <DragCtx.Provider value={{ draggingId, setDraggingId, onDragEnd }}>
      {children}
    </DragCtx.Provider>
  );
};

interface SortableItemProps {
  id: string;
  children: (dragHandle: React.ReactNode) => React.ReactNode;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const ctx = useContext(DragCtx)!;

  const dragHandle = (
    <button
      type="button"
      className="flex items-center justify-center w-7 h-7 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors rounded"
      title="Glisser pour réordonner"
    >
      <GripVertical size={16} />
    </button>
  );

  return (
    <div
      draggable
      onDragStart={() => ctx.setDraggingId(id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => {
        if (ctx.draggingId && ctx.draggingId !== id) {
          ctx.onDragEnd({ active: { id: ctx.draggingId }, over: { id } });
        }
        ctx.setDraggingId(null);
      }}
      onDragEnd={() => ctx.setDraggingId(null)}
      style={{ opacity: ctx.draggingId === id ? 0.4 : 1, position: 'relative' }}
    >
      {children(dragHandle)}
    </div>
  );
};
