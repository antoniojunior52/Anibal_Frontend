// components/ui/CustomFileInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FileSpreadsheet, FileText, Image, UploadCloud, CalendarDays } from 'lucide-react';

const CustomFileInput = ({ label, onChange, accept, fileName, id, required = false }) => {
  const [selectedFileName, setSelectedFileName] = useState(fileName);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const isDateInput = accept === 'date';
  const isImageInput = accept && accept.includes('image/');

  useEffect(() => {
    setSelectedFileName(fileName);
    if (!fileName && !isDateInput && !isImageInput) {
      setImagePreview(null);
    } else if (isImageInput && fileName) {
      // Se for imagem e já tiver um fileName (URL), tenta exibir
      setImagePreview(fileName);
    }
  }, [fileName, isDateInput, isImageInput]);

  const processFile = (file) => {
    if (file) {
      setSelectedFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
      return file;
    } else {
      setSelectedFileName('');
      setImagePreview(null);
      return null;
    }
  };

  const handleFileChange = (e) => {
    if (isDateInput) {
      onChange(e);
      setSelectedFileName(e.target.value);
    } else {
      const file = processFile(e.target.files[0]);
      const dataTransfer = new DataTransfer();
      if (file) {
        dataTransfer.items.add(file);
      }
      onChange({
        target: {
          files: dataTransfer.files,
          value: file ? file.name : '',
        },
      });
    }
  };

  const getFileIconAndColor = () => {
    let iconComponent = <UploadCloud className="h-12 w-12" aria-hidden="true" />;
    let textColorClass = 'text-gray-500';
    let defaultMessage = `Clique ou arraste um ${label.toLowerCase().replace('arquivo de ', '')} aqui`;

    if (isDateInput) {
      iconComponent = <CalendarDays className="h-12 w-12 text-blue-500" aria-hidden="true" />;
      textColorClass = 'text-blue-500';
      defaultMessage = "Selecione uma data";
    } else {
      const determineType = (filename, acceptedTypes) => {
        if (filename) {
          const ext = filename.split('.').pop().toLowerCase();
          if (['xls', 'xlsx'].includes(ext)) return 'excel';
          if (ext === 'pdf') return 'pdf';
          if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'image';
        } else if (acceptedTypes) {
          if (acceptedTypes.includes('image/')) return 'image';
          if (acceptedTypes.includes('.pdf')) return 'pdf';
          if (acceptedTypes.includes('.xlsx') || acceptedTypes.includes('.xls')) return 'excel';
        }
        return 'default';
      };

      const type = determineType(selectedFileName, accept);

      switch (type) {
        case 'excel':
          iconComponent = <FileSpreadsheet className="h-12 w-12 text-green-500" aria-hidden="true" />;
          textColorClass = 'text-green-500';
          defaultMessage = "Clique ou arraste um Excel aqui";
          break;
        case 'pdf':
          iconComponent = <FileText className="h-12 w-12 text-red-500" aria-hidden="true" />;
          textColorClass = 'text-red-500';
          defaultMessage = "Clique ou arraste um PDF aqui";
          break;
        case 'image':
          iconComponent = <Image className="h-12 w-12 text-purple-500" aria-hidden="true" />;
          textColorClass = 'text-purple-500';
          defaultMessage = "Clique ou arraste uma imagem aqui";
          break;
        default:
          iconComponent = <UploadCloud className="h-12 w-12 text-blue-500" aria-hidden="true" />;
          textColorClass = 'text-blue-500';
          defaultMessage = `Clique ou arraste um ${label.toLowerCase().replace('arquivo de ', '')} aqui`;
          break;
      }
    }
    return { icon: iconComponent, color: textColorClass, message: defaultMessage };
  };

  const onDragOver = (e) => {
    if (!isDateInput) {
      e.preventDefault();
      setIsDragging(true);
    }
  };

  const onDragLeave = (e) => {
    if (!isDateInput) {
      e.preventDefault();
      setIsDragging(false);
    }
  };

  const onDrop = (e) => {
    if (!isDateInput) {
      e.preventDefault();
      setIsDragging(false);
      const file = processFile(e.dataTransfer.files[0]);
      const dataTransfer = new DataTransfer();
      if (file) {
        dataTransfer.items.add(file);
      }
      onChange({
        target: {
          files: dataTransfer.files,
          value: file ? file.name : '',
        },
      });
    }
  };

  const { icon, color, message } = getFileIconAndColor();

  const getDropzoneStyles = () => {
    let borderColorClass = 'border-blue-500';
    let bgColorClass = 'bg-blue-50';
    let dragoverBgColorClass = 'bg-blue-100';

    if (isDateInput) {
      borderColorClass = 'border-blue-500';
      bgColorClass = 'bg-white'; // Fundo branco para input de data
      dragoverBgColorClass = 'bg-blue-100';
    } else {
      const determineType = (acceptedTypes) => {
        if (acceptedTypes && acceptedTypes.includes('image/')) return 'image';
        if (acceptedTypes && acceptedTypes.includes('.pdf')) return 'pdf';
        if (acceptedTypes && (acceptedTypes.includes('.xlsx') || acceptedTypes.includes('.xls'))) return 'excel';
        return 'default';
      };

      const type = determineType(accept);

      switch (type) {
        case 'excel':
          borderColorClass = 'border-green-500';
          bgColorClass = 'bg-green-50';
          dragoverBgColorClass = 'bg-green-100';
          break;
        case 'pdf':
          borderColorClass = 'border-red-500';
          bgColorClass = 'bg-red-50';
          dragoverBgColorClass = 'bg-red-100';
          break;
        case 'image':
          borderColorClass = 'border-purple-500';
          bgColorClass = 'bg-purple-50';
          dragoverBgColorClass = 'bg-purple-100';
          break;
        default:
          borderColorClass = 'border-blue-500';
          bgColorClass = 'bg-blue-50';
          dragoverBgColorClass = 'bg-blue-100';
          break;
      }
    }
    return { borderColorClass, bgColorClass, dragoverBgColorClass };
  };

  const { borderColorClass, bgColorClass, dragoverBgColorClass } = getDropzoneStyles();

  if (isDateInput) {
    // Renderiza um input de data com estilo de FloatingLabelInput
    return (
      <div className="relative w-full">
        <input
          type="date"
          id={id}
          value={selectedFileName} // selectedFileName armazena a data string
          onChange={handleFileChange}
          required={required}
          className={`block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-full shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent
                     peer transition-all duration-200 ease-in-out h-[42px]`} /* Altura fixa para consistência */
          aria-label={label}
        />
        <label
          htmlFor={id}
          className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text
                     ${selectedFileName ? 'top-[-10px] text-xs text-[#4455a3] bg-white px-1' : 'top-2 text-base'}
                     peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#4455a3] peer-focus:bg-white peer-focus:px-1
                     peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500`}
          aria-hidden="true"
        >
          {label}
        </label>
      </div>
    );
  }

  // Renderiza o input de arquivo como antes (dropzone)
  return (
    <div className={`container w-full max-w-sm mx-auto flex flex-col items-center justify-between p-2 rounded-lg shadow-md ${bgColorClass}`}>
      <div
        className={`dropzone flex-1 w-full border-2 border-dashed ${borderColorClass} rounded-lg flex flex-col items-center justify-center p-4 min-h-[150px] cursor-pointer transition-all duration-300 ease-in-out ${isDragging ? dragoverBgColorClass : ''}`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button"
        tabIndex="0"
        aria-label={label}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          aria-label={label}
          required={required}
        />
        
        {imagePreview ? (
          <img src={imagePreview} alt="Pré-visualização" className="max-w-full h-auto max-h-[120px] object-contain rounded-md shadow-sm" />
        ) : (
          icon
        )}
        <p className={`mt-2 text-center ${color}`}>
          {selectedFileName || message}
        </p>
      </div>
    </div>
  );
};

export default CustomFileInput;
