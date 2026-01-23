import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Input } from './Input';

/**
 * Exemplos dos novos inputs modernos com design 2025
 */
export const ModernInputExamples = () => {
  const [basicInput, setBasicInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 Modern Input Design 2025</Text>
        <Text style={styles.sectionDescription}>
          Novos inputs com glassmorphism sutil, rounded corners, e border
          minimalista
        </Text>
      </View>

      {/* Basic Input */}
      <View style={styles.exampleCard}>
        <Text style={styles.exampleTitle}>Basic Input</Text>
        <Input
          label="Full Name"
          placeholder="Enter your name"
          value={basicInput}
          onChangeText={setBasicInput}
          hint="This field is required"
        />
      </View>

      {/* Email Input */}
      <View style={styles.exampleCard}>
        <Text style={styles.exampleTitle}>Email Input</Text>
        <Input
          label="Email Address"
          placeholder="your.email@example.com"
          value={emailInput}
          onChangeText={setEmailInput}
          keyboardType="email-address"
          autoCapitalize="none"
          hint="We'll never share your email"
        />
      </View>

      {/* Password Input */}
      <View style={styles.exampleCard}>
        <Text style={styles.exampleTitle}>Password Input</Text>
        <Input
          label="Password"
          placeholder="Enter a secure password"
          value={passwordInput}
          onChangeText={setPasswordInput}
          secureTextEntry
          hint="Minimum 8 characters"
        />
      </View>

      {/* Input with Error */}
      <View style={styles.exampleCard}>
        <Text style={styles.exampleTitle}>Input with Error State</Text>
        <Input
          label="Username"
          placeholder="username"
          value=""
          error="This username is already taken"
        />
      </View>

      {/* Features Section */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>✨ Características</Text>

        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>🔘</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureHeader}>Rounded Corners (16px)</Text>
            <Text style={styles.featureDesc}>Aparência moderna e friendly</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>🌫️</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureHeader}>Glassmorphism Sutil</Text>
            <Text style={styles.featureDesc}>
              Background semi-transparente com elevação mínima
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>✨</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureHeader}>Borders Minimalistas</Text>
            <Text style={styles.featureDesc}>
              Bordas claras mas não intrusivas
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>💫</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureHeader}>Sombras Suaves</Text>
            <Text style={styles.featureDesc}>
              Profundidade visual sem excesso (elevation: 1)
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>📏</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureHeader}>Espaçamento Generoso</Text>
            <Text style={styles.featureDesc}>
              Padding 16px H, 14px V para melhor conforto
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureBullet}>🔤</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureHeader}>Tipografia Clara</Text>
            <Text style={styles.featureDesc}>
              Hierarquia melhorada com labels e hints
            </Text>
          </View>
        </View>
      </View>

      {/* Specs Section */}
      <View style={styles.specsCard}>
        <Text style={styles.specsTitle}>📐 Especificações</Text>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Border Radius</Text>
          <Text style={styles.specValue}>16px</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Min Height</Text>
          <Text style={styles.specValue}>52-60px</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Padding Horizontal</Text>
          <Text style={styles.specValue}>16px</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Padding Vertical</Text>
          <Text style={styles.specValue}>12-14px</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Border Width</Text>
          <Text style={styles.specValue}>1px</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Shadow Opacity</Text>
          <Text style={styles.specValue}>0.05 (minimal)</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Font Size</Text>
          <Text style={styles.specValue}>16px</Text>
        </View>

        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Font Weight</Text>
          <Text style={styles.specValue}>500</Text>
        </View>
      </View>

      <View style={styles.footerSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  section: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  exampleCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureBullet: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  specsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  specsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  specLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  footerSpace: {
    height: 40,
  },
});

export default ModernInputExamples;
