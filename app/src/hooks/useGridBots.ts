import { useState, useEffect, useCallback } from 'react';
import type { GridBotConfig } from '@/types/crypto';

const STORAGE_KEY = 'grid_bots';

export function useGridBots() {
  const [bots, setBots] = useState<GridBotConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBots(JSON.parse(stored));
      } catch {
        setBots([]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bots));
    }
  }, [bots, loading]);

  const createBot = useCallback((config: Omit<GridBotConfig, 'id' | 'createdAt' | 'profit' | 'profitPercentage'>) => {
    const newBot: GridBotConfig = {
      ...config,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      profit: 0,
      profitPercentage: 0,
    };
    setBots(prev => [...prev, newBot]);
    return newBot;
  }, []);

  const updateBot = useCallback((id: string, updates: Partial<GridBotConfig>) => {
    setBots(prev => prev.map(bot => 
      bot.id === id ? { ...bot, ...updates } : bot
    ));
  }, []);

  const deleteBot = useCallback((id: string) => {
    setBots(prev => prev.filter(bot => bot.id !== id));
  }, []);

  const toggleBotStatus = useCallback((id: string) => {
    setBots(prev => prev.map(bot => {
      if (bot.id !== id) return bot;
      const nextStatus = bot.status === 'active' ? 'paused' : bot.status === 'paused' ? 'active' : 'active';
      return { ...bot, status: nextStatus };
    }));
  }, []);

  return {
    bots,
    loading,
    createBot,
    updateBot,
    deleteBot,
    toggleBotStatus,
  };
}
