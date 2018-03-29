export const COPY_CANVAS = document.createElement('canvas');

export function copyCanvas(canvas) {
  const { width, height } = canvas;
  COPY_CANVAS.width = width;
  COPY_CANVAS.height = height;
  const imgData = canvas.getContext('2d').getImageData(0, 0, width, height);

  // Make black pix transparent
  const pixels = imgData.data;
  const nbPix = width * height * 4;
  for (let i = 0; i < nbPix; i += 4) {
    if (pixels[i] === 0 && pixels[i + 1] === 0 && pixels[i + 2] === 0) {
      pixels[i + 3] = 0;
    }
  }

  const ctx = COPY_CANVAS.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.putImageData(imgData, 0, 0);
}
