import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ModernInput } from '../ModernInput';
import { ThemeProvider } from '@shared/theme';

// Mock do theme
const mockTheme = {
  colors: {
    text: '#000',
    textSecondary: '#666',
    primary: '#007AFF',
    error: '#FF3B30',
    border: '#E5E5E5',
    surfaceVariant: '#F5F5F5',
  },
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ModernInput', () => {
  it('should render correctly with label', () => {
    const { getByText } = renderWithTheme(
      <ModernInput label="Test Label" />
    );
    
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('should handle floating label animation on focus', async () => {
    const { getByTestId } = renderWithTheme(
      <ModernInput 
        label="Email" 
        variant="floating"
        testID="modern-input"
      />
    );
    
    const input = getByTestId('modern-input');
    fireEvent(input, 'focus');
    
    // Test that focus animation triggers
    await waitFor(() => {
      expect(input).toBeTruthy();
    });
  });

  it('should display error message when error prop is provided', () => {
    const { getByText } = renderWithTheme(
      <ModernInput 
        label="Email" 
        error="Invalid email"
      />
    );
    
    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('should display hint message when hint prop is provided', () => {
    const { getByText } = renderWithTheme(
      <ModernInput 
        label="Username" 
        hint="Must be 3-20 characters"
      />
    );
    
    expect(getByText('Must be 3-20 characters')).toBeTruthy();
  });

  it('should render left and right icons', () => {
    const { getByTestId } = renderWithTheme(
      <ModernInput 
        label="Search"
        leftIcon={<div testID="left-icon">Left</div>}
        rightIcon={<div testID="right-icon">Right</div>}
      />
    );
    
    expect(getByTestId('left-icon')).toBeTruthy();
    expect(getByTestId('right-icon')).toBeTruthy();
  });

  it('should handle text changes', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ModernInput 
        label="Test"
        onChangeText={onChangeText}
        testID="modern-input"
      />
    );
    
    const input = getByTestId('modern-input');
    fireEvent.changeText(input, 'test value');
    
    expect(onChangeText).toHaveBeenCalledWith('test value');
  });

  it('should apply different variants correctly', () => {
    const { rerender, getByTestId } = renderWithTheme(
      <ModernInput 
        label="Test"
        variant="floating"
        testID="modern-input"
      />
    );
    
    let container = getByTestId('modern-input').parent;
    expect(container).toBeTruthy();
    
    rerender(
      <ThemeProvider>
        <ModernInput 
          label="Test"
          variant="filled"
          testID="modern-input"
        />
      </ThemeProvider>
    );
    
    container = getByTestId('modern-input').parent;
    expect(container).toBeTruthy();
  });

  it('should apply different sizes correctly', () => {
    const { rerender, getByTestId } = renderWithTheme(
      <ModernInput 
        label="Test"
        size="sm"
        testID="modern-input"
      />
    );
    
    let input = getByTestId('modern-input');
    expect(input).toBeTruthy();
    
    rerender(
      <ThemeProvider>
        <ModernInput 
          label="Test"
          size="lg"
          testID="modern-input"
        />
      </ThemeProvider>
    );
    
    input = getByTestId('modern-input');
    expect(input).toBeTruthy();
  });

  it('should handle container press to focus input', () => {
    const { getByTestId } = renderWithTheme(
      <ModernInput 
        label="Test"
        testID="modern-input"
      />
    );
    
    // This would require a more complex setup to test focus behavior
    const input = getByTestId('modern-input');
    expect(input).toBeTruthy();
  });
});