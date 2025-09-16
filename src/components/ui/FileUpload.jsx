// src/components/ui/FileUpload.jsx
import React, { useState, useCallback } from 'react';
import { UploadCloud, X, AlertCircle, File as FileIcon } from 'lucide-react';

export default function FileUpload({ label, onChange, maxSizeMB = 10, allowedTypes, fileTypeName }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (fileToValidate) => {
    if (fileToValidate.size > maxSizeMB * 1024 * 1024) {
      setError(`O ficheiro excede o tamanho máximo de ${maxSizeMB}MB.`);
      return false;
    }
    if (allowedTypes && !allowedTypes.includes(fileToValidate.type)) {
      setError(`Tipo de ficheiro inválido. Apenas ${fileTypeName} são permitidos.`);
      return false;
    }
    setError('');
    return true;
  };
  
  const handleFileChange = useCallback((selectedFile) => {
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      onChange(selectedFile);
    } else {
      setFile(null);
      onChange(null);
    }
  }, [maxSizeMB, allowedTypes, fileTypeName, onChange]);

  const removeFile = () => {
    setFile(null);
    onChange(null);
    setError('');
  };
  
  return (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {file ? (
            <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                <div className="flex items-center gap-3">
                    <FileIcon className="h-6 w-6 text-gray-500" />
                    <span className="text-sm font-medium text-gray-800">{file.name}</span>
                </div>
                <button type="button" onClick={removeFile}><X size={18} className="text-gray-600" /></button>
            </div>
        ) : (
            <>
            <div onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files[0]); setIsDragging(false); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} className={`relative block w-full border-2 border-dashed ${isDragging ? 'border-blue-500' : 'border-gray-300'} rounded-md p-4 text-center cursor-pointer`}>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0" onChange={(e) => handleFileChange(e.target.files[0])} accept={allowedTypes?.join(',')} />
                <div className="flex flex-col items-center justify-center h-24">
                    <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600"><span className="font-semibold text-blue-600">Clique para enviar</span> ou arraste o ficheiro</p>
                </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-600 flex items-center"><AlertCircle size={16} className="mr-1" />{error}</p>}
            </>
        )}
    </div>
  );
}