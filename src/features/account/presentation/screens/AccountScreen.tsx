import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Appearance,
} from 'react-native';
import { ThemeSelector } from '@shared/components';
import { useTheme } from '@shared/theme';

export const AccountScreen: React.FC = () => {
  const { theme, isDark, themeMode } = useTheme();

  const handleDebugTheme = () => {
    const systemTheme = Appearance.getColorScheme();
    console.log('🐛 DEBUG MANUAL:');
    console.log('  - Sistema:', systemTheme);
    console.log('  - Modo app:', themeMode);
    console.log('  - isDark:', isDark);
    alert(`Sistema: ${systemTheme}\nModo: ${themeMode}\nisDark: ${isDark}`);
  };

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.text }]}>
        Perfil
      </Text>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.avatarContainer}>
            <View
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.avatarText}>U</Text>
            </View>
          </View>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            Usuário
          </Text>
          <Text
            style={[styles.userEmail, { color: theme.colors.textSecondary }]}
          >
            usuario@pillmind.com
          </Text>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Aparência
          </Text>
          <ThemeSelector />

          {/* Debug Button */}
          <TouchableOpacity
            style={[
              styles.debugButton,
              {
                backgroundColor: theme.colors.info,
                marginTop: 16,
              },
            ]}
            onPress={handleDebugTheme}
          >
            <Text style={styles.debugButtonText}>
              🐛 Debug: Ver detecção do tema
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Configurações
          </Text>

          <TouchableOpacity
            style={[
              styles.optionItem,
              {
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              Notificações
            </Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionItem,
              {
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              Privacidade
            </Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionItem,
              {
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              Sobre
            </Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              { backgroundColor: theme.colors.error },
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionArrow: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  logoutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  debugButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
