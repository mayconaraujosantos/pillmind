import React from 'react';
import { Button, Text } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useHomeData } from '../useHomeData';
import { Medicine } from '../../../domain/entities/Medicine';
import type { GetMedicinesUseCase } from '../../../domain/useCases/GetMedicinesUseCase';

jest.mock('@shared/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const createMedicine = (): Medicine => ({
  id: '1',
  name: 'Medicine A',
  dosage: '10mg',
  frequency: 'daily',
  times: ['08:00'],
  startDate: new Date('2025-01-01'),
});

const TestComponent = ({ useCase }: { useCase: GetMedicinesUseCase }) => {
  const { medicines, loading, refreshing, error, refresh } =
    useHomeData(useCase);

  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="refreshing">{String(refreshing)}</Text>
      <Text testID="error">{error || ''}</Text>
      <Text testID="count">{String(medicines.length)}</Text>
      <Button title="refresh" onPress={refresh} />
    </>
  );
};

describe('useHomeData', () => {
  it('loads medicines on mount', async () => {
    const execute = jest.fn().mockResolvedValue([createMedicine()]);
    const useCase = { execute } as unknown as GetMedicinesUseCase;
    const { getByTestId } = render(<TestComponent useCase={useCase} />);

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    expect(getByTestId('count').props.children).toBe('1');
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('sets error when loading fails', async () => {
    const execute = jest.fn().mockRejectedValue(new Error('Boom'));
    const useCase = { execute } as unknown as GetMedicinesUseCase;
    const { getByTestId } = render(<TestComponent useCase={useCase} />);

    await waitFor(() => {
      expect(getByTestId('error').props.children).toBe('Boom');
    });

    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('refresh calls use case again', async () => {
    const execute = jest
      .fn()
      .mockResolvedValueOnce([createMedicine()])
      .mockResolvedValueOnce([]);

    const useCase = { execute } as unknown as GetMedicinesUseCase;
    const { getByText } = render(<TestComponent useCase={useCase} />);

    await waitFor(() => {
      expect(execute).toHaveBeenCalledTimes(1);
    });

    fireEvent.press(getByText('refresh'));

    await waitFor(() => {
      expect(execute).toHaveBeenCalledTimes(2);
    });
  });
});
