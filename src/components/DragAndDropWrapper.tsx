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
import { Category, Product, DragAndDropWrapperProps } from './types';
import { motion } from 'framer-motion';

type DraggableItem = Category | Product;

const DragAndDropWrapper = ({ 
  items, 
  onDragEnd, 
  children, 
  isEditMode,
  dragVariants 
}: DragAndDropWrapperProps) => {
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
        <motion.div
          variants={dragVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
};

export default DragAndDropWrapper;
