// src/components/ui/MultiImageUpload.jsx
import React, { useState, useCallback } from 'react';
import { UploadCloud, X, AlertCircle } from 'lucide-react';

const Preview = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const reader = new FileReader();
  reader.onloadend = () => setPreviewUrl(reader.result);
  reader.readAsDataURL(file);

  return (
    <div className="relative group w-24 h-24 border rounded-md overflow-hidden">
      <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={() => onRemove(file.name)}
        className="absolute top-1 right-1 p-0.5 bg-black bg-opacity-40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// Adicionada a nova propriedade maxFiles com um valor padrão de 10
export default function MultiImageUpload({ label, onChange, maxSizeMB = 5, maxFiles = 10 }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFilesChange = useCallback((newFiles) => {
    let localError = '';
    
    // Verifica o limite total de ficheiros antes de processar
    if (files.length + newFiles.length > maxFiles) {
      localError = `Pode enviar no máximo ${maxFiles} imagens de cada vez.`;
      setError(localError);
      return; // Interrompe o processo se o limite for excedido
    }

    let validFiles = [...files];
    
    Array.from(newFiles).forEach(file => {
      if (file.size <= maxSizeMB * 1024 * 1024) {
        if (!validFiles.some(f => f.name === file.name)) {
          validFiles.push(file);
        }
      } else {
        localError = `O ficheiro ${file.name} excede o tamanho máximo de ${maxSizeMB}MB.`;
      }
    });
    
    setError(localError);
    setFiles(validFiles);
    onChange(validFiles);
  }, [files, maxSizeMB, maxFiles, onChange]);

  const handleRemove = (fileName) => {
    const updatedFiles = files.filter(f => f.name !== fileName);
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{files.length} / {maxFiles}</span>
      </div>
      <div onDrop={(e) => { e.preventDefault(); handleFilesChange(e.dataTransfer.files); setIsDragging(false); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} className={`relative block w-full border-2 border-dashed ${isDragging ? 'border-blue-500' : 'border-gray-300'} rounded-md p-4 text-center cursor-pointer`}>
        <input type="file" className="absolute inset-0 w-full h-full opacity-0" onChange={(e) => handleFilesChange(e.target.files)} multiple accept="image/*" disabled={files.length >= maxFiles} />
        <div className="flex flex-col items-center justify-center">
            <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-600"><span className="font-semibold text-blue-600">Clique para enviar</span> ou arraste</p>
            {files.length >= maxFiles && <p className="text-xs text-yellow-600">Limite de imagens atingido</p>}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600 flex items-center"><AlertCircle size={16} className="mr-1" />{error}</p>}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {files.map(file => <Preview key={file.name} file={file} onRemove={handleRemove} />)}
        </div>
      )}
    </div>
  );
}