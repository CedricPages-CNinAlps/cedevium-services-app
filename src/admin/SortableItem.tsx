import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
  id: string;
  /** Render prop — reçoit le nœud "poignée de drag" à placer où tu veux */
  children: (dragHandle: React.ReactNode) => React.ReactNode;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative',
  };

  const dragHandle = (
    <button
      type="button"
      {...attributes}
      {...listeners}
      className="flex items-center justify-center w-7 h-7 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors rounded"
      title="Glisser pour réordonner"
    >
      <GripVertical size={16} />
    </button>
  );

  return (
    <div ref={setNodeRef} style={style}>
      {children(dragHandle)}
    </div>
  );
};
