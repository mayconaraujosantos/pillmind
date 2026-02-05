import { useState, useEffect, useCallback } from 'react';
import { nodeRedDiscovery } from '@shared/services/nodeRedDiscovery';

export interface UseNodeRedDiscoveryResult {
  nodeRedURL: string | null;
  isDiscovering: boolean;
  error: string | null;
  manualSetURL: (url: string) => Promise<boolean>;
  rediscover: () => Promise<void>;
  clearConfig: () => Promise<void>;
}

export const useNodeRedDiscovery = (): UseNodeRedDiscoveryResult => {
  const [nodeRedURL, setNodeRedURL] = useState<string | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Descobrir Node-RED automaticamente
  const discoverNodeRed = useCallback(async () => {
    setIsDiscovering(true);
    setError(null);

    try {
      const url = await nodeRedDiscovery.getNodeRedURL();
      if (url) {
        setNodeRedURL(url);
        setError(null);
      } else {
        setError('Node-RED não encontrado na rede. Configure manualmente.');
      }
    } catch (err) {
      setError('Erro ao descobrir Node-RED: ' + (err as Error).message);
    } finally {
      setIsDiscovering(false);
    }
  }, []);

  // Configurar URL manualmente
  const manualSetURL = useCallback(async (url: string): Promise<boolean> => {
    setIsDiscovering(true);
    setError(null);

    try {
      const success = await nodeRedDiscovery.setManualNodeRedURL(url);
      if (success) {
        setNodeRedURL(url);
        setError(null);
        return true;
      } else {
        setError('Não foi possível conectar ao Node-RED neste endereço');
        return false;
      }
    } catch (err) {
      setError('Erro ao configurar Node-RED: ' + (err as Error).message);
      return false;
    } finally {
      setIsDiscovering(false);
    }
  }, []);

  // Redescobrir
  const rediscover = useCallback(async () => {
    await nodeRedDiscovery.clearConfiguration();
    await discoverNodeRed();
  }, [discoverNodeRed]);

  // Limpar configuração
  const clearConfig = useCallback(async () => {
    await nodeRedDiscovery.clearConfiguration();
    setNodeRedURL(null);
    setError(null);
  }, []);

  // Descobrir automaticamente na inicialização
  useEffect(() => {
    discoverNodeRed();
  }, [discoverNodeRed]);

  return {
    nodeRedURL,
    isDiscovering,
    error,
    manualSetURL,
    rediscover,
    clearConfig,
  };
};

// Hook para testar conexão com Node-RED
export const useNodeRedConnection = (url: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    if (!url) return;

    const testConnection = async () => {
      setIsTestingConnection(true);
      try {
        const response = await fetch(`${url}/settings`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        setIsConnected(response.ok);
      } catch {
        setIsConnected(false);
      } finally {
        setIsTestingConnection(false);
      }
    };

    testConnection();

    // Testar conexão periodicamente (30s)
    const interval = setInterval(testConnection, 30000);
    return () => clearInterval(interval);
  }, [url]);

  return { isConnected, isTestingConnection };
};
