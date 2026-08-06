import React, { Component } from 'react';
import { History, Search, ArrowDownCircle, ArrowUpCircle, TrendingUp, Users } from 'lucide-react';

class TransactionsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterType: 'all',
      searchQuery: ''
    };
  }

  render() {
    const { data } = this.props;
    const { transactions } = data;
    const { filterType, searchQuery } = this.state;

    const filtered = transactions?.filter(tx => {
      const matchType = filterType === 'all' || tx.type === filterType;
      const matchQuery = !searchQuery || tx.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchQuery;
    });

    return (
      <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
        
        <div>
          <h2 className="text-2xl font-black text-white">Full Transaction Audit Ledger</h2>
          <p className="text-xs text-gray-400 mt-1">
            Complete record of deposits, interest yield payouts, withdrawals, and referral commissions.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['all', 'deposit', 'withdrawal', 'investment', 'profit', 'referral'].map((t) => (
              <button
                key={t}
                onClick={() => this.setState({ filterType: t })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  filterType === t
                    ? 'bg-[#FFD700] text-black shadow-lg'
                    : 'bg-[#090E18] text-gray-400 hover:text-white border border-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search description..."
              value={searchQuery}
              onChange={(e) => this.setState({ searchQuery: e.target.value })}
              className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-white pl-9"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl p-6 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#090E18] font-semibold text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {filtered?.map((tx) => {
                  const isPositive = ['deposit', 'profit', 'referral'].includes(tx.type);
                  return (
                    <tr key={tx.id} className="hover:bg-[#FFD700]/5 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-400' :
                          tx.type === 'withdrawal' ? 'bg-rose-500/20 text-rose-400' :
                          tx.type === 'profit' ? 'bg-cyan-500/20 text-cyan-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white font-semibold">{tx.description}</td>
                      <td className={`px-4 py-3 font-mono font-bold text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : '-'}${tx.amount.toFixed(2)} USDT
                      </td>
                      <td className="px-4 py-3 text-gray-400">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {tx.status || 'Completed'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }
}

export default TransactionsTab;
