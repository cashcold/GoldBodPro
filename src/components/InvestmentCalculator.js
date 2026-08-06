import React, { Component } from 'react';
import { Calculator, ArrowRight, DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.js';

class InvestmentCalculator extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      amount: 1000,
      selectedPlanIndex: 2 // Default to Gold Plan
    };

    this.plans = [
      { name: 'Starter Plan (24 Hours)', profitPercent: 5, duration: 1, min: 50, max: 399 },
      { name: 'Silver Plan (3 Days)', profitPercent: 12, duration: 3, min: 400, max: 999 },
      { name: 'Gold Plan (5 Days)', profitPercent: 15, duration: 5, min: 1000, max: 1700 },
      { name: 'Diamond Plan (7 Days)', profitPercent: 20, duration: 7, min: 1700, max: 2500 }
    ];
  }

  handlePlanChange = (e) => {
    const idx = Number(e.target.value);
    const plan = this.plans[idx];
    this.setState({
      selectedPlanIndex: idx,
      amount: plan.min
    });
  };

  handleAmountChange = (e) => {
    this.setState({ amount: Number(e.target.value) });
  };

  render() {
    const { amount, selectedPlanIndex } = this.state;
    const { user, openAuthModal } = this.context;
    const plan = this.plans[selectedPlanIndex];

    const netProfit = (amount * (plan.profitPercent / 100));
    const totalReturn = amount + netProfit;
    const dailyProfit = netProfit / plan.duration;

    return (
      <section className="py-16 bg-[#090E18] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-[#0F172A]/90 backdrop-blur-2xl border border-[#FFD700]/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#090E18] border border-[#FFD700]/30 text-xs font-bold text-[#FFD700] uppercase mb-2">
                <Calculator className="w-4 h-4" /> ROI Profit Simulator
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Investment <span className="text-gold-gradient">Calculator</span>
              </h2>
              <p className="text-sm text-gray-300 mt-2">
                Estimate your exact cryptocurrency return before activating any mining plan.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Inputs Column */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Select Plan */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Select Investment Plan
                  </label>
                  <select
                    value={selectedPlanIndex}
                    onChange={this.handlePlanChange}
                    className="w-full bg-[#090E18] border border-amber-500/30 rounded-2xl px-4 py-3.5 text-white font-medium focus:border-[#FFD700] focus:outline-none"
                  >
                    {this.plans.map((p, idx) => (
                      <option key={idx} value={idx}>
                        {p.name} — +{p.profitPercent}% Return
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Slider & Number Input */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Investment Amount (USDT)
                    </label>
                    <span className="text-xs font-mono font-bold text-[#FFD700]">
                      Limit: ${plan.min} - ${plan.max}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={plan.min}
                    max={plan.max}
                    step={10}
                    value={amount}
                    onChange={this.handleAmountChange}
                    className="w-full accent-[#FFD700] bg-slate-800 h-2.5 rounded-lg cursor-pointer mb-3"
                  />

                  <div className="relative">
                    <input
                      type="number"
                      min={plan.min}
                      max={plan.max}
                      value={amount}
                      onChange={this.handleAmountChange}
                      className="w-full bg-[#090E18] border border-amber-500/30 rounded-2xl px-4 py-3 text-white font-mono text-lg font-bold focus:border-[#FFD700] focus:outline-none"
                    />
                    <span className="absolute right-4 top-3.5 text-sm font-bold text-[#FFD700]">USDT</span>
                  </div>
                </div>

              </div>

              {/* Outputs Summary Card Column */}
              <div className="lg:col-span-5 bg-[#090E18] border border-amber-500/30 rounded-2xl p-6 space-y-4">
                
                <div className="text-center pb-4 border-b border-slate-800">
                  <span className="text-xs font-semibold text-gray-400 uppercase">Estimated Total Return</span>
                  <div className="text-3xl font-black text-gold-gradient font-mono mt-1">
                    ${totalReturn.toFixed(2)} USDT
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">100% Principal Returned</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Deposit Principal:</span>
                    <span className="font-mono font-bold text-white">${amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Plan Duration:</span>
                    <span className="font-mono font-bold text-amber-400">{plan.duration} Days</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Daily Profit Estimate:</span>
                    <span className="font-mono font-bold">+${dailyProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Total Net Profit (+{plan.profitPercent}%):</span>
                    <span className="font-mono font-bold">+${netProfit.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => user ? window.location.href = '/dashboard' : openAuthModal('register')}
                  className="btn-gold w-full py-3 text-xs uppercase font-bold tracking-wider mt-2"
                >
                  <span>Start This Investment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>

        </div>
      </section>
    );
  }
}

export default InvestmentCalculator;
