import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import MarketTicker from './MarketTicker.js';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Coins,
  Cpu,
  Gift
} from 'lucide-react';

class Hero extends Component {
  static contextType = AuthContext;

  render() {
    const { user, openAuthModal } = this.context;

    return (
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-[#090E18]">
        {/* Background Subtle Gradient Glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Top Security Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F172A] border border-[#FFD700]/30 shadow-lg">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#FFD700] animate-ping" />
                <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                <span className="text-xs font-semibold text-gray-200 tracking-wide uppercase">
                  Institutional Security & Cloud Hash Power
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Grow Your Crypto Wealth With{' '}
                <span className="text-gold-gradient block mt-2">
                  GoldBod Pro
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
                Join thousands of worldwide investors earning consistent passive income through our automated cryptocurrency investment plans and high-yield cloud mining infrastructure.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => user ? window.location.href = '/dashboard' : openAuthModal('register')}
                  className="btn-gold text-base py-3.5 px-8 group"
                >
                  <span>Start Investing</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#plans"
                  className="btn-outline-gold text-base py-3.5 px-8"
                >
                  <span>Investment Plans</span>
                </a>
              </div>

              {/* 2-Row Live Crypto Market Ticker Card (3 top, 3 bottom) */}
              <MarketTicker />

              {/* Welcome Bonus Claim Banner */}
              <div 
                onClick={() => user ? window.location.href = '/dashboard' : openAuthModal('register')}
                className="cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-[#FFD700]/10 to-amber-500/20 border border-[#FFD700]/40 shadow-xl hover:border-[#FFD700] hover:scale-[1.01] transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-amber-600 flex items-center justify-center text-black font-black shrink-0 shadow-lg shadow-amber-500/30">
                  <Gift className="w-6 h-6 animate-bounce" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40 uppercase tracking-wider">
                      Instant Signup Gift
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    Register to claim welcome bonus of <span className="text-[#FFD700] font-mono">$5</span>
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Create your free account today and get $5 instantly credited to your portfolio balance.
                  </p>
                </div>
                <div className="hidden sm:flex items-center text-[#FFD700] font-bold text-xs group-hover:translate-x-1 transition-transform pr-2">
                  <span>Claim Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Feature Highlights List */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FFD700] shrink-0" />
                  <span className="text-xs font-medium text-gray-300">Instant Payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FFD700] shrink-0" />
                  <span className="text-xs font-medium text-gray-300">100% Capital Return</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FFD700] shrink-0" />
                  <span className="text-xs font-medium text-gray-300">Zero Hidden Fees</span>
                </div>
              </div>

            </div>

            {/* Right Side: Animated Crypto Illustration & Floating Badges */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              
              {/* Outer Golden Glow Circle */}
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-[#FFD700]/20 via-amber-500/10 to-transparent p-1 animate-float">
                <div className="w-full h-full bg-[#0F172A]/80 backdrop-blur-xl rounded-full flex flex-col items-center justify-center border border-[#FFD700]/30 shadow-2xl relative overflow-hidden">
                  
                  {/* Central Large BTC Graphic */}
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-[#F7C948] via-[#FFD700] to-[#FFF085] p-1.5 shadow-2xl shadow-[#FFD700]/30 flex items-center justify-center">
                    <div className="w-full h-full bg-[#090E18] rounded-full flex items-center justify-center">
                      <span className="font-extrabold text-5xl sm:text-6xl text-[#FFD700] font-mono">₿</span>
                    </div>
                  </div>

                  <p className="mt-4 font-mono font-bold text-sm text-[#FFD700]">Cloud Mining Active</p>
                  <p className="text-[11px] text-gray-400">450.00 TH/s Live Stream</p>

                  {/* Gold Particles Background Glow */}
                  <div className="absolute inset-0 bg-radial from-[#FFD700]/10 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Floating Badge 1: Bitcoin BTC */}
              <div className="absolute top-2 -left-4 sm:left-0 bg-[#0F172A]/90 backdrop-blur-md border border-[#FFD700]/40 rounded-2xl p-3 shadow-2xl animate-float-slow flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-[#FFD700]">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Bitcoin Price</p>
                  <p className="text-sm font-bold text-white font-mono">$96,420.50 <span className="text-emerald-400 text-xs">+4.2%</span></p>
                </div>
              </div>

              {/* Floating Badge 2: Ethereum ETH */}
              <div className="absolute bottom-4 -right-4 sm:right-0 bg-[#0F172A]/90 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-3 shadow-2xl animate-float flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Daily Mining Profit</p>
                  <p className="text-sm font-bold text-white font-mono">Up to 20% ROI</p>
                </div>
              </div>

              {/* Floating Badge 3: USDT Stablecoin */}
              <div className="absolute bottom-1/3 -left-8 bg-[#0F172A]/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono">
                  ₮
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Instant Withdraw</p>
                  <p className="text-xs font-bold text-emerald-400">USDT TRC20 / BEP20</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    );
  }
}

export default Hero;
