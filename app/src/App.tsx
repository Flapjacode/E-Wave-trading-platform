import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { CryptoList } from '@/sections/CryptoList';
import { TradingView } from '@/sections/TradingView';
import { AISignals } from '@/sections/AISignals';
import { GridBotManager } from '@/sections/GridBotManager';
import { AIAdvisor } from '@/sections/AIAdvisor';
import { AuthProvider } from '@/hooks/useAuth';
import { WalletProviders } from '@/providers/WalletProviders';
import type { Cryptocurrency } from '@/types/crypto';

export type ViewType = 'market' | 'trading' | 'ai-signals' | 'grid-bots' | 'advisor';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('market');
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(null);

  const handleCryptoSelect = (crypto: Cryptocurrency) => {
    setSelectedCrypto(crypto);
    setCurrentView('trading');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'market':
        return <CryptoList onSelect={handleCryptoSelect} />;
      case 'trading':
        return <TradingView crypto={selectedCrypto} onBack={() => setCurrentView('market')} />;
      case 'ai-signals':
        return <AISignals onSelectCrypto={handleCryptoSelect} />;
      case 'grid-bots':
        return <GridBotManager />;
      case 'advisor':
        return <AIAdvisor />;
      default:
        return <CryptoList onSelect={handleCryptoSelect} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0e1a] text-white overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header currentView={currentView} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <WalletProviders>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </WalletProviders>
  );
}

export default App;
