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
  isEditMode?: boolean;  // ✅ Opcional, porque productos siempre tendrán drag & drop
}

const DragAndDropWrapper = ({ items, onDragEnd, children, isEditMode }: DragAndDropWrapperProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ✅ Verificamos los IDs de los ítems
  const itemIds = items.map(item => item.id);

  // ✅ Detectar si los ítems son productos o categorías
  const isCategoryList = items[0] && 'products' in items[0];  // Si tiene 'products', es categoría

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={
        isCategoryList
          ? (isEditMode ? onDragEnd : () => {})  // ✅ Drag solo si está en modo edición
          : onDragEnd  // ✅ Drag siempre activo para productos
      }
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

export default DragAndDropWrapper;
