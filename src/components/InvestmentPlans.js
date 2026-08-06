import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import api from '../services/api.js';
import { 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';

class InvestmentPlans extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      plans: [
        {
          id: 'plan_1',
          name: 'Starter Plan',
          badge: '24 Hours',
          minAmount: 50,
          maxAmount: 399,
          profitPercent: 5,
          durationDays: 1,
          capitalReturn: true
        },
        {
          id: 'plan_2',
          name: 'Silver Plan',
          badge: 'Most Popular',
          minAmount: 400,
          maxAmount: 999,
          profitPercent: 12,
          durationDays: 3,
          capitalReturn: true
        },
        {
          id: 'plan_3',
          name: 'Gold Plan',
          badge: 'High Yield',
          minAmount: 1000,
          maxAmount: 1700,
          profitPercent: 15,
          durationDays: 5,
          capitalReturn: true
        },
        {
          id: 'plan_4',
          name: 'Diamond Plan',
          badge: 'VIP Elite',
          minAmount: 1700,
          maxAmount: 2500,
          profitPercent: 20,
          durationDays: 7,
          capitalReturn: true
        }
      ],
      selectedPlan: null,
      investAmount: 500,
      investModalOpen: false,
      investing: false,
      investSuccessMsg: null,
      investErrMsg: null
    };
  }

  openInvestModal = (plan) => {
    const { user, openAuthModal } = this.context;
    if (!user) {
      openAuthModal('login');
      return;
    }
    this.setState({
      selectedPlan: plan,
      investAmount: plan.minAmount,
      investModalOpen: true,
      investSuccessMsg: null,
      investErrMsg: null
    });
  };

  closeInvestModal = () => {
    this.setState({ investModalOpen: false, selectedPlan: null });
  };

  handleInvestSubmit = async (e) => {
    e.preventDefault();
    const { selectedPlan, investAmount } = this.state;
    const { refreshUserData } = this.context;

    this.setState({ investing: true, investErrMsg: null, investSuccessMsg: null });

    try {
      const res = await api.post('/user/invest', {
        planId: selectedPlan.id,
        amount: Number(investAmount)
      });

      this.setState({
        investing: false,
        investSuccessMsg: res.data.message
      });
      await refreshUserData();

      setTimeout(() => {
        this.closeInvestModal();
        window.location.href = '/dashboard';
      }, 1500);

    } catch (err) {
      this.setState({
        investing: false,
        investErrMsg: err.response?.data?.error || 'Investment failed. Please check your balance.'
      });
    }
  };

  render() {
    const { plans, selectedPlan, investAmount, investModalOpen, investing, investSuccessMsg, investErrMsg } = this.state;
    const { user } = this.context;

    return (
      <section id="plans" className="py-20 bg-[#090E18] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#FFD700]/30 text-xs font-semibold text-[#FFD700] uppercase mb-3">
              <Zap className="w-4 h-4" /> Automated Profit Growth
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Premium Crypto <span className="text-gold-gradient">Investment Plans</span>
            </h2>
            <p className="mt-4 text-gray-300 text-base">
              Choose an investment plan tailored to your financial goals. Principal capital is 100% returned upon term completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => {
              const isGoldOrDiamond = plan.name.includes('Gold') || plan.name.includes('Diamond');

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-7 bg-[#0F172A]/80 backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 shadow-2xl ${
                    isGoldOrDiamond
                      ? 'border-[#FFD700] shadow-[#FFD700]/15'
                      : 'border-[#FFD700]/25 hover:border-[#FFD700]/60'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30">
                      {plan.badge}
                    </span>
                    <Sparkles className="w-5 h-5 text-[#FFD700]" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white">{plan.name}</h3>

                    {/* Big Profit Return % */}
                    <div className="my-6 py-4 px-4 rounded-2xl bg-[#090E18] border border-amber-500/20 text-center">
                      <p className="text-4xl font-black text-gold-gradient font-mono">
                        +{plan.profitPercent}%
                      </p>
                      <p className="text-xs text-gray-400 font-semibold uppercase mt-1">Total Net Profit</p>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 text-sm text-gray-300 mb-8">
                      <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-gray-400">Minimum Deposit:</span>
                        <span className="font-bold text-white font-mono">${plan.minAmount} USDT</span>
                      </li>
                      <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-gray-400">Maximum Deposit:</span>
                        <span className="font-bold text-white font-mono">${plan.maxAmount} USDT</span>
                      </li>
                      <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-gray-400">Duration Term:</span>
                        <span className="font-bold text-amber-400 font-mono">
                          {plan.durationDays === 1 ? '24 Hours' : `${plan.durationDays} Days`}
                        </span>
                      </li>
                      <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-gray-400">Capital Return:</span>
                        <span className="font-bold text-emerald-400">Yes (100%)</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-400">Withdrawal:</span>
                        <span className="font-bold text-cyan-400">Instant</span>
                      </li>
                    </ul>
                  </div>

                  {/* Invest Action Button */}
                  <button
                    onClick={() => this.openInvestModal(plan)}
                    className="btn-gold w-full text-center py-3.5 text-sm uppercase tracking-wider font-bold"
                  >
                    <span>Invest Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>

        {/* Invest Action Modal */}
        {investModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0F172A] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              
              <button
                onClick={this.closeInvestModal}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-[#FFD700] flex items-center justify-center mx-auto mb-3 border border-[#FFD700]/30">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Invest in {selectedPlan.name}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Earn +{selectedPlan.profitPercent}% in {selectedPlan.durationDays} days. Available Balance: <span className="text-emerald-400 font-bold font-mono">${user?.balance?.toFixed(2) || '0.00'}</span>
                </p>
              </div>

              {investSuccessMsg && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-semibold">
                  {investSuccessMsg}
                </div>
              )}

              {investErrMsg && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs text-center font-semibold">
                  {investErrMsg}
                </div>
              )}

              <form onSubmit={this.handleInvestSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase">
                    Enter Investment Amount (USDT)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={selectedPlan.minAmount}
                      max={selectedPlan.maxAmount}
                      value={investAmount}
                      onChange={(e) => this.setState({ investAmount: e.target.value })}
                      required
                      className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white font-mono text-base focus:border-[#FFD700] focus:outline-none"
                    />
                    <span className="absolute right-4 top-3 text-xs font-bold text-[#FFD700]">USDT</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Allowed Range: ${selectedPlan.minAmount} - ${selectedPlan.maxAmount}
                  </p>
                </div>

                {/* Calculation Summary */}
                <div className="bg-[#090E18] p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Investment Principal:</span>
                    <span className="font-mono font-bold text-white">${Number(investAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Estimated Net Profit (+{selectedPlan.profitPercent}%):</span>
                    <span className="font-mono font-bold">+${(Number(investAmount || 0) * (selectedPlan.profitPercent / 100)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#FFD700] pt-2 border-t border-slate-800 font-bold text-sm">
                    <span>Total Estimated Return:</span>
                    <span className="font-mono">${(Number(investAmount || 0) + (Number(investAmount || 0) * (selectedPlan.profitPercent / 100))).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={investing}
                  className="btn-gold w-full py-3.5 text-sm uppercase tracking-wider font-bold"
                >
                  {investing ? 'Processing Investment...' : 'Confirm & Activate Investment'}
                </button>
              </form>

            </div>
          </div>
        )}
      </section>
    );
  }
}

export default InvestmentPlans;
