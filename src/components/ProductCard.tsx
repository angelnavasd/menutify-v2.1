import { memo } from 'react';
import { PencilSquareIcon, EyeIcon, EyeSlashIcon, TrashIcon, Bars3Icon, PhotoIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { Product } from './types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProductCardProps {
  product: Product;
  isEditMode?: boolean;
  onEdit?: (product: Product) => void;
  onToggleVisibility?: () => void;
  onDelete?: () => void;
}

const ProductCard = memo(({ 
  product, 
  isEditMode = false,
  onEdit,
  onToggleVisibility,
  onDelete
}: ProductCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: '1px solid black',
    padding: '10px',
    margin: '10px 0'
  };

  return (
    <article 
      ref={setNodeRef}
      style={style}
    >
      {/* Cabecera de la tarjeta con imagen y controles de edición */}
      <header style={{ border: '1px dashed gray', padding: '5px', marginBottom: '5px' }}>
        <div>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ maxWidth: '100px' }} />
          ) : (
            <div><PhotoIcon style={{ width: '100px', height: '100px' }} /></div>
          )}
        </div>
      </header>

      {/* Contenido principal de la tarjeta */}
      <main style={{ border: '1px dashed gray', padding: '5px' }}>
        {/* Información básica */}
        <div style={{ marginBottom: '5px' }}>
          <h3 style={{ margin: '0' }}>{product.name}</h3>
          <p style={{ margin: '5px 0' }}>{product.description}</p>
        </div>

        {/* Precio y destacado */}
        <div style={{ marginBottom: '5px' }}>
          <span>${product.price.toLocaleString('es-AR')}</span>
          {product.featured && <StarIcon style={{ width: '20px', height: '20px', marginLeft: '5px' }} />}
        </div>

        {/* Controles del producto */}
        <div>
          <button onClick={() => onEdit?.(product)} title="Editar" style={{ marginRight: '5px' }}>
            <PencilSquareIcon style={{ width: '20px', height: '20px' }} />
          </button>
          <button onClick={onToggleVisibility} title={product.visible ? "Ocultar" : "Mostrar"} style={{ marginRight: '5px' }}>
            {product.visible ? <EyeIcon style={{ width: '20px', height: '20px' }} /> : <EyeSlashIcon style={{ width: '20px', height: '20px' }} />}
          </button>
          <button onClick={onDelete} title="Eliminar" style={{ marginRight: '5px' }}>
            <TrashIcon style={{ width: '20px', height: '20px' }} />
          </button>
          <button {...attributes} {...listeners} title="Arrastrar" style={{ cursor: 'grab' }}>
            <Bars3Icon style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </main>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
