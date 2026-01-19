// Exemplo de como usar em qualquer componente

import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNodeRedDiscovery } from '@shared/hooks/useNodeRedDiscovery';

export const ExampleUsage: React.FC = () => {
  const { nodeRedURL, isDiscovering, error } = useNodeRedDiscovery();

  const makeNodeRedRequest = async () => {
    if (!nodeRedURL) {
      console.log('Node-RED não configurado');
      return;
    }

    try {
      const response = await fetch(`${nodeRedURL}/your-endpoint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: 'exemplo' }),
      });

      const result = await response.json();
      console.log('Resposta do Node-RED:', result);
    } catch (err) {
      console.log('Erro ao chamar Node-RED:', err);
    }
  };

  return (
    <View>
      <Text>Node-RED: {nodeRedURL || 'Não configurado'}</Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <Button
        title="Fazer Requisição"
        onPress={makeNodeRedRequest}
        disabled={!nodeRedURL || isDiscovering}
      />
    </View>
  );
};
