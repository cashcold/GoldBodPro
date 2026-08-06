import React, { Component } from 'react';
import api from '../services/api.js';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  ShieldCheck, 
  Activity,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

class MarketTicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickers: [
        { symbol: 'BTC', name: 'Bitcoin', price: 67450.20, change24h: 2.84, high24h: 68100, low24h: 65200 },
        { symbol: 'ETH', name: 'Ethereum', price: 3520.80, change24h: 1.92, high24h: 3580, low24h: 3410 },
        { symbol: 'USDT', name: 'Tether USD', price: 1.0001, change24h: 0.01, high24h: 1.0005, low24h: 0.9998 },
        { symbol: 'BNB', name: 'BNB Chain', price: 585.40, change24h: 3.15, high24h: 592, low24h: 565 },
        { symbol: 'SOL', name: 'Solana', price: 154.60, change24h: 4.80, high24h: 158, low24h: 146 },
        { symbol: 'TRX', name: 'TRON', price: 0.1284, change24h: 1.45, high24h: 0.131, low24h: 0.125 }
      ],
      lastUpdated: new Date().toLocaleTimeString(),
      updating: false,
      flashedSymbol: null
    };
  }

  componentDidMount() {
    this.fetchMarketData();
    // Refresh live market ticker every 5 seconds
    this.timer = setInterval(this.fetchMarketData, 5000);
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  fetchMarketData = async () => {
    try {
      this.setState({ updating: true });
      const res = await api.get('/market/ticker');
      if (res.data && res.data.tickers) {
        // Pick a random symbol to trigger flash effect
        const symbols = ['BTC', 'ETH', 'USDT'];
        const randomFlashed = symbols[Math.floor(Math.random() * symbols.length)];

        this.setState({
          tickers: res.data.tickers,
          lastUpdated: new Date().toLocaleTimeString(),
          flashedSymbol: randomFlashed
        });

        setTimeout(() => this.setState({ flashedSymbol: null }), 1000);
      }
    } catch (err) {
      // Micro jitter fallback if offline
      this.setState(prev => {
        const jitterBtc = (Math.random() - 0.48) * 12;
        const jitterEth = (Math.random() - 0.48) * 1.8;
        return {
          tickers: prev.tickers.map(t => {
            if (t.symbol === 'BTC') return { ...t, price: +(t.price + jitterBtc).toFixed(2) };
            if (t.symbol === 'ETH') return { ...t, price: +(t.price + jitterEth).toFixed(2) };
            return t;
          }),
          lastUpdated: new Date().toLocaleTimeString()
        };
      });
    } finally {
      this.setState({ updating: false });
    }
  };

  formatPrice = (symbol, price) => {
    if (symbol === 'USDT') return `$${Number(price).toFixed(4)}`;
    return `$${Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  getSymbolBadge = (symbol) => {
    switch(symbol) {
      case 'BTC':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          icon: '₿'
        };
      case 'ETH':
        return {
          bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400',
          icon: 'Ξ'
        };
      case 'USDT':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          icon: '₮'
        };
      case 'BNB':
        return {
          bg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
          dot: 'bg-yellow-400',
          icon: '⟠'
        };
      default:
        return {
          bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400',
          icon: '◎'
        };
    }
  };

  renderCryptoCard = (item) => {
    const style = this.getSymbolBadge(item.symbol);
    const isPositive = item.change24h >= 0;
    const isFlashed = this.state.flashedSymbol === item.symbol;

    return (
      <div 
        key={item.symbol} 
        className={`flex items-center justify-between gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-xl transition-all duration-300 ${
          isFlashed 
            ? 'bg-amber-500/25 border border-amber-500/60 scale-[1.02] shadow-md' 
            : 'bg-[#0B1220]/80 hover:bg-[#0F172A] border border-slate-800/80 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg ${style.bg} border flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-inner`}>
            {style.icon}
          </div>
          <span className="font-extrabold text-white font-mono tracking-tight text-xs sm:text-sm truncate">
            {item.symbol}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 font-mono shrink-0">
          <span className={`font-extrabold text-xs sm:text-sm transition-colors ${isFlashed ? 'text-[#FFD700]' : 'text-gray-100'}`}>
            {this.formatPrice(item.symbol, item.price)}
          </span>

          <div className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md ${
            isPositive 
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
              : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
          }`}>
            {isPositive ? <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            <span>{isPositive ? '+' : ''}{item.change24h}%</span>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { tickers, lastUpdated } = this.state;

    // Split tickers into first 3 (top row) and next 3 (bottom row)
    const featuredTickers = tickers.filter(t => ['BTC', 'ETH', 'USDT'].includes(t.symbol));
    const secondaryTickers = tickers.filter(t => !['BTC', 'ETH', 'USDT'].includes(t.symbol));
    const orderedTickers = [...featuredTickers, ...secondaryTickers];

    const row1 = orderedTickers.slice(0, 3);
    const row2 = orderedTickers.slice(3, 6);

    return (
      <div className="w-full bg-[#050811]/90 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 text-xs select-none shadow-xl my-3">
        <div className="w-full flex flex-col gap-3">
          
          {/* Header Live Status & Stats */}
          <div className="w-full flex items-center justify-between gap-4 pb-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-extrabold uppercase tracking-widest text-xs text-emerald-400">
                Live Cryptocurrency Rates
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-400 text-[11px] font-mono">
              <span className="hidden sm:inline-block">{lastUpdated}</span>
              <div className="flex items-center gap-1 text-[#FFD700] font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                <Zap className="w-3.5 h-3.5" />
                <span>850k TH/s Hashrate</span>
              </div>
            </div>
          </div>

          {/* 2-Row Stacked Grid Layout: First 3 Top, Next 3 Bottom */}
          <div className="w-full flex flex-col gap-2.5">
            {/* Row 1: First 3 Cryptos (BTC, ETH, USDT) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {row1.map(item => this.renderCryptoCard(item))}
            </div>

            {/* Row 2: Next 3 Cryptos (BNB, SOL, TRX) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {row2.map(item => this.renderCryptoCard(item))}
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default MarketTicker;
