import { Platform } from 'react-native';

// Service discovery simples e eficiente para Node-RED
export class NodeRedDiscoveryService {
  private static instance: NodeRedDiscoveryService;
  private currentService: NodeRedService | null = null;

  static getInstance(): NodeRedDiscoveryService {
    if (!NodeRedDiscoveryService.instance) {
      NodeRedDiscoveryService.instance = new NodeRedDiscoveryService();
    }
    return NodeRedDiscoveryService.instance;
  }

  // Descobrir Node-RED de forma simples e direta
  async discoverNodeRed(): Promise<string | null> {
    console.log('🔍 Descobrindo IP local da máquina...');

    // 1. Descobrir IP local da máquina
    const localIP = await this.getLocalMachineIP();
    if (localIP) {
      const nodeRedURL = `http://${localIP}:1880`;
      console.log(`🎯 Testando Node-RED em: ${nodeRedURL}`);
      const foundUrl = await this.tryNodeRedURL(nodeRedURL);
      if (foundUrl) return foundUrl;
    }

    // 2. Fallback para IPs comuns se não encontrar
    console.log('🔄 Testando IPs de fallback...');
    const fallbackIPs = this.getFallbackIPs();

    for (const ip of fallbackIPs) {
      const nodeRedURL = `http://${ip}:1880`;
      const foundUrl = await this.tryNodeRedURL(nodeRedURL);
      if (foundUrl) return foundUrl;
    }

    console.log('❌ Node-RED não encontrado automaticamente');
    return null;
  }

  // Descobrir IP local da máquina de forma simples
  private async getLocalMachineIP(): Promise<string | null> {
    try {
      // Método 1: WebRTC (mais confiável para descobrir IP local)
      const webrtcIP = await this.getIPViaWebRTC();
      if (webrtcIP && this.isLocalIP(webrtcIP)) {
        console.log(`📍 IP local detectado via WebRTC: ${webrtcIP}`);
        return webrtcIP;
      }

      // Método 2: Para React Native, tentar descobrir via conectividade
      if (Platform.OS !== 'web') {
        const connectivityIP = await this.getIPViaConnectivity();
        if (connectivityIP && this.isLocalIP(connectivityIP)) {
          console.log(
            `📍 IP local detectado via conectividade: ${connectivityIP}`
          );
          return connectivityIP;
        }
      }
    } catch (error) {
      console.log('⚠️ Erro na descoberta do IP local:', error);
    }

    return null;
  }

  private async tryNodeRedURL(url: string): Promise<string | null> {
    const isWorking = await this.testNodeRedConnection(url);
    if (isWorking) {
      console.log(`✅ Node-RED encontrado: ${url}`);
      this.currentService = { url, lastSeen: Date.now() };
      return url;
    }

    return null;
  }

  // WebRTC simples para descobrir IP local
  private async getIPViaWebRTC(): Promise<string | null> {
    if (typeof RTCPeerConnection === 'undefined') {
      return null;
    }

    return new Promise((resolve) => {
      try {
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        pc.createDataChannel('');
        pc.createOffer().then((offer) => pc.setLocalDescription(offer));

        pc.onicecandidate = (event) => {
          if (!event.candidate?.candidate) return;

          const candidate = event.candidate.candidate;
          const ipRegex = /(\d+\.\d+\.\d+\.\d+)/;
          const ipMatch = ipRegex.exec(candidate);

          if (ipMatch && this.isLocalIP(ipMatch[1])) {
            pc.close();
            resolve(ipMatch[1]);
          }
        };

        // Timeout
        setTimeout(() => {
          try {
            pc.close();
          } catch {
            /* Ignore close errors */
          }
          resolve(null);
        }, 2000);
      } catch {
        resolve(null);
      }
    });
  }

