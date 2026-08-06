import React, { Component } from 'react';
import api from '../../services/api.js';
import { ArrowUpCircle, ShieldCheck, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

class WithdrawTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gateway: 'USDT TRC20',
      walletAddress: 'TX9K4fJ2b1g8pQ3L9m1vZ8W7x6y5z4a3b2',
      amount: 100,
      submitting: false,
      successMsg: null,
      errorMsg: null
    };
  }

  handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const { amount, gateway, walletAddress } = this.state;
    const { refresh } = this.props;

    this.setState({ submitting: true, successMsg: null, errorMsg: null });

    try {
      const res = await api.post('/user/withdraw', {
        amount: Number(amount),
        gateway,
        walletAddress
      });

      this.setState({
        submitting: false,
        successMsg: res.data.message
      });

      if (refresh) refresh();

    } catch (err) {
      this.setState({
        submitting: false,
        errorMsg: err.response?.data?.error || 'Withdrawal request failed.'
      });
    }
  };

  render() {
    const { data } = this.props;
    const { gateway, walletAddress, amount, submitting, successMsg, errorMsg } = this.state;
    const { user, withdrawals, deposits } = data;

    const availableBalance = user.balance || 0;
    const netPayout = Math.max(0, Number(amount || 0));
    const hasApprovedDeposit = deposits?.some(d => d.status === 'approved');

    return (
      <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
        
        <div>
          <h2 className="text-2xl font-black text-white">Instant Withdrawal Requests</h2>
          <p className="text-xs text-gray-400 mt-1">
            Withdraw profit directly to your crypto wallet. Automated processing usually settles in 5 to 15 minutes.
          </p>
        </div>

        {/* Withdrawal Form Card */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090E18] border border-amber-500/30">
            <div>
              <span className="text-xs text-gray-400 font-medium">Withdrawable Balance</span>
              <p className="text-2xl font-black text-gold-gradient font-mono mt-0.5">
                ${availableBalance.toFixed(2)} USDT
              </p>
            </div>
            <ShieldCheck className="w-8 h-8 text-[#FFD700]" />
          </div>

          {!hasApprovedDeposit && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-200 uppercase">First Deposit Requirement Active</p>
                <p className="mt-1 text-gray-300">
                  To cash out funds or your welcome bonus, you must make your first deposit. Please visit the Deposit tab to make a deposit and activate instant cashout.
                </p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={this.handleWithdrawSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Select Gateway</label>
                <select
                  value={gateway}
                  onChange={(e) => this.setState({ gateway: e.target.value })}
                  className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                >
                  <option value="USDT TRC20">USDT (TRC20)</option>
                  <option value="Bitcoin">Bitcoin (BTC)</option>
                  <option value="Ethereum">Ethereum (ETH)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Withdrawal Amount (USDT)</label>
                <input
                  type="number"
                  min={10}
                  max={availableBalance}
                  required
                  value={amount}
                  onChange={(e) => this.setState({ amount: e.target.value })}
                  className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-[#FFD700] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                Destination Crypto Wallet Address
              </label>
              <input
                type="text"
                required
                value={walletAddress}
                onChange={(e) => this.setState({ walletAddress: e.target.value })}
                placeholder="Enter destination wallet address (e.g. 0x... or TX...)"
                className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white font-mono text-xs focus:border-[#FFD700] focus:outline-none"
              />
            </div>

            <div className="bg-[#090E18] p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Requested Amount:</span>
                <span className="font-mono font-bold text-white">${Number(amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Withdrawal Processing Fee:</span>
                <span className="font-mono font-bold">0.00 USDT (FREE)</span>
              </div>
              <div className="flex justify-between text-[#FFD700] pt-2 border-t border-slate-800 font-bold text-sm">
                <span>Net Settlement Amount:</span>
                <span className="font-mono">${netPayout.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || availableBalance < 10}
              className="btn-gold w-full py-3.5 text-xs font-bold uppercase tracking-wider"
            >
              {submitting ? 'Processing Request...' : 'Submit Withdrawal Request'}
            </button>
          </form>

        </div>

        {/* Withdrawal Requests Log */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4">My Withdrawal History</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#090E18] font-semibold text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Gateway</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Destination Wallet</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {withdrawals?.map((w) => (
                  <tr key={w.id}>
                    <td className="px-4 py-3 font-bold text-amber-400">{w.gateway}</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">${w.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 font-mono text-gray-400 truncate max-w-[150px]">{w.walletAddress}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        w.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : w.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {w.status}
                      </span>
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
}

export default WithdrawTab;
