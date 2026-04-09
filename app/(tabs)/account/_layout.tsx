import { getAppHeaderChrome } from '@core/navigation/appHeaderChrome';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { Stack, useRouter } from 'expo-router';
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

export default function AccountLayout() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const accountCanvasBg = theme.colors.background;
  const primaryColor = theme.colors.primary;
  const goBack = () => router.back();
  const headerLeft = () => <BackButton onPress={goBack} color={primaryColor} />;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        ...getAppHeaderChrome({
          theme,
          isDark,
          contentBackgroundColor: accountCanvasBg,
        }),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: t('tabs.account'), headerBackVisible: false }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: t('account.editProfile'),
          headerBackVisible: false,
          headerLeft,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: t('account.notifications'),
          headerBackVisible: false,
          headerLeft,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: t('account.privacy'),
          headerBackVisible: false,
          headerLeft,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: t('account.about'),
          headerBackVisible: false,
          headerLeft,
        }}
      />
    </Stack>
  );
}
