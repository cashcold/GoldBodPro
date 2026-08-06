import React, { Component } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  ArrowDownCircle, 
  Headphones, 
  Award, 
  Globe 
} from 'lucide-react';

class WhyChooseUs extends Component {
  render() {
    const features = [
      {
        icon: Zap,
        title: 'Instant Withdrawals',
        description: 'Automated withdrawal payouts directly to your crypto wallet within minutes with zero delay.'
      },
      {
        icon: ShieldCheck,
        title: 'Encrypted Security',
        description: 'Multi-layer AES-256 encryption and air-gapped cold storage protect 98% of platform assets.'
      },
      {
        icon: Lock,
        title: 'SSL Protection',
        description: 'EV-SSL encryption certificate ensuring safe data transmission and full user privacy.'
      },
      {
        icon: Cpu,
        title: 'Automated Cloud Mining',
        description: 'High-efficiency ASIC mining rigs running 24/7 in green-energy data centers.'
      },
      {
        icon: ArrowDownCircle,
        title: 'Fast Deposits',
        description: 'Supports Bitcoin, Ethereum, USDT TRC20/BEP20, and instant Mobile Money gateways.'
      },
      {
        icon: Headphones,
        title: '24/7 Customer Support',
        description: 'Dedicated multi-lingual live support team ready to assist you anytime via ticket or email.'
      },
      {
        icon: Award,
        title: 'Experienced Team',
        description: 'Over 15 years of combined expertise in quantitative crypto trading and hardware optimization.'
      },
      {
        icon: Globe,
        title: 'Global Investors',
        description: 'Join over 124,000 active investors from over 140 countries earning daily passive yields.'
      }
    ];

    return (
      <section className="py-20 bg-[#090E18] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#FFD700]/30 text-xs font-semibold text-[#FFD700] uppercase mb-3">
              Unmatched Advantages
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Why Choose <span className="text-gold-gradient">GoldBod Pro</span>
            </h2>
            <p className="mt-4 text-gray-300 text-sm sm:text-base">
              Built on security, transparency, and computational power to maximize your investment returns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#FFD700]/20 rounded-3xl p-6 hover:border-[#FFD700]/60 hover:scale-105 transition-all duration-300 shadow-xl group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#090E18] border border-amber-500/30 flex items-center justify-center text-[#FFD700] mb-5 group-hover:rotate-6 transition-transform">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    );
  }
}

export default WhyChooseUs;
