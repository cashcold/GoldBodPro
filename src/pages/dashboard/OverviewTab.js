import React, { Component } from 'react';
import api from '../../services/api.js';
import AffiliateMilestoneCard from '../../components/AffiliateMilestoneCard.js';
import {
  Wallet,
  TrendingUp,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  Users,
  Clock,
  Sparkles,
  Zap,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const DEFAULT_PLANS = [
  { id: 'plan_1', name: 'Starter Plan', badge: '24H Fast ROI', minAmount: 50, maxAmount: 1000, profitPercent: 5, durationDays: 1, capitalReturn: true },
  { id: 'plan_2', name: 'Silver Plan', badge: 'Most Popular', minAmount: 400, maxAmount: 10000, profitPercent: 12, durationDays: 3, capitalReturn: true },
  { id: 'plan_3', name: 'Gold Plan', badge: 'High Yield', minAmount: 1000, maxAmount: 50000, profitPercent: 15, durationDays: 5, capitalReturn: true },
  { id: 'plan_4', name: 'Diamond Plan', badge: 'VIP Elite', minAmount: 1700, maxAmount: 1000000, profitPercent: 20, durationDays: 7, capitalReturn: true }
];

class OverviewTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amounts: {},
      submittingPlanId: null,
      investSuccessMsg: null,
      investErrMsg: null
    };
  }

  handleAmountChange = (planId, value) => {
    this.setState((prevState) => ({
      amounts: {
        ...prevState.amounts,
        [planId]: value
      }
    }));
  };

  handleQuickInvest = async (plan) => {
    const { refresh } = this.props;
    const { amounts } = this.state;
    const rawVal = amounts[plan.id];
    const amountToInvest = (rawVal !== undefined && rawVal !== '' && !isNaN(Number(rawVal)))
      ? Number(rawVal)
      : plan.minAmount;

    this.setState({ submittingPlanId: plan.id, investSuccessMsg: null, investErrMsg: null });

    try {
      const res = await api.post('/user/invest', {
        planId: plan.id,
        amount: amountToInvest
      });

      this.setState({
        submittingPlanId: null,
        investSuccessMsg: res.data.message || `Successfully activated ${plan.name} for $${amountToInvest} USDT!`
      });

      if (refresh) refresh();
    } catch (err) {
      this.setState({
        submittingPlanId: null,
        investErrMsg: err.response?.data?.error || 'Investment activation failed. Please check your balance.'
      });
    }
  };

  render() {
    const { data = {}, setTab } = this.props;
    const { user = {}, activeInvestments = [], plans = [] } = data;
    const displayPlans = (plans && plans.length > 0) ? plans : DEFAULT_PLANS;
    const { amounts, submittingPlanId, investSuccessMsg, investErrMsg } = this.state;

    const cards = [
      {
        title: 'Current Balance',
        value: `$${user.balance?.toFixed(2)}`,
        icon: Wallet,
        color: 'from-[#FFD700]/20 via-amber-500/10 to-amber-600/5',
        borderColor: 'border-[#FFD700]/40',
        textColor: 'text-gold-gradient'
      },
      {
        title: 'Active Investments',
        value: `$${user.activeInvestment?.toFixed(2)}`,
        icon: TrendingUp,
        color: 'from-emerald-500/20 to-emerald-600/10',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-400'
      },
      {
        title: "Today's Profit",
        value: `+$${user.todaysProfit?.toFixed(2)}`,
        icon: DollarSign,
        color: 'from-cyan-500/20 to-cyan-600/10',
        borderColor: 'border-cyan-500/30',
        textColor: 'text-cyan-400'
      },
      {
        title: 'Total Earnings',
        value: `$${user.totalProfit?.toFixed(2)}`,
        icon: Sparkles,
        color: 'from-purple-500/20 to-purple-600/10',
        borderColor: 'border-purple-500/30',
        textColor: 'text-purple-400'
      },
      {
        title: 'Referral Income',
        value: `$${user.referralIncome?.toFixed(2)}`,
        icon: Users,
        color: 'from-rose-500/20 to-rose-600/10',
        borderColor: 'border-rose-500/30',
        textColor: 'text-rose-400'
      },
      {
        title: 'Pending Withdrawals',
        value: `$${user.pendingWithdrawals?.toFixed(2)}`,
        icon: Clock,
        color: 'from-slate-500/20 to-slate-600/10',
        borderColor: 'border-slate-500/30',
        textColor: 'text-gray-300'
      }
    ];

    return (
      <div className="space-y-8 animate-in fade-in">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#0F172A] border border-[#FFD700]/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30">
              Verified Investor Account
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-gold-gradient">{user.name}</span>!
            </h2>
            <p className="text-xs text-gray-300 max-w-xl">
              Available Balance: <strong className="text-[#FFD700]">${user.balance?.toFixed(2)} USDT</strong>. Activate a plan below to start generating daily yield!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setTab('deposit')}
              className="btn-gold text-xs py-3 px-5 font-bold flex items-center gap-2"
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>Deposit Funds</span>
            </button>
            <button
              onClick={() => setTab('withdraw')}
              className="btn-outline-gold text-xs py-3 px-5 font-bold flex items-center gap-2"
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Request Payout</span>
            </button>
          </div>
        </div>

        {/* Global Investment Alert Feedback */}
        {investSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{investSuccessMsg}</span>
          </div>
        )}

        {investErrMsg && (
          <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{investErrMsg}</span>
          </div>
        )}

        {/* 6 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => {
            const IconComponent = c.icon;
            return (
              <div
                key={i}
                className={`bg-gradient-to-br ${c.color} bg-[#0F172A]/90 backdrop-blur-xl border ${c.borderColor} rounded-3xl p-6 shadow-xl flex items-center justify-between`}
              >
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{c.title}</p>
                  <p className={`text-2xl font-black font-mono mt-2 ${c.textColor}`}>{c.value}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#090E18] border border-amber-500/20 flex items-center justify-center text-[#FFD700]">
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Gamified Affiliate Milestone Progress Bar */}
        <AffiliateMilestoneCard user={user} referrals={data.referrals || []} setTab={setTab} />

        {/* Active Investment Contracts Section */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#FFD700]" />
                Active Investment Contracts ({activeInvestments.length})
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Your running yield contracts automatically add interest profits daily.
              </p>
            </div>
            <button
              onClick={() => setTab('investments')}
              className="px-4 py-2 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold hover:bg-[#FFD700]/20 transition-all self-start sm:self-auto"
            >
              View Full Plans Center →
            </button>
          </div>

          {activeInvestments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeInvestments.map((inv) => {
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

                let relativeDay = dateStr;
                if (isToday) relativeDay = 'Today';
                else if (isTomorrow) relativeDay = 'Tomorrow';

                const fullMaturity = `${dateStr} at ${timeStr}`;
                const relativeMaturity = `${relativeDay} by ${timeStr}`;
                const isMatured = Date.now() >= endMs;

                return (
                  <div key={inv.id} className="p-5 rounded-2xl bg-[#090E18] border border-amber-500/30 space-y-3 shadow-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 uppercase">
                          {inv.planName}
                        </span>
                        <h4 className="text-xl font-black text-white mt-1 font-mono">${inv.amount?.toFixed(2)} USDT</h4>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                        ACTIVE YIELDING
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-300">
                      <div className="flex justify-between">
                        <span>Profit Rate:</span>
                        <span className="font-bold text-emerald-400">+{inv.profitPercent}% Return</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Total Return:</span>
                        <span className="font-mono font-bold text-[#FFD700]">${inv.totalReturn?.toFixed(2)} USDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="text-gray-300 font-semibold">{inv.durationDays} Day{inv.durationDays > 1 ? 's' : ''} ({inv.durationDays * 24} Hours)</span>
                      </div>
                    </div>

                    {/* Prominent Exact Cashout Time Card */}
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-extrabold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
                          {isMatured ? 'Payout Ready:' : 'Expected Cashout Time:'}
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

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden pt-0.5">
                      <div className="bg-gradient-to-r from-amber-500 to-[#FFD700] h-full w-full rounded-full animate-pulse" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#090E18] border border-dashed border-amber-500/30 text-center space-y-2">
              <Zap className="w-8 h-8 text-[#FFD700] mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-white">No Active Investment Contracts Found</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                You currently have no active investment package. Choose a plan below to activate your contract using your available balance (<span className="text-[#FFD700] font-bold">${user.balance?.toFixed(2)} USDT</span>).
              </p>
            </div>
          )}

          {/* Quick Investment Activation Section */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold uppercase text-[#FFD700] tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Select A Plan To Activate Now
              </h4>
              <span className="text-xs text-gray-400 font-mono">
                Your Balance: <strong className="text-white">${user.balance?.toFixed(2)} USDT</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayPlans.map((plan) => {
                const currentVal = amounts[plan.id] !== undefined ? amounts[plan.id] : plan.minAmount;
                const canAffordMin = user.balance >= plan.minAmount;
                const isSubmitting = submittingPlanId === plan.id;

                return (
                  <div
                    key={plan.id}
                    className="bg-[#090E18] border border-[#FFD700]/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-[#FFD700] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 uppercase">
                          {plan.name}
                        </span>
                        <span className="text-xs font-black text-emerald-400 font-mono">+{plan.profitPercent}%</span>
                      </div>

                      <div className="text-xs text-gray-300 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Min - Max:</span>
                          <span className="font-mono text-white font-semibold">${plan.minAmount} - ${plan.maxAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-amber-300 font-semibold">{plan.durationDays} Days</span>
                        </div>
                      </div>

                      {/* Custom Amount Field */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400">Investment Amount ($):</label>
                        <input
                          type="number"
                          min={plan.minAmount}
                          max={plan.maxAmount}
                          value={currentVal}
                          onChange={(e) => this.handleAmountChange(plan.id, e.target.value)}
                          className="w-full bg-[#0F172A] border border-slate-700 focus:border-[#FFD700] rounded-xl px-3 py-1.5 text-xs text-white font-mono outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      {!canAffordMin ? (
                        <button
                          onClick={() => setTab('deposit')}
                          className="w-full py-2.5 rounded-xl bg-slate-800 text-gray-400 border border-slate-700 text-xs font-bold hover:text-white transition-all flex items-center justify-center gap-1.5"
                        >
                          <ArrowDownCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Deposit Required</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => this.handleQuickInvest(plan)}
                          disabled={isSubmitting || Number(currentVal) > user.balance}
                          className="btn-gold w-full py-2.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg"
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5 fill-black" />
                              <span>Activate Plan</span>
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

        {/* Investment Growth Chart & Mining Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Simulated Growth Chart */}
          <div className="lg:col-span-8 bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Portfolio Yield Performance</h3>
                <p className="text-xs text-gray-400">Daily Return Growth Curve</p>
              </div>
              <span className="text-xs font-mono text-[#FFD700] bg-[#FFD700]/10 px-3 py-1 rounded-full border border-[#FFD700]/30">
                +15.4% Monthly Avg
              </span>
            </div>

            {/* Visual Bar Chart Graphics */}
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 border-b border-slate-800">
              {[
                { day: 'Mon', val: 30 },
                { day: 'Tue', val: 45 },
                { day: 'Wed', val: 60 },
                { day: 'Thu', val: 55 },
                { day: 'Fri', val: 80 },
                { day: 'Sat', val: 95 },
                { day: 'Sun', val: 120 }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div
                    style={{ height: `${item.val}%` }}
                    className="w-full bg-gradient-to-t from-amber-600 via-[#FFD700] to-[#FFF085] rounded-t-xl transition-all group-hover:brightness-125 shadow-lg shadow-[#FFD700]/20"
                  />
                  <span className="text-[10px] text-gray-400 font-mono">{item.day}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 pt-4">
              <span>Automated Payouts: Enabled</span>
              <span className="text-emerald-400 font-bold">100% Guaranteed Term Returns</span>
            </div>
          </div>

          {/* Cloud Mining Quick Status Card */}
          <div className="lg:col-span-4 bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase text-gray-400">Cloud Mining Rig</span>
                <Cpu className="w-5 h-5 text-[#FFD700] animate-pulse" />
              </div>

              <div className="p-4 rounded-2xl bg-[#090E18] border border-amber-500/20 mb-4 text-center">
                <p className="text-3xl font-black text-gold-gradient font-mono">{user.hashPower} TH/s</p>
                <p className="text-[11px] text-gray-400 mt-1 uppercase font-semibold">Active Hash Power</p>
              </div>

              <div className="space-y-2 text-xs text-gray-300 mb-6">
                <div className="flex justify-between">
                  <span>Daily Yield Est:</span>
                  <span className="font-mono font-bold text-emerald-400">+${(user.hashPower * 0.10).toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Center:</span>
                  <span className="font-semibold text-white">Zurich #04</span>
                </div>
                <div className="flex justify-between">
                  <span>Hardware Health:</span>
                  <span className="font-bold text-emerald-400">99.9% Optimal</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setTab('mining')}
              className="btn-gold w-full text-xs py-2.5 font-bold uppercase"
            >
              Upgrade Hash Rate
            </button>
          </div>

        </div>

      </div>
    );
  }
}

export default OverviewTab;
