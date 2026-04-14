import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { ViewType } from '@/App';

interface HeaderProps {
  currentView: ViewType;
}

const viewTitles: Record<ViewType, string> = {
  market: 'Market Overview',
  trading: 'Trading View',
  'ai-signals': 'AI Trading Signals',
  'grid-bots': 'Grid Bot Manager',
  advisor: 'AI Trading Advisor',
};

export function Header({ currentView }: HeaderProps) {
  return (
    <header className="h-16 bg-[#0d1220]/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-white">{viewTitles[currentView]}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search assets..."
            className="w-64 pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2 p-2 rounded-xl bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>
    </header>
  );
}
