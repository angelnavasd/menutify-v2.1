import { ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { Category, Product } from './types';

type DraggableItem = Category | Product;

interface DragAndDropWrapperProps {
  items: DraggableItem[];
  onDragEnd: (event: DragEndEvent) => void;
  children: ReactNode;
  isEditMode?: boolean;
}

const DragAndDropWrapper = ({ items, onDragEnd, children, isEditMode }: DragAndDropWrapperProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={isEditMode ? onDragEnd : undefined}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext 
        items={items.map(item => item.id)} 
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};

export default DragAndDropWrapper;
