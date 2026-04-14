import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, TrendingUp, TrendingDown, Minus, Clock, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ChatMessage } from '@/types/crypto';

export function AIAdvisor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI Trading Advisor. I can help you analyze cryptocurrencies and provide trading recommendations. Ask me about any coin, market conditions, or trading strategies!',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): ChatMessage => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Check for specific coin mentions
    const coinMatches = lowerMsg.match(/\b(btc|bitcoin|eth|ethereum|sol|solana|ada|cardano|xrp|ripple|bnb|binance)\b/g);
    const coin = coinMatches ? coinMatches[0] : null;
    
    // Check for long/short questions
    const isAskingDirection = lowerMsg.includes('long') || lowerMsg.includes('short') || lowerMsg.includes('buy') || lowerMsg.includes('sell');
    
    if (coin && isAskingDirection) {
      const coinName = coin === 'btc' || coin === 'bitcoin' ? 'Bitcoin' :
                       coin === 'eth' || coin === 'ethereum' ? 'Ethereum' :
                       coin === 'sol' || coin === 'solana' ? 'Solana' :
                       coin === 'ada' || coin === 'cardano' ? 'Cardano' :
                       coin === 'xrp' || coin === 'ripple' ? 'XRP' :
                       coin === 'bnb' || coin === 'binance' ? 'BNB' : coin.toUpperCase();
      
      // Generate pseudo-random but consistent recommendation based on coin name
      const hash = coinName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const recommendations: ('LONG' | 'SHORT' | 'WAIT')[] = ['LONG', 'SHORT', 'WAIT'];
      const recommendation = recommendations[hash % 3];
      const timeframes = ['1H', '4H', '1D', '1W'];
      const timeframe = timeframes[hash % 4];
      const confidence = 60 + (hash % 30);
      
      const reasoning = recommendation === 'LONG' 
        ? `Based on my technical analysis, ${coinName} is showing bullish momentum with strong support levels. The RSI indicates oversold conditions recovering, and volume is increasing. MACD shows a bullish crossover on the ${timeframe} timeframe.`
        : recommendation === 'SHORT'
        ? `My analysis suggests ${coinName} is facing resistance with bearish divergence on the RSI. The ${timeframe} chart shows weakening momentum and decreasing volume. Consider waiting for a better entry or shorting with proper risk management.`
        : `${coinName} is currently in a consolidation phase with mixed signals. I'd recommend waiting for a clearer breakout direction before entering a position. Watch for volume confirmation on the ${timeframe} timeframe.`;
      
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: reasoning,
        timestamp: new Date().toISOString(),
        tradingAdvice: {
          recommendation,
          timeframe,
          confidence,
        },
      };
    }
    
    if (lowerMsg.includes('grid') || lowerMsg.includes('bot')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Grid trading bots are excellent for sideways markets! Here are my recommendations:\n\n1. **BTC Grid Bot**: Set range $60,000 - $75,000 with 20 grids. Good for current volatility.\n\n2. **ETH Grid Bot**: Range $3,000 - $4,000 with 15 grids. ETH has been consolidating in this range.\n\n3. **SOL Grid Bot**: Range $120 - $180 with 12 grids. Higher volatility = higher potential returns.\n\nRemember to only invest what you can afford to lose, and monitor your bots regularly!',
        timestamp: new Date().toISOString(),
      };
    }
    
    if (lowerMsg.includes('market') || lowerMsg.includes('trend')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Current market analysis:\n\n**Overall Sentiment**: Cautiously Bullish 📈\n\n**Key Observations**:\n- Bitcoin holding above $65K support, showing resilience\n- Altcoin season potentially starting with ETH leading\n- Institutional inflows remain positive\n- Fear & Greed Index at 72 (Greed)\n\n**Watch Levels**:\n- BTC: Support $64K, Resistance $70K\n- ETH: Support $3,200, Resistance $3,800\n- Total Market Cap: Approaching $2.5T resistance\n\n**Strategy**: DCA on dips, take profits on major resistance breaks.',
        timestamp: new Date().toISOString(),
      };
    }
    
    if (lowerMsg.includes('risk') || lowerMsg.includes('management')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Risk management is crucial for long-term trading success! Here are my key principles:\n\n1. **Position Sizing**: Never risk more than 2-5% of your portfolio on a single trade\n\n2. **Stop Losses**: Always set stop losses. A good rule is 1-2% below support for longs\n\n3. **Risk/Reward Ratio**: Aim for at least 1:2 risk/reward. This means if you risk $100, target $200 profit\n\n4. **Diversification**: Don\'t put all funds in one coin. Spread across 3-5 positions\n\n5. **Leverage**: If using leverage, keep it low (2-5x max for beginners)\n\n6. **Emotional Control**: Stick to your plan. Don\'t FOMO or panic sell\n\nWould you like me to analyze a specific trade setup with these principles?',
        timestamp: new Date().toISOString(),
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I can help you with:\n\n• **Trading Analysis**: Ask "Should I long or short BTC?" or "What\'s your ETH analysis?"\n\n• **Market Overview**: Ask "How\'s the market looking?" or "Current trends?"\n\n• **Grid Bot Setup**: Ask "Recommend grid bot settings" or "Best coins for grid trading?"\n\n• **Risk Management**: Ask "Trading risk tips" or "How to manage my positions?"\n\nWhat would you like to know about?',
      timestamp: new Date().toISOString(),
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'LONG':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'SHORT':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'LONG':
        return <TrendingUp className="w-4 h-4" />;
      case 'SHORT':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-[#0d1220]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Trading Advisor</h2>
              <p className="text-sm text-gray-500">Ask for trading analysis and recommendations</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-400">
            <RefreshCw className="w-4 h-4 mr-1" /> New Chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-blue-500'
                  : 'bg-gradient-to-br from-purple-500 to-pink-600'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
              <Card
                className={`inline-block ${
                  message.role === 'user'
                    ? 'bg-blue-600 border-blue-500'
                    : 'bg-[#1a1f2e] border-gray-800'
                }`}
              >
                <CardContent className="p-3">
                  <p className={`text-sm whitespace-pre-line ${message.role === 'user' ? 'text-white' : 'text-gray-300'}`}>
                    {message.content}
                  </p>
                  
                  {/* Trading Advice Card */}
                  {message.tradingAdvice && (
                    <div className="mt-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getRecommendationColor(message.tradingAdvice.recommendation)}>
                          {getRecommendationIcon(message.tradingAdvice.recommendation)}
                          <span className="ml-1">{message.tradingAdvice.recommendation}</span>
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock className="w-3 h-3" />
                          {message.tradingAdvice.timeframe}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">AI Confidence:</span>
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              message.tradingAdvice.confidence >= 80
                                ? 'bg-green-500'
                                : message.tradingAdvice.confidence >= 60
                                ? 'bg-yellow-500'
                                : 'bg-orange-500'
                            }`}
                            style={{ width: `${message.tradingAdvice.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-white">
                          {message.tradingAdvice.confidence}%
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <Card className="bg-[#1a1f2e] border-gray-800">
              <CardContent className="p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length < 3 && (
        <div className="px-4 py-2 border-t border-gray-800 bg-[#0a0e1a]">
          <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Should I long BTC?',
              'ETH analysis?',
              'Grid bot settings?',
              'Market overview?',
              'Risk management tips?',
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white text-xs"
                onClick={() => {
                  setInput(suggestion);
                }}
              >
                {suggestion} <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-[#0d1220]">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about any coin, trading strategy, or market analysis..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI responses are for educational purposes only. Always DYOR before trading.
        </p>
      </div>
    </div>
  );
}
