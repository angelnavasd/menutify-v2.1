import ProductCard from './ProductCard';
import { ProductListProps } from './types';  // ✅ Importar desde types.ts

const ProductList = ({ products, onEditProduct, onToggleVisibility, onDeleteProduct }: ProductListProps) => {
  return (
    <div className="space-y-2 mt-2">
      {products.length === 0 ? (
        <p className="text-gray-500 text-sm">Aún no hay productos en esta categoría.</p>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onEdit={() => onEditProduct(product.id)}
            onToggleVisibility={() => onToggleVisibility(product.id)}
            onDelete={() => onDeleteProduct(product.id)}
          />
        ))
      )}
    </div>
  );
};

export default ProductList;
