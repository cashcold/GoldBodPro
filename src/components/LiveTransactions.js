import React, { Component } from 'react';
import api from '../services/api.js';
import { ArrowDownRight, ArrowUpRight, RefreshCw, Activity } from 'lucide-react';

class LiveTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'deposits', // 'deposits' or 'withdrawals'
      deposits: [
        { id: '1', username: 'crypto_king99', country: '🇺🇸 US', amount: 2500, currency: 'USDT', gateway: 'USDT TRC20', time: '1 min ago' },
        { id: '2', username: 'berlin_trader', country: '🇩🇪 DE', amount: 1200, currency: 'ETH', gateway: 'Ethereum', time: '5 mins ago' },
        { id: '3', username: 'tokyo_whale', country: '🇯🇵 JP', amount: 5000, currency: 'USDT', gateway: 'USDT BEP20', time: '12 mins ago' },
        { id: '4', username: 'alex_nordic', country: '🇳🇴 NO', amount: 800, currency: 'BTC', gateway: 'Bitcoin', time: '18 mins ago' },
        { id: '5', username: 'sydney_gold', country: '🇦🇺 AU', amount: 3500, currency: 'USDT', gateway: 'USDT TRC20', time: '24 mins ago' }
      ],
      withdrawals: [
        { id: 'w1', username: 'satoshi_investor', country: '🇬🇧 UK', amount: 850, currency: 'BTC', gateway: 'Bitcoin', time: '3 mins ago' },
        { id: 'w2', username: 'ghana_crypto', country: '🇬🇭 GH', amount: 400, currency: 'USDT', gateway: 'USDT ERC20', time: '8 mins ago' },
        { id: 'w3', username: 'paris_gold', country: '🇫🇷 FR', amount: 1750, currency: 'USDT', gateway: 'USDT TRC20', time: '15 mins ago' },
        { id: 'w4', username: 'madrid_pro', country: '🇪🇸 ES', amount: 620, currency: 'ETH', gateway: 'Ethereum', time: '22 mins ago' },
        { id: 'w5', username: 'vancouver_trader', country: '🇨🇦 CA', amount: 2900, currency: 'USDT', gateway: 'USDT BEP20', time: '30 mins ago' }
      ],
      lastRefreshed: new Date().toLocaleTimeString()
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.simulateNewTransaction, 6000);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  simulateNewTransaction = () => {
    const names = ['cyber_sam', 'dubai_vip', 'zurich_investor', 'singapore_tx', 'london_crypto', 'rome_trader'];
    const countries = ['🇦🇪 AE', '🇨🇭 CH', '🇸🇬 SG', '🇬🇧 UK', '🇮🇹 IT', '🇧🇷 BR'];
    const gateways = ['USDT TRC20', 'Bitcoin', 'Ethereum', 'USDT BEP20', 'USDT ERC20'];
    
    const randomUser = names[Math.floor(Math.random() * names.length)];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const randomGateway = gateways[Math.floor(Math.random() * gateways.length)];
    const randomAmount = Math.floor(200 + Math.random() * 4500);

    const newTx = {
      id: Date.now().toString(),
      username: randomUser,
      country: randomCountry,
      amount: randomAmount,
      currency: randomGateway.includes('BTC') ? 'BTC' : 'USDT',
      gateway: randomGateway,
      time: 'Just now'
    };

    if (Math.random() > 0.5) {
      this.setState(prevState => ({
        deposits: [newTx, ...prevState.deposits.slice(0, 4)],
        lastRefreshed: new Date().toLocaleTimeString()
      }));
    } else {
      this.setState(prevState => ({
        withdrawals: [newTx, ...prevState.withdrawals.slice(0, 4)],
        lastRefreshed: new Date().toLocaleTimeString()
      }));
    }
  };

  render() {
    const { activeTab, deposits, withdrawals, lastRefreshed } = this.state;
    const currentList = activeTab === 'deposits' ? deposits : withdrawals;

    return (
      <section className="py-20 bg-[#090E18] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#FFD700]/30 text-xs font-semibold text-[#FFD700] uppercase mb-3">
              <Activity className="w-4 h-4" /> Live Ledger
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Latest <span className="text-gold-gradient">Transactions</span>
            </h2>
            <p className="mt-4 text-gray-300 text-sm sm:text-base">
              Real-time audit log of deposits and instant payouts executed globally on GoldBod Pro.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={() => this.setState({ activeTab: 'deposits' })}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
                activeTab === 'deposits'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#0F172A] text-gray-400 border-slate-800 hover:text-white'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-emerald-400" />
              <span>Latest Deposits</span>
            </button>

            <button
              onClick={() => this.setState({ activeTab: 'withdrawals' })}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
                activeTab === 'withdrawals'
                  ? 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/50 shadow-lg shadow-[#FFD700]/10'
                  : 'bg-[#0F172A] text-gray-400 border-slate-800 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-[#FFD700]" />
              <span>Latest Withdrawals</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#090E18]/60 border-b border-slate-800 flex justify-between items-center text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Auto Refresh Enabled
              </span>
              <span className="flex items-center gap-1 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FFD700]" />
                Updated: {lastRefreshed}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#090E18] text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Investor</th>
                    <th className="px-6 py-4">Country</th>
                    <th className="px-6 py-4">Gateway</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {currentList.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#FFD700]/5 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-2 font-mono font-bold text-white">
                        {tx.username}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold">
                        {tx.country}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-amber-400">
                        {tx.gateway}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-white text-base">
                        ${tx.amount.toLocaleString()} <span className="text-xs text-gray-400">{tx.currency}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {tx.time}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Verified Instant
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>
    );
  }
}

export default LiveTransactions;
