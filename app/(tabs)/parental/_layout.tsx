import { getAppHeaderChrome } from '@core/navigation/appHeaderChrome';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { useRouter, Stack } from 'expo-router';
import { Pressable } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
  color: string;
}

function BackButton({ onPress, color }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={{ marginLeft: 4 }}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
    >
      <Ionicons name="chevron-back" size={26} color={color} />
    </Pressable>
  );
}

export default function ParentalLayout() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const canvasBg = isDark ? theme.colors.background : '#F8F8F8';
  const primaryColor = theme.colors.primary;
  const goBack = () => router.back();
  const headerLeft = () => <BackButton onPress={goBack} color={primaryColor} />;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft,
        ...getAppHeaderChrome({
          theme,
          isDark,
          contentBackgroundColor: canvasBg,
        }),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: t('tabs.parental'), headerBackVisible: false }}
      />
    </Stack>
  );
}
