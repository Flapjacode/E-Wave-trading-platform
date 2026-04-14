import { 
  TrendingUp, 
  BarChart3, 
  Brain, 
  Bot, 
  MessageSquare, 
  Wallet,
  Settings,
  LogOut,
  User,
  ChevronRight
} from 'lucide-react';
import type { ViewType } from '@/App';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { AuthDialog } from './AuthDialog';
import { WalletConnectDialog } from './WalletConnectDialog';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const menuItems = [
  { id: 'market' as ViewType, label: 'Market', icon: TrendingUp },
  { id: 'trading' as ViewType, label: 'Trading', icon: BarChart3 },
  { id: 'ai-signals' as ViewType, label: 'AI Signals', icon: Brain },
  { id: 'grid-bots' as ViewType, label: 'Grid Bots', icon: Bot },
  { id: 'advisor' as ViewType, label: 'AI Advisor', icon: MessageSquare },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <>
      <aside className="w-52 bg-[#0d1220] border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CryptoAI
              </h1>
              <p className="text-xs text-gray-500">Trader Pro</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {item.id === 'ai-signals' && (
                  <span className="ml-auto px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                    LIVE
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-gray-800 space-y-2">
          {isAuthenticated && user ? (
            <>
              {/* User Profile */}
              <div className="px-3 py-2 bg-gray-800/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Wallet Connections */}
              <div className="space-y-1">
                {(user.wallets?.solana || user.wallets?.evm) && (
                  <div className="px-3 py-1.5 text-xs text-gray-500">Connected Wallets</div>
                )}
                
                {user.wallets?.solana && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 rounded-lg">
                    <img src="https://cryptologos.cc/logos/solana-sol-logo.png" alt="SOL" className="w-4 h-4" />
                    <span className="text-xs text-purple-400">{shortenAddress(user.wallets.solana)}</span>
                  </div>
                )}
                
                {user.wallets?.evm && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 rounded-lg">
                    <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="w-4 h-4" />
                    <span className="text-xs text-blue-400">{shortenAddress(user.wallets.evm)}</span>
                  </div>
                )}

                <button
                  onClick={() => setIsWalletDialogOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
                >
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">Connect Wallet</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </div>

              <div className="pt-2 border-t border-gray-800 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all duration-200">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsAuthDialogOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-all duration-200"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Login / Sign Up</span>
              </button>
              
              <button
                onClick={() => setIsWalletDialogOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
              >
                <Wallet className="w-5 h-5" />
                <span className="font-medium">Connect Wallet</span>
              </button>
            </>
          )}
        </div>
      </aside>

      <AuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
      <WalletConnectDialog isOpen={isWalletDialogOpen} onClose={() => setIsWalletDialogOpen(false)} />
    </>
  );
}
