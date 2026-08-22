import React, { Component } from 'react';
import api from '../../services/api.js';
import { ArrowUpCircle, ShieldCheck, AlertCircle, Clock, CheckCircle2, Zap, Wallet } from 'lucide-react';

class WithdrawTab extends Component {
  constructor(props) {
    super(props);
    const userBal = props.data?.user?.balance || 0;
    this.state = {
      gateway: 'USDT TRC20',
      walletAddress: 'TX9K4fJ2b1g8pQ3L9m1vZ8W7x6y5z4a3b2',
      amount: userBal > 0 ? Number(userBal.toFixed(2)) : 50,
      submitting: false,
      successMsg: null,
      errorMsg: null
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data?.user?.balance !== this.props.data?.user?.balance) {
      const userBal = this.props.data?.user?.balance || 0;
      if (this.state.amount === 0 || this.state.amount > userBal) {
        this.setState({ amount: Number(userBal.toFixed(2)) });
      }
    }
  }

  handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const { amount, gateway, walletAddress } = this.state;
    const { refresh, data } = this.props;
    const userBal = data?.user?.balance || 0;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      this.setState({ errorMsg: 'Please enter a valid withdrawal amount.' });
      return;
    }

    if (numAmount < 5) {
      this.setState({ errorMsg: 'Minimum withdrawal amount is $5.00 USDT.' });
      return;
    }

    if (numAmount > userBal) {
      this.setState({ errorMsg: `Amount exceeds available balance ($${userBal.toFixed(2)} USDT).` });
      return;
    }

    this.setState({ submitting: true, successMsg: null, errorMsg: null });

    try {
      const res = await api.post('/user/withdraw', {
        amount: numAmount,
        gateway,
        walletAddress: walletAddress.trim()
      });

      this.setState({
        submitting: false,
        successMsg: res.data.message || `Withdrawal request for $${numAmount.toFixed(2)} USDT submitted successfully!`
      });

      if (refresh) refresh();

    } catch (err) {
      this.setState({
        submitting: false,
        errorMsg: err.response?.data?.error || 'Withdrawal request failed. Please check your balance and try again.'
      });
    }
  };

  setAmountPercentage = (pct) => {
    const { data } = this.props;
    const bal = data?.user?.balance || 0;
    const calculated = +(bal * pct).toFixed(2);
    this.setState({ amount: Math.max(5, calculated) });
  };

  render() {
    const { data } = this.props;
    const { gateway, walletAddress, amount, submitting, successMsg, errorMsg } = this.state;
    const { user, withdrawals } = data;

    const availableBalance = Number(user.balance || 0);
    const netPayout = Math.max(0, Number(amount || 0));

    return (
      <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
        
        <div>
          <h2 className="text-2xl font-black text-white">Instant Withdrawal Requests</h2>
          <p className="text-xs text-gray-400 mt-1">
            Withdraw profit, welcome bonus, and mining yields directly to your crypto wallet. Automated processing settles in 5 to 15 minutes.
          </p>
        </div>

        {/* Withdrawal Form Card */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-[#090E18] border border-amber-500/30 gap-4">
            <div>
              <span className="text-xs text-gray-400 font-medium">Withdrawable Balance</span>
              <p className="text-3xl font-black text-gold-gradient font-mono mt-0.5">
                ${availableBalance.toFixed(2)} USDT
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold w-fit">
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Instant Payouts Enabled</span>
            </div>
          </div>

          {availableBalance >= 5 ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-200 uppercase">Direct Payout Active — No Deposit Required</p>
                <p className="mt-1 text-gray-300">
                  Your funds, welcome bonus, mining earnings, and investment profits (${availableBalance.toFixed(2)} USDT) are 100% unlocked for instant cashout with zero platform fees.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-200 uppercase">Minimum Withdrawal: $5.00 USDT</p>
                <p className="mt-1 text-gray-300">
                  You currently have ${availableBalance.toFixed(2)} USDT available. Harvest your cloud mining yield or make a deposit to top up your balance.
                </p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={this.handleWithdrawSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Select Gateway / Network</label>
                <select
                  value={gateway}
                  onChange={(e) => this.setState({ gateway: e.target.value })}
                  className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                >
                  <option value="USDT TRC20">Tether USDT (TRC20)</option>
                  <option value="USDT BEP20">Tether USDT (BEP20 / BSC)</option>
                  <option value="Bitcoin">Bitcoin (BTC Network)</option>
                  <option value="Ethereum">Ethereum (ERC20)</option>
                  <option value="BNB">BNB (Binance Smart Chain)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-300 uppercase">Withdrawal Amount (USDT)</label>
                  <span className="text-[11px] text-amber-400 font-mono">Max: ${availableBalance.toFixed(2)}</span>
                </div>
                <input
                  type="number"
                  step="any"
                  min={5}
                  max={availableBalance > 0 ? availableBalance : 100000}
                  required
                  value={amount}
                  onChange={(e) => this.setState({ amount: e.target.value })}
                  className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-[#FFD700] focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Percentage Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-gray-400 font-medium mr-1">Quick Select:</span>
              {[
                { label: '25%', val: 0.25 },
                { label: '50%', val: 0.50 },
                { label: '75%', val: 0.75 },
                { label: `Max ($${availableBalance.toFixed(2)})`, val: 1.0 }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => this.setAmountPercentage(chip.val)}
                  className="px-3 py-1 rounded-lg bg-[#090E18] hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-semibold transition"
                >
                  {chip.label}
                </button>
              ))}
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
                <span>Requested Cashout Amount:</span>
                <span className="font-mono font-bold text-white">${Number(amount || 0).toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Withdrawal Processing Fee:</span>
                <span className="font-mono font-bold">0.00 USDT (FREE / 0% Fee)</span>
              </div>
              <div className="flex justify-between text-[#FFD700] pt-2 border-t border-slate-800 font-bold text-sm">
                <span>Net Settlement to Wallet:</span>
                <span className="font-mono">${(Number(netPayout || 0)).toFixed(2)} USDT</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || availableBalance < 5}
              className="btn-gold w-full py-4 text-xs font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ArrowUpCircle className="w-5 h-5" />
              {submitting ? 'Processing Payout Request...' : `Cash Out $${Number(amount || 0).toFixed(2)} USDT Now`}
            </button>
          </form>

        </div>

        {/* Withdrawal Requests Log */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">My Withdrawal History</h3>
            <span className="text-xs text-gray-400 font-mono">{withdrawals?.length || 0} Total Requests</span>
          </div>

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
                {withdrawals && withdrawals.length > 0 ? (
                  withdrawals.map((w) => (
                    <tr key={w.id}>
                      <td className="px-4 py-3 font-bold text-amber-400">{w.gateway}</td>
                      <td className="px-4 py-3 font-mono font-bold text-white">${(Number(w.amount || 0)).toFixed(2)}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                      No withdrawal requests yet. Your submitted cashouts will appear here with live settlement status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }
}

export default WithdrawTab;

