const keyPrefix = 'walkthrough-companion:game-cover:';

export const loadGameCover = (gameId: string) => {
  try {
    return localStorage.getItem(`${keyPrefix}${gameId}`) ?? undefined;
  } catch {
    return undefined;
  }
};

export const saveGameCover = (gameId: string, image: string) => {
  localStorage.setItem(`${keyPrefix}${gameId}`, image);
};

export const removeGameCover = (gameId: string) => {
  localStorage.removeItem(`${keyPrefix}${gameId}`);
};

export const prepareGameCover = (file: File): Promise<string> => new Promise((resolve, reject) => {
  if (!file.type.startsWith('image/')) {
    reject(new Error('Please choose an image file.'));
    return;
  }

  const source = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    URL.revokeObjectURL(source);
    const scale = Math.min(1600 / image.naturalWidth, 900 / image.naturalHeight, 1);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');

    if (!context) {
      reject(new Error('The image could not be processed in this browser.'));
      return;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    resolve(canvas.toDataURL('image/webp', 0.85));
  };
  image.onerror = () => {
    URL.revokeObjectURL(source);
    reject(new Error('The selected image could not be read.'));
  };
  image.src = source;
});
