import React, { Component } from 'react';
import { UserPlus, Wallet, ShoppingBag, TrendingUp, ChevronRight } from 'lucide-react';

class HowItWorks extends Component {
  render() {
    const steps = [
      {
        step: 'Step 1',
        title: 'Create Account',
        desc: 'Sign up for free in 30 seconds and receive an instant $5 welcome bonus.',
        icon: UserPlus
      },
      {
        step: 'Step 2',
        title: 'Deposit Funds',
        desc: 'Choose your preferred gateway: BTC, ETH, or USDT (TRC20/BEP20/ERC20).',
        icon: Wallet
      },
      {
        step: 'Step 3',
        title: 'Purchase Investment Plan',
        desc: 'Select a plan (Starter, Silver, Gold, or Diamond) according to your capital.',
        icon: ShoppingBag
      },
      {
        step: 'Step 4',
        title: 'Receive Daily Profit',
        desc: 'Watch your earnings grow automatically with instant withdrawal payouts.',
        icon: TrendingUp
      }
    ];

    return (
      <section className="py-20 bg-[#090E18] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#FFD700]/30 text-xs font-semibold text-[#FFD700] uppercase mb-3">
              Simple 4-Step Process
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              How To Start <span className="text-gold-gradient">Earning Profit</span>
            </h2>
            <p className="mt-4 text-gray-300 text-sm sm:text-base">
              Start generating passive cryptocurrency returns in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((st, idx) => {
              const IconComponent = st.icon;
              return (
                <div key={idx} className="relative">
                  <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl p-7 text-center hover:border-[#FFD700] transition-all duration-300 shadow-xl h-full flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/30 mb-4">
                        {st.step}
                      </span>
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] mx-auto mb-5">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{st.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-[#FFD700]">
                      <ChevronRight className="w-8 h-8 opacity-70" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>
    );
  }
}

export default HowItWorks;
