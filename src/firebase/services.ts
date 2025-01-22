import { db } from './config';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { Category } from '../components/types';

const CATEGORIES_COLLECTION = 'categories';
const CONFIG_COLLECTION = 'config';
const THEME_DOC_ID = 'theme';

// Exportar la colección y funciones necesarias
export const categoriesCollection = collection(db, CATEGORIES_COLLECTION);
export { getDocs, deleteDoc };

// Obtener todas las categorías
export const getCategories = async (): Promise<Category[]> => {
  try {
    const snapshot = await getDocs(categoriesCollection);
    const categories = snapshot.docs
      .map(doc => {
        const data = doc.data();
        // Asegurar que el ID del documento se use como ID de la categoría
        return { 
          id: doc.id, 
          name: data.name || '',
          products: Array.isArray(data.products) ? data.products : [],
          order: typeof data.order === 'number' ? data.order : 0
        } as Category;
      })
      .filter(category => category.name); // Solo retornar categorías con nombre válido

    return categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

// Agregar una nueva categoría
export const addCategory = async (category: Category): Promise<string> => {
  try {
    // Crear un objeto limpio para la nueva categoría
    const newCategoryData = {
      name: category.name.trim(),
      products: [],
      order: category.order || 0
    };

    // Crear el documento y obtener la referencia
    const docRef = await addDoc(categoriesCollection, newCategoryData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw new Error('No se pudo crear la categoría');
  }
};

// Actualizar una categoría
export const updateCategory = async (categoryId: string, category: Category) => {
  try {
    const categoryRef = doc(categoriesCollection, categoryId);
    const { id, ...categoryData } = category;
    await updateDoc(categoryRef, {
      ...categoryData,
      order: categoryData.order ?? 0
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('No se pudo actualizar la categoría');
  }
};

// Eliminar una categoría
export const deleteCategory = async (categoryId: string): Promise<void> => {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  await deleteDoc(docRef);
};

// Obtener configuración del tema
export const getThemeConfig = async () => {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, THEME_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().isDarkMode;
    }
    
    // Si no existe, crear con valor por defecto
    await setDoc(docRef, { isDarkMode: false });
    return false;
  } catch (error) {
    console.error('Error getting theme config:', error);
    return false;
  }
};

// Actualizar configuración del tema
export const updateThemeConfig = async (isDarkMode: boolean) => {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, THEME_DOC_ID);
    await setDoc(docRef, { isDarkMode });
    return true;
  } catch (error) {
    console.error('Error updating theme config:', error);
    throw error;
  }
};

// Función para eliminar todas las categorías de forma forzada
export const forceDeleteAllCategories = async (): Promise<void> => {
  try {
    const snapshot = await getDocs(categoriesCollection);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error force deleting all categories:', error);
    throw new Error('No se pudieron eliminar las categorías');
  }
}; 