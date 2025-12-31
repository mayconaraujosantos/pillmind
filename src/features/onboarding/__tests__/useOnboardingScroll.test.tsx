import { renderHook, act } from '@testing-library/react-native';
import { useOnboardingScroll } from '../presentation/hooks/useOnboardingScroll';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

describe('useOnboardingScroll', () => {
  it('deve iniciar no passo 0', () => {
    const { result } = renderHook(() => useOnboardingScroll(3));
    expect(result.current.currentStep).toBe(0);
  });

  it('deve atualizar o passo ao fazer scroll para o passo 1', () => {
    const { result } = renderHook(() => useOnboardingScroll(3));

    const mockEvent = {
      nativeEvent: {
        contentOffset: { x: 375, y: 0 },
        contentSize: { width: 1125, height: 800 },
        layoutMeasurement: { width: 375, height: 800 },
      },
    } as NativeSyntheticEvent<NativeScrollEvent>;

    act(() => {
      result.current.handleScroll(mockEvent);
    });

    expect(result.current.currentStep).toBe(1);
  });

  it('deve atualizar o passo ao fazer scroll para o passo 2', () => {
    const { result } = renderHook(() => useOnboardingScroll(3));

    const mockEvent = {
      nativeEvent: {
        contentOffset: { x: 750, y: 0 },
        contentSize: { width: 1125, height: 800 },
        layoutMeasurement: { width: 375, height: 800 },
      },
    } as NativeSyntheticEvent<NativeScrollEvent>;

    act(() => {
      result.current.handleScroll(mockEvent);
    });

    expect(result.current.currentStep).toBe(2);
  });

  it('não deve permitir passo negativo', () => {
    const { result } = renderHook(() => useOnboardingScroll(3));

    const mockEvent = {
      nativeEvent: {
        contentOffset: { x: -375, y: 0 },
        contentSize: { width: 1125, height: 800 },
        layoutMeasurement: { width: 375, height: 800 },
      },
    } as NativeSyntheticEvent<NativeScrollEvent>;

    act(() => {
      result.current.handleScroll(mockEvent);
    });

    expect(result.current.currentStep).toBe(0);
  });

  it('não deve permitir passo maior que totalSteps', () => {
    const { result } = renderHook(() => useOnboardingScroll(3));

    const mockEvent = {
      nativeEvent: {
        contentOffset: { x: 1500, y: 0 },
        contentSize: { width: 1125, height: 800 },
        layoutMeasurement: { width: 375, height: 800 },
      },
    } as NativeSyntheticEvent<NativeScrollEvent>;

    act(() => {
      result.current.handleScroll(mockEvent);
    });

    expect(result.current.currentStep).toBe(0); // Deve manter o passo inicial
  });

  it('deve arredondar para o passo mais próximo ao fazer scroll parcial', () => {
    const { result } = renderHook(() => useOnboardingScroll(3));

    // Scroll parcial mais próximo do passo 1
    const mockEvent = {
      nativeEvent: {
        contentOffset: { x: 400, y: 0 },
        contentSize: { width: 1125, height: 800 },
        layoutMeasurement: { width: 375, height: 800 },
      },
    } as NativeSyntheticEvent<NativeScrollEvent>;

    act(() => {
      result.current.handleScroll(mockEvent);
    });

    expect(result.current.currentStep).toBe(1);
  });
});
