import { ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { motion, Variants } from 'framer-motion';
import { DRAG_AND_DROP_STYLES } from '../constants/layout';

interface DraggableItem {
  id: string;
  [key: string]: any;
}

interface DragAndDropWrapperProps<T extends DraggableItem> {
  items: T[];
  onDragEnd: (event: DragEndEvent) => void;
  children: ReactNode;
  isEditMode: boolean;
  dragVariants?: Variants;
}

const DragAndDropWrapper = <T extends DraggableItem>({ 
  items, 
  onDragEnd, 
  children, 
  isEditMode,
  dragVariants 
}: DragAndDropWrapperProps<T>) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DRAG_AND_DROP_STYLES.sensors.pointer.activationDistance,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
        distance: 8
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
          className={DRAG_AND_DROP_STYLES.container.base}
        >
          {children}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
};

export default DragAndDropWrapper;
