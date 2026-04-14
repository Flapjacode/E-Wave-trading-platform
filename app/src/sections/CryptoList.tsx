import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, TrendingUp, TrendingDown, Star, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCryptoData } from '@/hooks/useCryptoData';
import type { Cryptocurrency } from '@/types/crypto';

interface CryptoListProps {
  onSelect: (crypto: Cryptocurrency) => void;
}

export function CryptoList({ onSelect }: CryptoListProps) {
  const { cryptos, loading } = useCryptoData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Cryptocurrency; direction: 'asc' | 'desc' } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSort = (key: keyof Cryptocurrency) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'desc' };
      }
      return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
    });
  };

  const filteredAndSortedCryptos = useMemo(() => {
    let result = [...cryptos];

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        crypto =>
          crypto.name.toLowerCase().includes(term) ||
          crypto.symbol.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return result;
  }, [cryptos, searchTerm, sortConfig]);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) {
      return `$${(cap / 1e12).toFixed(2)}T`;
    } else if (cap >= 1e9) {
      return `$${(cap / 1e9).toFixed(2)}B`;
    } else if (cap >= 1e6) {
      return `$${(cap / 1e6).toFixed(2)}M`;
    }
    return `$${cap.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-64 bg-gray-800/50 rounded-lg animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-800/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800/30 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
          <p className="text-sm text-gray-400">Total Market Cap</p>
          <p className="text-2xl font-bold text-white">$2.45T</p>
          <p className="text-sm text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +2.34%
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
          <p className="text-sm text-gray-400">24h Volume</p>
          <p className="text-2xl font-bold text-white">$89.2B</p>
          <p className="text-sm text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5.67%
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-4">
          <p className="text-sm text-gray-400">BTC Dominance</p>
          <p className="text-2xl font-bold text-white">54.2%</p>
          <p className="text-sm text-red-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> -0.34%
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30 rounded-xl p-4">
          <p className="text-sm text-gray-400">Active Coins</p>
          <p className="text-2xl font-bold text-white">{cryptos.length}</p>
          <p className="text-sm text-gray-400">Listed</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            All Assets
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            Favorites
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            Gainers
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            Losers
          </Button>
        </div>
      </div>

      {/* Crypto Table */}
      <div className="bg-[#0d1220] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('market_cap_rank')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white"
                  >
                    # <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white"
                  >
                    Asset <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('current_price')}
                    className="flex items-center justify-end gap-1 text-xs font-medium text-gray-400 hover:text-white"
                  >
                    Price <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('price_change_percentage_24h')}
                    className="flex items-center justify-end gap-1 text-xs font-medium text-gray-400 hover:text-white"
                  >
                    24h % <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('market_cap')}
                    className="flex items-center justify-end gap-1 text-xs font-medium text-gray-400 hover:text-white"
                  >
                    Market Cap <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('total_volume')}
                    className="flex items-center justify-end gap-1 text-xs font-medium text-gray-400 hover:text-white"
                  >
                    Volume (24h) <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="text-xs font-medium text-gray-400">AI Signal</span>
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="text-xs font-medium text-gray-400">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCryptos.map((crypto) => (
                <tr
                  key={crypto.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => onSelect(crypto)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(crypto.id);
                        }}
                        className="text-gray-500 hover:text-yellow-400 transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favorites.has(crypto.id) ? 'fill-yellow-400 text-yellow-400' : ''
                          }`}
                        />
                      </button>
                      <span className="text-gray-400 text-sm">{crypto.market_cap_rank}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
                        }}
                      />
                      <div>
                        <p className="font-medium text-white">{crypto.name}</p>
                        <p className="text-xs text-gray-500 uppercase">{crypto.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-medium text-white">{formatPrice(crypto.current_price)}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        crypto.price_change_percentage_24h >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-gray-300">{formatMarketCap(crypto.market_cap)}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-gray-300">{formatVolume(crypto.total_volume)}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge
                      variant="outline"
                      className={`${
                        crypto.price_change_percentage_24h > 2
                          ? 'border-green-500/50 text-green-400 bg-green-500/10'
                          : crypto.price_change_percentage_24h < -2
                          ? 'border-red-500/50 text-red-400 bg-red-500/10'
                          : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                      }`}
                    >
                      {crypto.price_change_percentage_24h > 2
                        ? 'STRONG BUY'
                        : crypto.price_change_percentage_24h > 0
                        ? 'BUY'
                        : crypto.price_change_percentage_24h < -2
                        ? 'STRONG SELL'
                        : 'NEUTRAL'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(crypto);
                      }}
                    >
                      Trade <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
