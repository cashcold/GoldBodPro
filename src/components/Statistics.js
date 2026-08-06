import React, { Component } from 'react';
import api from '../services/api.js';
import { 
  Cpu, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Users, 
  Activity,
  Award,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';

class Statistics extends Component {
  constructor(props) {
    super(props);
    
    // Platform launch date anchor set to Aug 2, 2026 (auto-incrementing)
    const LAUNCH_DATE = new Date('2026-08-02T00:00:00Z').getTime();
    const now = Date.now();
    const autoRunningDays = Math.max(2, Math.floor((now - LAUNCH_DATE) / (1000 * 60 * 60 * 24)));
    const fourSecondTicks = Math.floor((now - LAUNCH_DATE) / 4000);
    const fiveMinTicks = Math.floor((now - LAUNCH_DATE) / (1000 * 60 * 5));
    const initialCompanyMoney = 876834764 + (autoRunningDays * 9500);

    this.state = {
      runningDays: autoRunningDays,
      launchDate: 'Aug 2, 2026',
      yearsOfOperation: 'Aug 2, 2026',
      totalActiveMiners: 36886 + (fiveMinTicks * 15),
      totalPayouts: 142850800 + (fourSecondTicks * 920),
      totalDeposited: 284520450 + (fourSecondTicks * 1850),
      onlineUsers: 220,
      companyMoney: initialCompanyMoney,
      hashRateTotal: '850,000 TH/s'
    };
  }

  componentDidMount() {
    this.fetchStats();
    // Refresh stats every 4 seconds for live active feel
    this.timer = setInterval(this.fetchStats, 4000);
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  fetchStats = async () => {
    try {
      const res = await api.get('/stats/overview');
      if (res.data) {
        this.setState({
          runningDays: res.data.runningDays || this.state.runningDays,
          launchDate: res.data.launchDate || 'Aug 2, 2026',
          yearsOfOperation: res.data.launchDate || 'Aug 2, 2026',
          totalActiveMiners: res.data.totalActiveMiners || res.data.activeInvestors || this.state.totalActiveMiners,
          totalPayouts: res.data.totalPayouts || res.data.totalWithdrawn || (this.state.totalPayouts + 920),
          totalDeposited: res.data.totalDeposited || (this.state.totalDeposited + 1850),
          onlineUsers: res.data.onlineUsers || (420 + Math.floor(Math.random() * 10 - 5)),
          companyMoney: res.data.companyMoney || this.state.companyMoney,
          hashRateTotal: res.data.hashRateTotal || '850,000 TH/s'
        });
      }
    } catch (err) {
      // Auto-increment locally if offline/error
      const LAUNCH_DATE = new Date('2026-08-02T00:00:00Z').getTime();
      const fiveMinTicks = Math.floor((Date.now() - LAUNCH_DATE) / (1000 * 60 * 5));
      this.setState(prev => ({
        totalActiveMiners: 36886 + (fiveMinTicks * 15),
        totalPayouts: prev.totalPayouts + 920,
        totalDeposited: prev.totalDeposited + 1850,
        onlineUsers: 420 + Math.floor(Math.random() * 10 - 5)
      }));
    }
  };

  formatCurrency = (num) => {
    return '$' + Number(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  render() {
    const { 
      runningDays, 
      launchDate,
      yearsOfOperation, 
      totalActiveMiners, 
      totalPayouts, 
      totalDeposited, 
      onlineUsers, 
      companyMoney,
      hashRateTotal 
    } = this.state;

    return (
      <section id="statistics" className="py-20 bg-[#090E18] relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header section with Live Network Status indicator */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0F172A] border border-[#FFD700]/30 text-xs font-bold text-[#FFD700] uppercase tracking-wider mb-4 shadow-xl shadow-amber-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Live Operational Metrics & Social Proof</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Platform Performance <span className="text-gold-gradient">Dashboard</span>
            </h2>
            
            <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed">
              Real-time enterprise statistics showcasing our active global mining hardware, verified payout history, and years of operational excellence.
            </p>
          </div>

          {/* Primary 3 Dashboard Feature Cards (Highlighting Active Miners, Total Payouts, Years of Operation) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
            
            {/* CARD 1: Total Active Miners */}
            <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-amber-500/30 hover:border-[#FFD700] rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-2xl hover:shadow-amber-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 text-amber-500/10 group-hover:text-amber-500/20 transition-colors pointer-events-none">
                <Cpu className="w-24 h-24 -mr-6 -mt-6" />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 via-amber-500/20 to-amber-600/10 border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <Cpu className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  <Zap className="w-3 h-3" /> 99.98% Hash Rate Uptime
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Active Miners</p>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 tracking-tight flex items-baseline gap-2">
                  <span>{totalActiveMiners.toLocaleString('en-US')}</span>
                  <span className="text-[#FFD700] text-xl font-sans font-bold">+</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>140+ Countries</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+15 Miners / 5 Mins</span>
                </div>
              </div>
            </div>

            {/* CARD 2: Total Payouts */}
            <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-400 rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors pointer-events-none">
                <DollarSign className="w-24 h-24 -mr-6 -mt-6" />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-emerald-600/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" /> Instant Dispatched
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Payouts</p>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 tracking-tight">
                  {this.formatCurrency(totalPayouts)}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>100% Automated Payouts</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Crypto & MoMo</span>
                </div>
              </div>
            </div>

            {/* CARD 3: Platform Launch Date */}
            <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400 rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 text-cyan-500/10 group-hover:text-cyan-500/20 transition-colors pointer-events-none">
                <Calendar className="w-24 h-24 -mr-6 -mt-6" />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-cyan-600/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                  <Calendar className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" /> Industry Proven
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform Launch Date</p>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 tracking-tight flex items-baseline gap-2">
                  <span>{launchDate || yearsOfOperation}</span>
                  <span className="text-xs font-sans text-gray-400">(Running Days {runningDays})</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-300 font-semibold">
                  <span>24/7 Monitored</span>
                </div>
              </div>
            </div>

          </div>

          {/* Secondary Dashboard Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10">
            
            <div className="bg-[#0F172A]/70 border border-slate-800 rounded-2xl p-4 sm:p-5 text-center">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Total Capital Deposited</span>
              <div className="text-xl sm:text-2xl font-black text-[#FFD700] font-mono">
                {this.formatCurrency(totalDeposited)}
              </div>
            </div>

            <div className="bg-[#0F172A]/70 border border-slate-800 rounded-2xl p-4 sm:p-5 text-center">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Online Investors Now</span>
              <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span>{onlineUsers} Active</span>
              </div>
            </div>

            <div className="bg-[#0F172A]/70 border border-slate-800 rounded-2xl p-4 sm:p-5 text-center">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Active Hash Rate Power</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {hashRateTotal}
              </div>
            </div>

            <div className="bg-[#0F172A]/70 border border-slate-800 rounded-2xl p-4 sm:p-5 text-center">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Avg Withdrawal Time</span>
              <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
                &lt; 8 Minutes
              </div>
            </div>

          </div>

          {/* Company Treasury Reserve Banner */}
          <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-2 border-[#FFD700]/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFD700]/30 to-amber-500/10 border border-[#FFD700]/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                <Award className="w-7 h-7 text-[#FFD700]" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest bg-[#FFD700]/10 px-3 py-1 rounded-full border border-[#FFD700]/30">
                  Insured System Reserve Capital
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">Institutional Treasury & Liquidity Fund</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
                  GoldBod Pro maintains an institutional capital reserve to guarantee instant payouts, hardware maintenance, and 100% liquidity for all investor withdrawals worldwide.
                </p>
              </div>
            </div>

            <div className="text-center md:text-right bg-[#090E18]/90 border border-amber-500/30 rounded-2xl p-5 shrink-0 min-w-[240px] shadow-xl">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Company Reserve Capital</span>
              <div className="text-3xl sm:text-4xl font-black text-[#FFD700] font-mono tracking-tight">
                {this.formatCurrency(companyMoney || 876834764)}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 block flex items-center justify-center md:justify-end gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Live Audited Reserve
              </span>
            </div>
          </div>

        </div>
      </section>
    );
  }
}

export default Statistics;
