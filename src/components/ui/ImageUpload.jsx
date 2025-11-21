import React, { useState, useCallback, useEffect } from 'react';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

// Componente para upload de uma ÚNICA imagem (com suporte a mostrar imagem já existente)
export default function ImageUpload({
  label,
  onChange,
  existingImageUrl, // URL de uma imagem que já existe (ex: ao editar perfil)
  isLoading,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
}) {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  // Se receber uma URL existente, define ela como preview inicial
  useEffect(() => {
    if (existingImageUrl) {
      setPreview(existingImageUrl);
    } else {
      // Garante que a preview é limpa quando o formulário é reiniciado
      setPreview(null);
    }
  }, [existingImageUrl]);
  
  // Valida tamanho e tipo do arquivo
  const validateFile = (file) => {
    if (!file) return false;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`O ficheiro excede o tamanho máximo de ${maxSizeMB}MB.`);
      return false;
    }
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de ficheiro inválido. Apenas JPG, PNG, GIF são permitidos.');
      return false;
    }
    setError('');
    return true;
  };

  // Processa o arquivo selecionado e gera o preview
  const handleFileChange = useCallback((file) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else {
      onChange(null);
    }
  }, [maxSizeMB, allowedTypes, onChange]);

  // Lida com o evento de "soltar" o arquivo na área (Drop)
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  // Limpa a imagem selecionada
  const removeImage = () => {
    setPreview(null);
    onChange(null);
    setError('');
    // Limpa o input file HTML para permitir selecionar o mesmo arquivo novamente se necessário
    const fileInput = document.querySelector('input[type="file"]');
    if(fileInput) fileInput.value = "";
  };
  
  const borderStyle = isDragging ? 'border-blue-500' : 'border-gray-300';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      
      {/* Se tem imagem (preview), mostra a imagem. Se não, mostra a área de upload */}
      {preview ? (
        <div className="relative group w-full max-w-xs mx-auto aspect-square">
          <img src={preview} alt="Pré-visualização" className="w-full h-full object-cover rounded-md" />
          {isLoading && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"><LoadingSpinner message="A enviar..." /></div>}
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remover imagem"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          {/* Área de Upload */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
            className={`relative block w-full max-w-xs mx-auto aspect-square border-2 border-dashed ${borderStyle} rounded-md text-center flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors`}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
              accept={allowedTypes.join(',')}
            />
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">Clique para enviar</span> ou arraste
              </p>
              <p className="text-xs text-gray-500">Tamanho máx: {maxSizeMB}MB</p>
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-red-600 flex items-center"><AlertCircle size={16} className="mr-1" />{error}</p>}
        </>
      )}
    </div>
  );
}