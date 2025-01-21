import { useState, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { XMarkIcon, PhotoIcon, CurrencyDollarIcon, InformationCircleIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Product } from '../types';

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product, categoryId: string) => Promise<void>;
  categories: Category[];
  productToEdit: Product | null;
  onSuccess?: (categoryId: string) => void;
}

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
`;

const InfoTooltip = ({ content }: { content: string }) => (
  <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root defaultOpen={false}>
      <Tooltip.Trigger asChild>
        <button className="ml-1 text-gray-400 hover:text-gray-500 focus:outline-none">
          <InformationCircleIcon className="h-3.5 w-3.5" />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="px-2 py-1 text-xs text-white bg-gray-900/90 rounded-md shadow-lg max-w-xs animate-fadeIn z-[100]"
          sideOffset={2}
          side="top"
          align="center"
        >
          {content}
          <Tooltip.Arrow className="fill-gray-900/90" width={8} height={4} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

const ProductFormHeader = ({ isEditing, onClose }: { isEditing: boolean; onClose: () => void }) => {
  return (
    <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditing ? 'Editar platillo' : 'Crear nuevo platillo'}
        </h2>
        <p className="text-xs text-gray-500">
          {isEditing ? 'Edita los detalles del platillo.' : 'Agrega un nuevo platillo a tu menú.'}
        </p>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-1">{title}</h3>
    {children}
  </div>
);

const TitleField = ({ title, setTitle }: { title: string; setTitle: (value: string) => void }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700">
          Título del plato
        </label>
        <InfoTooltip content="El nombre que verán tus clientes en el menú" />
      </div>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Ejemplo: Pizza Muzzarella" 
        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        required 
      />
    </div>
  );
};

const DescriptionField = ({ description, setDescription }: { description: string; setDescription: (value: string) => void }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <InfoTooltip content="Describe los ingredientes principales y características especiales del platillo" />
      </div>
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Descripción del platillo" 
        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none h-20" 
        required 
      />
    </div>
  );
};

const CategoryField = ({ 
  categoryId, 
  setCategoryId, 
  categories 
}: { 
  categoryId: string; 
  setCategoryId: (value: string) => void; 
  categories: Category[]; 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <InfoTooltip content="Selecciona la sección del menú donde aparecerá tu producto" />
      </div>
      <select 
        value={categoryId} 
        onChange={(e) => setCategoryId(e.target.value)} 
        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
      >
        <option value="">Selecciona una categoría</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const ImageUploadField = ({ 
  imagePreview, 
  setImagePreview 
}: { 
  imagePreview: string | null; 
  setImagePreview: (preview: string | null) => void; 
}) => {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700">
          Foto del platillo
        </label>
        <InfoTooltip content="Sube una imagen atractiva de tu platillo. Recomendamos usar fotos bien iluminadas y en formato cuadrado" />
      </div>
      <div className="flex gap-4 h-24">
        <div {...getRootProps()}
          className={`w-1/2 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
          <input {...getInputProps()} />
          <div className="text-center text-gray-500 text-sm p-2">
            <PhotoIcon className="h-6 w-6 mx-auto mb-1" />
            <span className="block">{isDragActive ? 'Suelta la imagen' : 'Arrastra o selecciona'}</span>
          </div>
        </div>

        <AnimatePresence>
          {imagePreview && (
            <motion.div 
              className="w-1/2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <img src={imagePreview} alt="Vista previa" className="w-full h-24 object-cover rounded-lg" />
              <button 
                onClick={() => { setImagePreview(null); }}
                type="button" 
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CurrencyPriceField = ({ 
  price, 
  setPrice, 
  currency, 
  setCurrency 
}: { 
  price: string; 
  setPrice: (value: string) => void; 
  currency: string; 
  setCurrency: (value: string) => void; 
}) => {
  const CURRENCIES = [
    { code: 'ARS', label: 'ARS', flag: '🇦🇷' },
    { code: 'USD', label: 'USD', flag: '🇺🇸' },
    { code: 'EUR', label: 'EUR', flag: '🇪🇺' }
  ];

  const formatPrice = (value: string) => {
    if (!value) return '';

    // Convertir a número y dividir por 100 para obtener los decimales
    const number = parseInt(value);
    const integerPart = Math.floor(number / 100);
    const decimalPart = (number % 100).toString().padStart(2, '0');

    // Si solo hay decimales, mostrar "0,XX"
    if (integerPart === 0) {
      return `0,${decimalPart}`;
    }

    // Formatear la parte entera con separadores de miles
    const formattedInteger = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedInteger},${decimalPart}`;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setPrice(rawValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700">Precio</label>
        <InfoTooltip content="Ingresa el precio sin puntos ni comas. Los últimos dos dígitos serán los centavos" />
      </div>
      <div className="flex items-center gap-2">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white w-28"
        >
          {CURRENCIES.map(({ code, label, flag }) => (
            <option key={code} value={code}>
              {flag} {label}
            </option>
          ))}
        </select>
        
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="numeric"
            value={formatPrice(price)}
            onChange={handlePriceChange}
            placeholder="0,00"
            className="w-full pl-3 pr-10 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right"
            required
          />
          <CurrencyDollarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

const ToggleFields = ({ 
  visible, 
  setVisible, 
  featured, 
  setFeatured 
}: { 
  visible: boolean; 
  setVisible: (value: boolean) => void; 
  featured: boolean; 
  setFeatured: (value: boolean) => void; 
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700">Visible en menú</label>
          <InfoTooltip content="Activa esta opción para que el platillo sea visible en el menú público" />
        </div>
        <Switch
          checked={visible}
          onChange={setVisible}
          className={`${
            visible ? 'bg-orange-400' : 'bg-gray-200'
          } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2`}
        >
          <span
            className={`${
              visible ? 'translate-x-5' : 'translate-x-0.5'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700">Destacado</label>
          <InfoTooltip content="Los platillos destacados aparecerán en la sección principal del menú" />
        </div>
        <Switch
          checked={featured}
          onChange={setFeatured}
          className={`${
            featured ? 'bg-orange-400' : 'bg-gray-200'
          } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2`}
        >
          <span
            className={`${
              featured ? 'translate-x-5' : 'translate-x-0.5'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </div>
  );
};

const SubmitButton = ({ 
  isLoading, 
  isSuccess, 
  isEditing
}: { 
  isLoading: boolean; 
  isSuccess: boolean;
  isEditing: boolean;
}) => {
  return (
    <button 
      type="submit"
      disabled={isLoading || isSuccess}
      className={`
        w-full py-3 rounded-lg transition-colors relative
        ${isSuccess 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-orange-400 hover:bg-orange-500'
        }
      `}
    >
      <div className="relative">
        {/* Estado de carga */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          isLoading ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Estado de éxito */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          isSuccess ? 'opacity-100' : 'opacity-0'
        }`}>
          <CheckIcon className="h-5 w-5 text-white" />
        </div>

        {/* Texto del botón */}
        <span className={`text-white font-medium transition-opacity duration-200 ${
          isLoading || isSuccess ? 'opacity-0' : 'opacity-100'
        }`}>
          {isEditing ? 'Guardar cambios' : 'Agregar nuevo platillo'}
        </span>
      </div>
    </button>
  );
};

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  productToEdit,
  onSuccess
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('ARS');
  const [visible, setVisible] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.name || '');
      setDescription(productToEdit.description || '');
      setPrice(((productToEdit.price || 0) * 100).toString());
      setCurrency(productToEdit.currency || 'ARS');
      setCategoryId(productToEdit.categoryId || '');
      setImagePreview(productToEdit.image || null);
      setVisible(productToEdit.visible ?? true);
      setFeatured(productToEdit.featured ?? false);
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setCurrency('ARS');
      setCategoryId('');
      setImagePreview(null);
      setVisible(true);
      setFeatured(false);
    }
    // Reiniciar estados del botón
    setIsSuccess(false);
    setIsLoading(false);
  }, [productToEdit, isOpen]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validación de campos obligatorios
    if (!title.trim()) {
      alert('Por favor, ingresa un título para el producto');
      return;
    }

    if (!description.trim()) {
      alert('Por favor, ingresa una descripción para el producto');
      return;
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      alert('Por favor, ingresa un precio válido');
      return;
    }

    if (!categoryId) {
      alert('Por favor, selecciona una categoría');
      return;
    }

    try {
      setIsLoading(true);
      setIsSuccess(false);

      const productData: Product = {
        id: productToEdit?.id || '',
        name: title.trim(),
        description: description.trim(),
        price: parseFloat(price) / 100,
        image: imagePreview || '',
        categoryId,
        visible: true,
        featured,
        currency,
        order: productToEdit?.order ?? 0
      };

      console.log('Enviando producto:', productData);
      await onSubmit(productData, categoryId);
      
      setIsSuccess(true);
      console.log('Producto guardado exitosamente');

      // Esperar a que se complete la animación de éxito y la animación de salida
      if (onSuccess) {
        onSuccess(categoryId);
      }
      
      // Retrasar el cierre para que se vea la animación de éxito
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al guardar el producto. Por favor, intenta de nuevo.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          onClick={(e) => {
            if (!isLoading && !isSuccess) {
              e.stopPropagation();
              onClose();
            }
          }} 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-gray-50 shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleFormSubmit} className="h-full flex flex-col">
              <ProductFormHeader 
                isEditing={!!productToEdit} 
                onClose={() => {
                  if (!isLoading && !isSuccess) {
                    onClose();
                  }
                }}
              />

              <div className="flex-1 p-5 space-y-6 overflow-y-auto">
                <div className="space-y-4">
                  <TitleField title={title} setTitle={setTitle} />
                  <CategoryField
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    categories={categories}
                  />
                </div>

                <ImageUploadField
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />

                <DescriptionField 
                  description={description} 
                  setDescription={setDescription} 
                />

                <CurrencyPriceField
                  price={price}
                  setPrice={setPrice}
                  currency={currency}
                  setCurrency={setCurrency}
                />

                <FormSection title="Configuración">
                  <ToggleFields
                    visible={visible}
                    setVisible={setVisible}
                    featured={featured}
                    setFeatured={setFeatured}
                  />
                </FormSection>
              </div>

              <div 
                className="sticky bottom-0 px-5 py-3 border-t border-gray-200 bg-white"
              >
                <SubmitButton 
                  isLoading={isLoading}
                  isSuccess={isSuccess}
                  isEditing={!!productToEdit}
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductForm; 