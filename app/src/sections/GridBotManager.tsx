import { useState } from 'react';
import { Bot, Plus, Play, Pause, Trash2, Settings, TrendingUp, DollarSign, BarChart3, AlertTriangle, CheckCircle2, X, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGridBots } from '@/hooks/useGridBots';
import type { GridBotConfig } from '@/types/crypto';

export function GridBotManager() {
  const { bots, createBot, deleteBot, toggleBotStatus } = useGridBots();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBot, setNewBot] = useState<Partial<GridBotConfig>>({
    symbol: 'BTC',
    upperPrice: 0,
    lowerPrice: 0,
    gridCount: 10,
    investment: 1000,
    mode: 'arithmetic',
    status: 'active',
  });

  const handleCreateBot = () => {
    if (newBot.symbol && newBot.upperPrice && newBot.lowerPrice && newBot.investment) {
      createBot(newBot as Omit<GridBotConfig, 'id' | 'createdAt' | 'profit' | 'profitPercentage'>);
      setIsCreateDialogOpen(false);
      setNewBot({
        symbol: 'BTC',
        upperPrice: 0,
        lowerPrice: 0,
        gridCount: 10,
        investment: 1000,
        mode: 'arithmetic',
        status: 'active',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'stopped':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const totalProfit = bots.reduce((acc, bot) => acc + (bot.profit || 0), 0);
  const activeBots = bots.filter(b => b.status === 'active').length;

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Bots</p>
                <p className="text-2xl font-bold text-white">{bots.length}</p>
              </div>
              <Bot className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Bots</p>
                <p className="text-2xl font-bold text-green-400">{activeBots}</p>
              </div>
              <Play className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Profit</p>
                <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${totalProfit.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Invested</p>
                <p className="text-2xl font-bold text-orange-400">
                  ${bots.reduce((acc, b) => acc + b.investment, 0).toFixed(2)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Your Grid Bots</h3>
          <Badge variant="outline" className="text-gray-400 border-gray-700">
            {bots.length} bots
          </Badge>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1" /> Create New Bot
        </Button>
      </div>

      {/* Bots Grid */}
      {bots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0d1220] border border-gray-800 rounded-xl">
          <Bot className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Grid Bots Yet</h3>
          <p className="text-gray-400 mb-4 text-center max-w-md">
            Create your first grid trading bot to start earning passive income from market volatility.
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" /> Create Your First Bot
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bots.map((bot) => (
            <Card key={bot.id} className="bg-[#0d1220] border-gray-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-white">
                        {bot.symbol} Grid Bot
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Created {new Date(bot.createdAt || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(bot.status)}>
                    {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Range */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Lower Price</p>
                    <p className="text-lg font-semibold text-white">
                      ${bot.lowerPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Upper Price</p>
                    <p className="text-lg font-semibold text-white">
                      ${bot.upperPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Grid Count</p>
                    <p className="text-lg font-semibold text-white">{bot.gridCount}</p>
                  </div>
                </div>

                {/* Grid Visualization */}
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">Grid Levels</p>
                  <div className="relative h-8 bg-gray-700 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex">
                      {Array.from({ length: bot.gridCount }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 border-r border-gray-600 last:border-r-0"
                          style={{
                            backgroundColor: i % 2 === 0 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)',
                          }}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        ${((bot.upperPrice + bot.lowerPrice) / 2).toLocaleString()} (Mid)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Investment & Profit */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <p className="text-xs text-blue-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Investment
                    </p>
                    <p className="text-lg font-semibold text-white">
                      ${bot.investment.toLocaleString()}
                    </p>
                  </div>
                  <div className={`${(bot.profit || 0) >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-lg p-3`}>
                    <p className={`text-xs flex items-center gap-1 ${(bot.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <TrendingUp className="w-3 h-3" /> Profit
                    </p>
                    <p className={`text-lg font-semibold ${(bot.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${(bot.profit || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Grid Mode */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Grid Mode</span>
                  <Badge variant="outline" className="text-gray-400 border-gray-700 capitalize">
                    {bot.mode}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${
                      bot.status === 'active'
                        ? 'border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10'
                        : 'border-green-500/50 text-green-400 hover:bg-green-500/10'
                    }`}
                    onClick={() => toggleBotStatus(bot.id!)}
                  >
                    {bot.status === 'active' ? (
                      <><Pause className="w-4 h-4 mr-1" /> Pause</>
                    ) : (
                      <><Play className="w-4 h-4 mr-1" /> Resume</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-400 hover:bg-gray-800"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => deleteBot(bot.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Bot Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-[#0d1220] border-gray-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-400" /> Create Grid Bot
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Set up automated grid trading to profit from market volatility.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Symbol */}
            <div>
              <Label className="text-sm text-gray-400">Trading Pair</Label>
              <Input
                value={newBot.symbol}
                onChange={(e) => setNewBot({ ...newBot, symbol: e.target.value.toUpperCase() })}
                placeholder="e.g., BTC, ETH"
                className="mt-1 bg-gray-800/50 border-gray-700 text-white"
              />
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-400">Lower Price ($)</Label>
                <Input
                  type="number"
                  value={newBot.lowerPrice || ''}
                  onChange={(e) => setNewBot({ ...newBot, lowerPrice: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  className="mt-1 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-400">Upper Price ($)</Label>
                <Input
                  type="number"
                  value={newBot.upperPrice || ''}
                  onChange={(e) => setNewBot({ ...newBot, upperPrice: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  className="mt-1 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
            </div>

            {/* Grid Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-400">Grid Count</Label>
                <Input
                  type="number"
                  value={newBot.gridCount}
                  onChange={(e) => setNewBot({ ...newBot, gridCount: parseInt(e.target.value) })}
                  min={2}
                  max={100}
                  className="mt-1 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-400">Investment ($)</Label>
                <Input
                  type="number"
                  value={newBot.investment}
                  onChange={(e) => setNewBot({ ...newBot, investment: parseFloat(e.target.value) })}
                  placeholder="1000"
                  className="mt-1 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
            </div>

            {/* Grid Mode */}
            <div>
              <Label className="text-sm text-gray-400">Grid Mode</Label>
              <Tabs
                value={newBot.mode}
                onValueChange={(v) => setNewBot({ ...newBot, mode: v as 'arithmetic' | 'geometric' })}
                className="mt-1"
              >
                <TabsList className="bg-gray-800/50 w-full">
                  <TabsTrigger value="arithmetic" className="flex-1 data-[state=active]:bg-blue-600">
                    <Calculator className="w-4 h-4 mr-1" /> Arithmetic
                  </TabsTrigger>
                  <TabsTrigger value="geometric" className="flex-1 data-[state=active]:bg-blue-600">
                    <BarChart3 className="w-4 h-4 mr-1" /> Geometric
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Preview */}
            {newBot.lowerPrice && newBot.upperPrice && newBot.gridCount && (
              <div className="bg-gray-800/30 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Grid Preview</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price Range</span>
                    <span className="text-white">
                      ${newBot.lowerPrice?.toLocaleString()} - ${newBot.upperPrice?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Grid Spacing</span>
                    <span className="text-white">
                      ${((newBot.upperPrice - newBot.lowerPrice) / newBot.gridCount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Profit per Grid</span>
                    <span className="text-green-400">
                      ~{((newBot.upperPrice - newBot.lowerPrice) / newBot.gridCount / newBot.lowerPrice * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Risk Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-400">
                Grid trading involves risk. Ensure you understand the strategy before investing.
                Past performance does not guarantee future results.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-700 text-gray-400"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleCreateBot}
                disabled={!newBot.symbol || !newBot.lowerPrice || !newBot.upperPrice || !newBot.investment}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" /> Create Bot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
