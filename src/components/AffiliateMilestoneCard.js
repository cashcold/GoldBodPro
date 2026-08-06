import React, { Component } from 'react';
import { 
  Trophy, 
  Award, 
  Target, 
  Flame, 
  Users, 
  Gift, 
  Check, 
  ChevronRight, 
  Lock, 
  Sparkles,
  Copy,
  Share2,
  Crown,
  Zap
} from 'lucide-react';

const MILESTONES = [
  {
    level: 1,
    name: 'Bronze Affiliate',
    badge: 'BRONZE',
    targetReferrals: 1,
    targetVolume: 100,
    rewardText: '$10 Cash Bonus',
    perk: '10% First Deposit Comm',
    color: 'from-amber-700/30 to-amber-900/40',
    borderColor: 'border-amber-600/40',
    textColor: 'text-amber-400',
    iconBg: 'bg-amber-600/20 text-amber-400 border-amber-500/40'
  },
  {
    level: 2,
    name: 'Silver Ambassador',
    badge: 'SILVER',
    targetReferrals: 5,
    targetVolume: 500,
    rewardText: '$50 Instant Bonus + 1% Extra Comm',
    perk: 'Priority Support & Fast Withdrawals',
    color: 'from-slate-400/20 to-slate-600/30',
    borderColor: 'border-slate-300/40',
    textColor: 'text-slate-200',
    iconBg: 'bg-slate-300/20 text-slate-200 border-slate-300/40'
  },
  {
    level: 3,
    name: 'Gold Partner',
    badge: 'GOLD',
    targetReferrals: 12,
    targetVolume: 2500,
    rewardText: '$250 VIP Partner Reward',
    perk: 'Custom Referral Link & Manager',
    color: 'from-[#FFD700]/25 via-amber-500/20 to-amber-700/30',
    borderColor: 'border-[#FFD700]/50',
    textColor: 'text-[#FFD700]',
    iconBg: 'bg-amber-500/20 text-[#FFD700] border-[#FFD700]/50'
  },
  {
    level: 4,
    name: 'Platinum Director',
    badge: 'PLATINUM',
    targetReferrals: 25,
    targetVolume: 10000,
    rewardText: '$1,000 Executive Cash Pool',
    perk: '0% Withdrawal Fees & Exclusive Webinars',
    color: 'from-cyan-500/25 to-blue-700/30',
    borderColor: 'border-cyan-400/50',
    textColor: 'text-cyan-300',
    iconBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
  },
  {
    level: 5,
    name: 'Diamond Legend',
    badge: 'DIAMOND',
    targetReferrals: 50,
    targetVolume: 25000,
    rewardText: '$3,000 Global Profit Share',
    perk: 'VIP Regional Ambassador Status',
    color: 'from-purple-500/25 via-fuchsia-600/20 to-indigo-900/40',
    borderColor: 'border-purple-400/50',
    textColor: 'text-purple-300',
    iconBg: 'bg-purple-500/20 text-purple-300 border-purple-400/50'
  }
];

class AffiliateMilestoneCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      showTierDetails: false
    };
  }

  copyReferralLink = () => {
    const { user = {} } = this.props;
    const refCode = user.referralCode || 'PRO100';
    const refLink = `${window.location.origin}/register?ref=${refCode}`;
    navigator.clipboard.writeText(refLink);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render() {
    const { user = {}, referrals = [], setTab } = this.props;
    const { copied, showTierDetails } = this.state;

    // Determine current count
    const activeReferralsCount = referrals.length || user.referralCount || 0;
    
    // Total team volume / referral income
    const totalReferralIncome = user.referralIncome || 0;

    // Find highest unlocked milestone index (-1 if none unlocked yet)
    let unlockedIndex = -1;
    for (let i = MILESTONES.length - 1; i >= 0; i--) {
      if (activeReferralsCount >= MILESTONES[i].targetReferrals) {
        unlockedIndex = i;
        break;
      }
    }

    // Current tier object
    const currentTier = unlockedIndex >= 0 ? MILESTONES[unlockedIndex] : {
      level: 0,
      name: 'Starter Member',
      badge: 'STARTER',
      targetReferrals: 0,
      rewardText: 'Start Referring',
      perk: 'Standard Affiliate Program',
      iconBg: 'bg-slate-800 text-slate-300 border-slate-700'
    };

    // Next tier to achieve
    const isMaxTier = unlockedIndex === MILESTONES.length - 1;
    const nextTier = isMaxTier ? MILESTONES[MILESTONES.length - 1] : MILESTONES[unlockedIndex + 1];

    // Progress calculation to next tier
    const currentBase = unlockedIndex >= 0 ? MILESTONES[unlockedIndex].targetReferrals : 0;
    const targetBase = nextTier.targetReferrals;
    
    let progressPercent = 0;
    if (isMaxTier) {
      progressPercent = 100;
    } else {
      const needed = targetBase - currentBase;
      const currentProgress = Math.max(0, activeReferralsCount - currentBase);
      progressPercent = Math.min(100, Math.round((currentProgress / needed) * 100));
    }

    const referralsNeeded = Math.max(0, nextTier.targetReferrals - activeReferralsCount);

    return (
      <div className="bg-gradient-to-br from-[#0F172A] via-[#111C33] to-[#090E18] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Decorative Top Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${currentTier.iconBg} shadow-lg shrink-0`}>
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Affiliate Level Program
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${currentTier.iconBg}`}>
                  {currentTier.badge}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5 flex items-center gap-2">
                {currentTier.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => this.setState(prev => ({ showTierDetails: !prev.showTierDetails }))}
              className="text-xs font-semibold text-gray-300 hover:text-[#FFD700] bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl px-3.5 py-2 transition-all flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>{showTierDetails ? 'Hide Milestone Perks' : 'View All Tiers'}</span>
            </button>

            {setTab && (
              <button
                onClick={() => setTab('referral')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl px-3.5 py-2 transition-all flex items-center gap-1"
              >
                <span>Partner Hub</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Gamified Main Progress Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Next Milestone: <strong className={nextTier.textColor}>{nextTier.name}</strong></span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {isMaxTier ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Highest Diamond Ambassador Rank Unlocked!
                  </span>
                ) : (
                  <span>
                    Refer <strong className="text-white">{referralsNeeded} more active investor{referralsNeeded !== 1 ? 's' : ''}</strong> to unlock the <strong className="text-[#FFD700]">{nextTier.rewardText}</strong>!
                  </span>
                )}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0 font-mono">
              <span className="text-2xl font-black text-white">{progressPercent}%</span>
              <span className="text-xs text-gray-400 block sm:inline ml-1 sm:ml-0">Progress</span>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="relative w-full h-4 bg-[#090E18] border border-slate-800 rounded-full p-0.5 overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-[#FFD700] to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(255,215,0,0.5)] relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Animated Light Shimmer Effect */}
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>

          {/* Current Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-[#090E18]/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <Users className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Active Team</span>
                <span className="text-sm font-extrabold text-white font-mono">{activeReferralsCount} Members</span>
              </div>
            </div>

            <div className="bg-[#090E18]/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <Gift className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Next Reward</span>
                <span className="text-xs font-bold text-emerald-300 line-clamp-1">{nextTier.rewardText}</span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-[#090E18]/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Earned</span>
                  <span className="text-sm font-extrabold text-cyan-300 font-mono">${totalReferralIncome.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={this.copyReferralLink} 
                className="btn-gold !py-1.5 !px-3 text-[11px] font-bold flex items-center gap-1 ml-auto shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-900" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Milestone Node Stepper Row */}
        <div className="border-t border-slate-800/80 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FFD700]" />
              Milestone Roadmap
            </span>
            <span className="text-[11px] text-gray-400">
              {unlockedIndex >= 0 ? `Level ${unlockedIndex + 1} of ${MILESTONES.length}` : `Starter Level (0 / ${MILESTONES.length} Unlocked)`}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {MILESTONES.map((m, idx) => {
              const isPassed = activeReferralsCount >= m.targetReferrals;
              const isCurrent = idx === unlockedIndex || (unlockedIndex === -1 && idx === 0);

              return (
                <div 
                  key={m.badge}
                  className={`flex flex-col items-center p-2 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-amber-500/20 border-[#FFD700] ring-1 ring-[#FFD700]/50 scale-105'
                      : isPassed
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-[#090E18]/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black mb-1 ${
                    isPassed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-gray-400 border border-slate-700'
                  }`}>
                    {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : <Lock className="w-3.5 h-3.5 text-gray-400" />}
                  </div>

                  <span className="text-[10px] font-extrabold text-white truncate max-w-full">
                    {m.badge}
                  </span>
                  
                  <span className="text-[9px] font-mono text-gray-400 mt-0.5">
                    {m.targetReferrals} Ref{m.targetReferrals > 1 ? 's' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expandable Tier Benefits Drawer */}
        {showTierDetails && (
          <div className="border-t border-slate-800/80 pt-5 animate-in fade-in space-y-3">
            <h4 className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              All Affiliate Milestone Reward Tiers
            </h4>

            <div className="space-y-2">
              {MILESTONES.map((m) => {
                const isUnlocked = activeReferralsCount >= m.targetReferrals;
                return (
                  <div 
                    key={m.badge} 
                    className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                      isUnlocked 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-[#090E18] border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${m.iconBg}`}>
                        {m.level}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${m.textColor}`}>{m.name}</span>
                          <span className="text-[10px] font-mono text-gray-400">({m.targetReferrals} Referrals)</span>
                        </div>
                        <p className="text-[11px] text-gray-300 mt-0.5">{m.perk}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        🎁 {m.rewardText}
                      </span>
                      {isUnlocked && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950 uppercase">
                          Unlocked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    );
  }
}

export default AffiliateMilestoneCard;
