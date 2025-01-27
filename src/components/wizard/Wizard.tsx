import React, { useEffect, useState } from 'react';
import { setBussinessData } from '@/services/userService';
import { Loader2 } from 'lucide-react';

interface WizardProps {
  isNewUser: boolean;
  onClose: (newUserStatus: boolean) => void; 
  currentUser: any;
}

interface FormData {
  logo: string;
  title: string;
  address: string;
  description: string;
  hours: string;
  tags: string;
  phone: string;
  checkboxItems: string[];
}

const Wizard: React.FC<WizardProps> = ({ isNewUser: initialIsNewUser, onClose, currentUser }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(initialIsNewUser);
  const [firstStep, setFirstStep] = useState<boolean>(true);
  const [finishStep, setFinishStep  ] = useState<boolean>(false);
  const [finishWizard, setFinishWizard] = useState<boolean>(false);

  // Función para manejar el cierre del wizard
  const handleClose = () => {
    // Notifica al padre el nuevo estado de isNewUser
    onClose(isNewUser);
  };

  // Función para cambiar el estado de isNewUser
  const toggleUserStatus = () => {
    setIsNewUser((prev) => !prev);
  };

  const [formData, setFormData] = useState<FormData>({
    logo: '',
    title: '',
    address: '',
    description: '',
    hours: '',
    tags: '',
    phone: '',
    checkboxItems: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => {
      const checkboxItems = prev.checkboxItems.includes(value)
        ? prev.checkboxItems.filter(item => item !== value)
        : [...prev.checkboxItems, value];
      return { ...prev, checkboxItems };
    });
  };

  const handleSubmitData = async (e: React.MouseEvent<HTMLButtonElement>, userUid: string) => {
    e.preventDefault();
    if(userUid){
        setLoading(true)
        console.log('cargando datos', formData);
        //aca mandar la data a la base y esperar retorno para mostrar boton finish
        //que queden en loading
        const result = await setBussinessData(formData, userUid)

        if(result){
            toggleUserStatus()
            setFinishStep(false)
            setFinishWizard(true)
        } else {
            throw new Error('error')
        }
    } else {
        throw new Error('error')
    }
    
  };

  return (
    <div className="wizard-container p-4 bg-white shadow-lg rounded-lg">
      {isNewUser === null ? (
        <p>Loading...</p>
      ) : isNewUser && (
        <div className=''>
          <h1 className="text-2xl font-bold mb-4">Welcome to Menutify!</h1>
          <p className="mb-4">Comenzemos cargando los datos del restaurante</p>

          <div className="grid space-y-4">
            {firstStep && (<>
                <input type="text" name="logo" placeholder="Logo URL" value={formData.logo} onChange={handleInputChange} className="input" />

                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} className="input" />

                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} className="input" />

                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="input" />

                <button className='py-2 px-2 bg-blue-500 text-white rounded-md' onClick={() => {setFinishStep(true); setFirstStep(false)}} >next</button>
            </>)}
            
            {finishStep && (<>
                <input type="text" name="hours" placeholder="Hours" value={formData.hours} onChange={handleInputChange} className="input" />
                <input type="text" name="tags" placeholder="Tags" value={formData.tags} onChange={handleInputChange} className="input" />
                <input type="text" name="phone" placeholder="Local Phone Number" value={formData.phone} onChange={handleInputChange} className="input" />
                <div className='grid grid-cols-3 justify-center items-center gap-3'>
                <label><input type="checkbox" value="pedidos-ya" onChange={handleCheckboxChange} /> Item 1</label>
                <label><input type="checkbox" value="rappi" onChange={handleCheckboxChange} /> Item 2</label>
                <label><input type="checkbox" value="uber-eats" onChange={handleCheckboxChange} /> Item 3</label>
                </div>
                <div className='flex justify-evenly items-center'>
                    <button type="button" className="btn py-2 px-4  bg-blue-500 text-white rounded-md" onClick={() => {setFirstStep(true); setFinishStep(false)}}>Back</button>
                    <button type="button" className="btn py-2 px-4 bg-blue-500 text-white rounded-md" onClick={(e) => handleSubmitData(e, currentUser)}>
                        Enviar datos {loading && <Loader2 className='w-4 h-4'/>}
                    </button>
                </div>
            </>)}
            
          </div>
          {finishWizard && (
            <div>
                <button
                    onClick={handleClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Finish Onboarding
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wizard;