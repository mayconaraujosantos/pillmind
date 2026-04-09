import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { deviceSize, hp, wp } from '@shared/utils/dimensions';

const IMAGE_RATIO = 600 / 1022; // original image proportion

// Dimensão responsiva da imagem adaptada a qualquer tamanho de tela
const getImageDimensions = () => {
  // Calcula porcentagens adaptativas baseadas no tamanho do dispositivo
  // Aumentado para melhor UX/UI: 80%, 88%, 92%
  const widthPercentage = deviceSize(0.8, 0.88, 0.92);
  const baseWidth = wp(widthPercentage * 100);

  // Limites adaptativos mais generosos
  const maxWidth = Math.min(baseWidth, deviceSize(420, 500, 560));
  const maxHeight = hp(deviceSize(42, 48, 52));

  const heightCandidate = maxWidth / IMAGE_RATIO;

  if (heightCandidate > maxHeight) {
    const height = maxHeight;
    const width = height * IMAGE_RATIO;
    return { width, height };
  }

  return { width: maxWidth, height: heightCandidate };
};

interface OnboardingImageProps {
  imageUrl: string;
}

export const OnboardingImage: React.FC<OnboardingImageProps> = ({
  imageUrl,
}) => {
  const { width: imageWidth, height: imageHeight } = getImageDimensions();

  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          {
            width: imageWidth,
            height: imageHeight,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: deviceSize(4, 6, 8),
    paddingBottom: deviceSize(2, 3, 4),
  },
  image: {
    resizeMode: 'contain',
  },
});