  // Descobrir IP via análise de conectividade (React Native)
  private async getIPViaConnectivity(): Promise<string | null> {
    try {
      // Para Android emulator, usar IP conhecido
      if (Platform.OS === 'android') {
        const androidIP = '10.0.2.2'; // IP do host no Android emulator
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1000);

        const testResponse = await fetch(`http://${androidIP}:1880/settings`, {
          method: 'HEAD',
          signal: controller.signal,
        });

        clearTimeout(timeout);
        if (testResponse.ok) {
          return androidIP;
        }
      }

      // Para iOS, descobrir IP da rede local
      if (Platform.OS === 'ios') {
        // Tentar conectar com um serviço externo primeiro para ativar interface de rede
        const controller1 = new AbortController();
        const timeout1 = setTimeout(() => controller1.abort(), 2000);

        await fetch('https://httpbin.org/ip', {
          method: 'GET',
          signal: controller1.signal,
        });

        clearTimeout(timeout1);

        // Testar IPs comuns de rede local
        const commonIPs = [
          '192.168.1.2',
          '192.168.1.100',
          '192.168.0.2',
          '192.168.0.100',
        ];
        for (const ip of commonIPs) {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 500);

            const testResponse = await fetch(`http://${ip}:1880/settings`, {
              method: 'HEAD',
              signal: controller.signal,
            });

            clearTimeout(timeout);
            if (testResponse.ok) {
              return ip;
            }
          } catch {
            /* Ignore connection errors */
          }
        }
      }
    } catch {
      console.log('Conectividade test failed');
    }

    return null;
  }

  // Verificar se é IP local/privado
  private isLocalIP(ip: string): boolean {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return false;

    // Ranges de IP privados
    return (
      parts[0] === 10 || // 10.x.x.x
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || // 172.16-31.x.x
      (parts[0] === 192 && parts[1] === 168) || // 192.168.x.x
      ip === '127.0.0.1' // localhost
    );
  }

  // IPs de fallback para testes rápidos
  private getFallbackIPs(): string[] {
    const baseIPs = ['localhost', '127.0.0.1'];

    // Adicionar IPs específicos por plataforma
    if (Platform.OS === 'android') {
      baseIPs.push('10.0.2.2', '10.0.3.2'); // Android emulator
    }

    // IPs de rede local mais comuns
    baseIPs.push(
      '192.168.1.1',
      '192.168.1.2',
      '192.168.1.100',
      '192.168.0.1',
      '192.168.0.2',
      '192.168.0.100',
      '10.0.0.1',
      '10.0.0.2'
    );

    return baseIPs;
  }

  // Teste simples e rápido de conexão
  private async testNodeRedConnection(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1000); // 1 segundo

      const response = await fetch(`${url}/settings`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        // Verificação opcional se é realmente Node-RED
        try {
          const data = await response.json();
          return !!(data.version || data.httpRoot !== undefined);
        } catch {
          return true; // Se deu OK mas não conseguiu parsear JSON, assumir que é Node-RED
        }
      }

      return false;
    } catch {
      console.log('Error testing Node-RED connection');
      return false;
    }
  }

  // Método principal para obter URL do Node-RED
  async getNodeRedURL(): Promise<string | null> {
    console.log('🚀 Iniciando descoberta simples do Node-RED...');

    // 1. Tentar URL salva primeiro
    const saved = await this.getSavedNodeRedURL();
    if (saved) {
      console.log('✅ Usando Node-RED salvo:', saved);
      return saved;
    }

    // 2. Descobrir automaticamente
    const discovered = await this.discoverNodeRed();
    if (discovered) {
      return discovered;
    }

    console.log('❌ Node-RED não encontrado automaticamente');
    return null;
  }

  // Configuração manual com persistência
  async setManualNodeRedURL(url: string): Promise<boolean> {
    const isValid = await this.testNodeRedConnection(url);
    if (isValid) {
      this.currentService = { url, lastSeen: Date.now() };
      // Salvar no AsyncStorage para persistir
      try {
        const { default: AsyncStorage } =
          await import('@react-native-async-storage/async-storage');
        await AsyncStorage.setItem('nodeRedURL', url);
      } catch {
        console.log('Não foi possível salvar configuração');
      }
      return true;
    }
    return false;
  }

  // Recuperar configuração salva
  async getSavedNodeRedURL(): Promise<string | null> {
    try {
      const { default: AsyncStorage } =
        await import('@react-native-async-storage/async-storage');
      const saved = await AsyncStorage.getItem('nodeRedURL');
      if (saved) {
        const isStillValid = await this.testNodeRedConnection(saved);
        if (isStillValid) {
          this.currentService = { url: saved, lastSeen: Date.now() };
          return saved;
        }
      }
    } catch {
      console.log('Não foi possível recuperar configuração salva');
    }
    return null;
  }

  // Getter para serviço atual
  getCurrentService(): NodeRedService | null {
    return this.currentService;
  }

  // Limpar configuração
  async clearConfiguration(): Promise<void> {
    try {
      const { default: AsyncStorage } =
        await import('@react-native-async-storage/async-storage');
      await AsyncStorage.removeItem('nodeRedURL');
      this.currentService = null;
    } catch {
      console.log('Erro ao limpar configuração');
    }
  }
}

interface NodeRedService {
  url: string;
  lastSeen: number;
}

export const nodeRedDiscovery = NodeRedDiscoveryService.getInstance();
