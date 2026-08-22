import React, { Component } from 'react';
import api from '../../services/api.js';
import { TrendingUp, Clock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Zap, DollarSign, Wallet } from 'lucide-react';

const DEFAULT_PLANS = [
  { id: 'plan_1', name: 'Starter Plan', badge: '24H Fast ROI', minAmount: 50, maxAmount: 1000, profitPercent: 5, durationDays: 1, capitalReturn: true },
  { id: 'plan_2', name: 'Silver Plan', badge: 'Most Popular', minAmount: 400, maxAmount: 10000, profitPercent: 12, durationDays: 3, capitalReturn: true },
  { id: 'plan_3', name: 'Gold Plan', badge: 'High Yield', minAmount: 1000, maxAmount: 50000, profitPercent: 15, durationDays: 5, capitalReturn: true },
  { id: 'plan_4', name: 'Diamond Plan', badge: 'VIP Elite', minAmount: 1700, maxAmount: 1000000, profitPercent: 20, durationDays: 7, capitalReturn: true }
];

class InvestmentsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amounts: {},
      submittingPlanId: null,
      claimingId: null,
      msg: null,
      error: null
    };
  }

  handleAmountChange = (planId, val) => {
    this.setState((prevState) => ({
      amounts: {
        ...prevState.amounts,
        [planId]: val
      }
    }));
  };

  handleClaimPayout = async (invId) => {
    const { refresh } = this.props;
    this.setState({ claimingId: invId, msg: null, error: null });

    try {
      const res = await api.post(`/user/claim-investment/${invId}`);
      this.setState({
        claimingId: null,
        msg: res.data.message || 'Payout successfully credited to your available balance!'
      });
      if (refresh) refresh();
    } catch (err) {
      this.setState({
        claimingId: null,
        error: err.response?.data?.error || 'Failed to claim payout.'
      });
    }
  };

  handleInvest = async (plan) => {
    const { amounts } = this.state;
    const { refresh } = this.props;

    const rawVal = amounts[plan.id];
    const chosenAmount = (rawVal !== undefined && rawVal !== '' && !isNaN(Number(rawVal)))
      ? Number(rawVal)
      : plan.minAmount;

    this.setState({ submittingPlanId: plan.id, msg: null, error: null });

    try {
      const res = await api.post('/user/invest', {
        planId: plan.id,
        amount: chosenAmount
      });

      this.setState({
        submittingPlanId: null,
        msg: res.data.message || `Successfully activated ${plan.name} for $${chosenAmount} USDT!`
      });

      if (refresh) refresh();

    } catch (err) {
      this.setState({
        submittingPlanId: null,
        error: err.response?.data?.error || 'Investment activation failed. Please check your balance.'
      });
    }
  };

  render() {
    const { data = {}, setTab } = this.props;
    const { amounts, submittingPlanId, claimingId, msg, error } = this.state;
    const { user = {}, plans = [], activeInvestments = [] } = data;
    const displayPlans = (plans && plans.length > 0) ? plans : DEFAULT_PLANS;
    const runningContracts = activeInvestments.filter(i => i.status === 'active');
    const completedContracts = activeInvestments.filter(i => i.status === 'completed');

    return (
      <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto">
        
        {/* Header and User Balance Summary */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30">
              <Zap className="w-3.5 h-3.5 fill-[#FFD700]" />
              Investment Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Investment Plans & Active Contracts</h2>
            <p className="text-xs text-gray-300">
              Select an investment package to activate daily interest yields automatically added to your available account balance.
            </p>
          </div>

          <div className="bg-[#090E18] border border-[#FFD700]/40 rounded-2xl p-4 shrink-0 min-w-[220px]">
            <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-[#FFD700]" />
              Available Balance
            </p>
            <p className="text-2xl font-black text-gold-gradient font-mono mt-1">${(Number(user.balance || 0)).toFixed(2)} USDT</p>
            {Number(user.balance || 0) === 0 && (
              <button
                onClick={() => setTab('deposit')}
                className="mt-2 text-[11px] font-bold text-amber-400 hover:underline block"
              >
                + Deposit Funds to Invest →
              </button>
            )}
          </div>
        </div>

        {msg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Active Running Contracts Section */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FFD700]" />
              Your Running Contracts ({runningContracts.length})
            </h3>
            {runningContracts.some(i => (i.endDate ? new Date(i.endDate).getTime() : 0) <= Date.now()) && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                Payouts Ready to Claim!
              </span>
            )}
          </div>

          {runningContracts.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#090E18] border border-dashed border-amber-500/20 text-center space-y-1">
              <p className="text-xs text-gray-400">You currently have no active investments. Select a plan below to activate your contract.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {runningContracts.map((inv) => {
                const startMs = inv.startDate ? new Date(inv.startDate).getTime() : Date.now();
                const endMs = inv.endDate
                  ? new Date(inv.endDate).getTime()
                  : startMs + (inv.durationDays || 1) * 24 * 3600 * 1000;

                const startDate = new Date(startMs);
                const endDate = new Date(endMs);
                const now = new Date();

                const timeStr = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                const dateStr = endDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

                const isToday = endDate.toDateString() === now.toDateString();
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const isTomorrow = endDate.toDateString() === tomorrow.toDateString();
                const isMatured = Date.now() >= endMs;

                let relativeDay = dateStr;
                if (isMatured) relativeDay = 'Matured / Ready to Cashout';
                else if (isToday) relativeDay = 'Today';
                else if (isTomorrow) relativeDay = 'Tomorrow';

                const fullMaturity = `${dateStr} at ${timeStr}`;
                const relativeMaturity = isMatured ? 'Ready Now' : `${relativeDay} by ${timeStr}`;
                const isClaiming = claimingId === inv.id;

                return (
                  <div key={inv.id} className="p-5 rounded-2xl bg-[#090E18] border border-amber-500/30 space-y-3 shadow-lg flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 uppercase">
                            {inv.planName}
                          </span>
                          <h4 className="text-xl font-black text-white mt-1 font-mono">${(Number(inv.amount || 0)).toFixed(2)} USDT</h4>
                        </div>
                        {isMatured ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 animate-pulse">
                            READY TO CASHOUT
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                            ACTIVE YIELDING
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-gray-300">
                        <div className="flex justify-between">
                          <span>Profit Rate:</span>
                          <span className="font-bold text-emerald-400">+{inv.profitPercent}% Return</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Total Return:</span>
                          <span className="font-mono font-bold text-[#FFD700]">${(Number(inv.totalReturn || 0)).toFixed(2)} USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Start Time:</span>
                          <span className="text-gray-300 font-medium">
                            {startDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                        </div>
                      </div>

                      {/* Prominent Exact Cashout Time Card */}
                      <div className={`p-3.5 rounded-xl border space-y-1.5 text-xs ${isMatured ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-amber-500/10 border-amber-500/30'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-extrabold uppercase tracking-wider text-[10px] flex items-center gap-1.5 ${isMatured ? 'text-emerald-400' : 'text-amber-400'}`}>
                            <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
                            {isMatured ? 'Payout Status:' : 'Expected Cashout Time:'}
                          </span>
                          <span className="text-[#FFD700] font-black font-mono bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/20">
                            {isMatured ? 'Available Now' : relativeMaturity}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-300 border-t border-amber-500/20 pt-1.5">
                          <span className="text-gray-400">Exact Date & Time:</span>
                          <span className="text-white font-bold font-mono">{fullMaturity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Claim Button or Progress bar */}
                    {isMatured ? (
                      <button
                        onClick={() => this.handleClaimPayout(inv.id)}
                        disabled={isClaiming}
                        className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-amber-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-xl transition-all"
                      >
                        {isClaiming ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Claim Payout (${inv.totalReturn?.toFixed(2)} USDT)</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden pt-0.5 mt-2">
                        <div className="bg-gradient-to-r from-amber-500 to-[#FFD700] h-full w-full rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Contracts Section */}
        {completedContracts.length > 0 && (
          <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Completed & Paid Out Contracts ({completedContracts.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedContracts.map((inv) => (
                <div key={inv.id} className="p-4 rounded-2xl bg-[#090E18] border border-emerald-500/20 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {inv.planName}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                      COMPLETED & PAID
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Principal + Profit:</span>
                    <span className="font-mono font-black text-emerald-300 text-sm">${inv.totalReturn?.toFixed(2)} USDT</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-gray-400 border-t border-slate-800 pt-1.5">
                    <span>Matured Date:</span>
                    <span className="font-mono text-gray-300">{inv.endDate ? new Date(inv.endDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Completed'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscribe to New Plan Grid */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Available Investment Plans</h3>
            <span className="text-xs text-gray-400">Choose plan & enter investment amount</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayPlans.map((plan) => {
              const currentVal = amounts[plan.id] !== undefined ? amounts[plan.id] : plan.minAmount;
              const numericVal = Number(currentVal || plan.minAmount);
              const estReturn = numericVal + (numericVal * (plan.profitPercent / 100));
              const isSubmitting = submittingPlanId === plan.id;
              const hasEnoughBalance = user.balance >= plan.minAmount;

              return (
                <div
                  key={plan.id}
                  className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-[#FFD700] transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 uppercase">
                        {plan.name}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {plan.durationDays} Days
                      </span>
                    </div>

                    <div className="text-3xl font-black text-gold-gradient font-mono">
                      +{plan.profitPercent}%
                    </div>

                    <div className="space-y-2 text-xs text-gray-300 border-t border-slate-800 pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Min Investment:</span>
                        <span className="font-mono font-bold text-white">${plan.minAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Investment:</span>
                        <span className="font-mono font-bold text-white">${plan.maxAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estimated Total Return:</span>
                        <span className="font-mono font-bold text-emerald-400">${estReturn.toFixed(2)} USDT</span>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-1 pt-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Enter Investment Amount ($):</label>
                      <input
                        type="number"
                        min={plan.minAmount}
                        max={plan.maxAmount}
                        value={currentVal}
                        onChange={(e) => this.handleAmountChange(plan.id, e.target.value)}
                        className="w-full bg-[#090E18] border border-slate-700 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    {!hasEnoughBalance ? (
                      <button
                        onClick={() => setTab('deposit')}
                        className="w-full py-2.5 rounded-2xl bg-slate-800 text-gray-400 border border-slate-700 text-xs font-bold hover:text-white transition-all flex items-center justify-center gap-1.5"
                      >
                        <DollarSign className="w-4 h-4 text-amber-400" />
                        <span>Deposit Funds (${plan.minAmount} Min)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => this.handleInvest(plan)}
                        disabled={isSubmitting || numericVal > user.balance || numericVal < plan.minAmount}
                        className="btn-gold w-full py-2.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Zap className="w-4 h-4 fill-black" />
                            <span>Activate Contract</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }
}

export default InvestmentsTab;
