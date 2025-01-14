import { ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement
} from '@dnd-kit/modifiers';
import { Category, Product } from './types';

type DraggableItem = Category | Product;

interface DragAndDropWrapperProps {
  items: DraggableItem[];
  onDragEnd: (event: DragEndEvent) => void;
  children: ReactNode;
  isEditMode: boolean;
}

const DragAndDropWrapper = ({ items, onDragEnd, children, isEditMode }: DragAndDropWrapperProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ✅ Verificamos los IDs de los ítems
  const itemIds = items.map(item => item.id);

  return (
    <DndContext
      sensors={isEditMode ? sensors : undefined}
      collisionDetection={closestCenter}
      onDragEnd={isEditMode ? onDragEnd : () => {}}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

export default DragAndDropWrapper;
