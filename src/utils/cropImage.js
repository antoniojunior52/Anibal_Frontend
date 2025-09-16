// src/utils/cropImage.js

/**
 * @param {File} image - Ficheiro de imagem original
 * @param {Object} crop - Objeto com as dimensões do recorte (em pixels)
 */
export function getCroppedImg(imageFile, crop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          blob.name = imageFile.name;
          resolve(new File([blob], imageFile.name, { type: imageFile.type }));
        },
        imageFile.type,
        1
      );
    };
    image.onerror = (error) => reject(error);
  });
}