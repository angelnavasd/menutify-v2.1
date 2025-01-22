import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODAL_CATEGORY_FORM_STYLES } from '../constants/layout';
import { MODAL_CATEGORY_FORM_VARIANTS } from '../constants/animations';

interface ModalCategoryFormProps {
  isOpen: boolean;
  onSubmit: (categoryName: string) => void;
  onClose: () => void;
  existingCategories: string[];
}

const ModalCategoryForm = ({ isOpen, onSubmit, onClose, existingCategories }: ModalCategoryFormProps) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError('El nombre de la categoría no puede estar vacío.');
      return;
    }

    if (existingCategories.some((name) => name.toLowerCase() === categoryName.toLowerCase())) {
      setError('Ya existe una categoría con ese nombre.');
      return;
    }

    if (categoryName.length > 30) {
      setError('El nombre debe tener máximo 30 caracteres.');
      return;
    }

    onSubmit(categoryName.trim());
    setCategoryName('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={MODAL_CATEGORY_FORM_STYLES.container.wrapper}>
          <motion.div
            className={MODAL_CATEGORY_FORM_STYLES.container.content}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={MODAL_CATEGORY_FORM_VARIANTS.container}
          >
            <form onSubmit={handleSubmit} className={MODAL_CATEGORY_FORM_STYLES.form.wrapper}>
              <div className={MODAL_CATEGORY_FORM_STYLES.form.input.container}>
                <label htmlFor="categoryName" className={MODAL_CATEGORY_FORM_STYLES.form.input.label}>
                  Nombre de la categoría
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    setError(''); // Limpiar error al escribir
                  }}
                  placeholder="Ej: Entradas, Platos principales..."
                  className={MODAL_CATEGORY_FORM_STYLES.form.input.field}
                  autoFocus
                />
              </div>
              
              {error && (
                <p className={MODAL_CATEGORY_FORM_STYLES.form.error}>{error}</p>
              )}

              <div className={MODAL_CATEGORY_FORM_STYLES.form.buttons.container}>
                <button
                  type="submit"
                  className={MODAL_CATEGORY_FORM_STYLES.form.buttons.create}
                >
                  Crear categoría
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={MODAL_CATEGORY_FORM_STYLES.form.buttons.cancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalCategoryForm;
