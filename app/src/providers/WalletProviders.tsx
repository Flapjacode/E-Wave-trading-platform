import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum, base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { createContext, useContext, useState, useCallback } from 'react';

// EVM Wallet Config
const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [mainnet, polygon, arbitrum, base],
  connectors: [
    injected({ target: 'metaMask' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
});

// Solana Wallet Context
interface SolanaWalletContextType {
  publicKey: string | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const SolanaWalletContext = createContext<SolanaWalletContextType | undefined>(undefined);

function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    try {
      // @ts-ignore - Phantom wallet
      const provider = window.phantom?.solana;
      
      if (!provider) {
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await provider.connect();
      setPublicKey(response.publicKey.toString());
      setConnected(true);
    } catch (error) {
      console.error('Error connecting to Solana wallet:', error);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      // @ts-ignore - Phantom wallet
      const provider = window.phantom?.solana;
      if (provider) {
        await provider.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting Solana wallet:', error);
    }
    setPublicKey(null);
    setConnected(false);
  }, []);

  return (
    <SolanaWalletContext.Provider value={{ publicKey, connected, connect, disconnect }}>
      {children}
    </SolanaWalletContext.Provider>
  );
}

export function useSolanaWallet() {
  const context = useContext(SolanaWalletContext);
  if (context === undefined) {
    throw new Error('useSolanaWallet must be used within a SolanaWalletProvider');
  }
  return context;
}

export function WalletProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
