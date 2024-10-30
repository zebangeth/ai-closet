import RNFetchBlob from 'react-native-blob-util';
import ImageResizer from 'react-native-image-resizer';
import { Image } from 'react-native';

export const downloadImage = async (url: string): Promise<string> => {
  try {
    const { config, fs } = RNFetchBlob;
    const dirs = fs.dirs;
    const filePath = `${dirs.DocumentDir}/bg_removed_${Date.now()}.png`;

    const res = await config({
      fileCache: true,
      path: filePath,
    }).fetch('GET', url);

    return 'file://' + res.path();
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

export const resizeToSquare = async (imageUri: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      imageUri,
      async (width, height) => {
        const size = Math.max(width, height);

        const resizedImage = await ImageResizer.createResizedImage(
          imageUri,
          size,
          size,
          'PNG',
          100,
          0,
          undefined,
          false,
          {
            mode: 'contain',
            onlyScaleDown: false,
          }
        );

        resolve(resizedImage.uri);
      },
      (error) => {
        console.error('Error getting image size:', error);
        reject(error);
      }
    );
  });
};
