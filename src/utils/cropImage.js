/**
 * Função utilitária para cortar imagens no navegador usando Canvas
 * @param {File} imageFile - O arquivo de imagem original
 * @param {Object} crop - Coordenadas do corte { x, y, width, height }
 * @returns {Promise} - Retorna um novo arquivo (File) com a imagem cortada
 */
export function getCroppedImg(imageFile, crop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(imageFile); // Cria URL temporária para carregar a imagem
    
    image.onload = () => {
      // Cria um canvas para desenhar a imagem cortada
      const canvas = document.createElement('canvas');
      
      // Calcula a escala caso a imagem exibida na tela tenha tamanho diferente da original
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      // Desenha a parte selecionada da imagem original no canvas
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

      // Converte o canvas de volta para um arquivo (Blob -> File)
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
        1 // Qualidade máxima
      );
    };
    image.onerror = (error) => reject(error);
  });
}