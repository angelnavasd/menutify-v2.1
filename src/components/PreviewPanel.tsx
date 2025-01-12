// src/components/PreviewPanel.tsx

const PreviewPanel = () => {
    return (
      <div className="w-full h-full p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Vista previa del menú</h2>
  
        {/* Contenido de la vista previa */}
        <div className="text-gray-600">
          <p>Aquí verás cómo queda tu menú en tiempo real.</p>
        </div>
      </div>
    );
  };
  
  export default PreviewPanel;
  