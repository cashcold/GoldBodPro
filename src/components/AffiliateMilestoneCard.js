import React, { Component } from 'react';
import { 
  Award, 
  Lock, 
  Sparkles, 
  Check, 
  Gift, 
  Loader2,
  Share2,
  Copy,
  ChevronRight
} from 'lucide-react';
import api from '../services/api.js';

const MILESTONES = [
  {
    level: 1,
    name: 'Bronze Affiliate',
    badge: 'BRONZE',
    shortBadge: 'BRONZE',
    targetReferrals: 1,
    rewardAmount: 10,
    rewardText: '$10 Cash Bonus',
    perk: '10% First Deposit Comm',
    numBg: 'bg-[#40240d] text-amber-300 border-amber-700/50',
    titleColor: 'text-amber-400',
    activeCardBorder: 'border-[#FFD700] bg-[#221a08] shadow-[0_0_15px_rgba(255,215,0,0.3)] ring-1 ring-[#FFD700]'
  },
  {
    level: 2,
    name: 'Silver Ambassador',
    badge: 'SILVER',
    shortBadge: 'SILVER',
    targetReferrals: 5,
    rewardAmount: 50,
    rewardText: '$50 Instant Bonus + 1% Extra Comm',
    perk: 'Priority Support & Fast Withdrawals',
    numBg: 'bg-[#1e293b] text-slate-300 border-slate-600/50',
    titleColor: 'text-slate-200',
    activeCardBorder: 'border-slate-300 bg-[#162033] shadow-[0_0_15px_rgba(203,213,225,0.3)] ring-1 ring-slate-300'
  },
  {
    level: 3,
    name: 'Gold Partner',
    badge: 'GOLD',
    shortBadge: 'GOLD',
    targetReferrals: 12,
    rewardAmount: 250,
    rewardText: '$250 VIP Partner Reward',
    perk: 'Custom Referral Link & Manager',
    numBg: 'bg-[#3b2d08] text-[#FFD700] border-[#FFD700]/50',
    titleColor: 'text-[#FFD700]',
    activeCardBorder: 'border-[#FFD700] bg-[#221a08] shadow-[0_0_15px_rgba(255,215,0,0.35)] ring-1 ring-[#FFD700]'
  },
  {
    level: 4,
    name: 'Platinum Director',
    badge: 'PLATINUM',
    shortBadge: 'PLATI...',
    targetReferrals: 25,
    rewardAmount: 1000,
    rewardText: '$1,000 Executive Cash Pool',
    perk: '0% Withdrawal Fees & Exclusive Webinars',
    numBg: 'bg-[#0e2f38] text-cyan-300 border-cyan-500/50',
    titleColor: 'text-cyan-300',
    activeCardBorder: 'border-cyan-400 bg-[#0d2730] shadow-[0_0_15px_rgba(34,211,238,0.3)] ring-1 ring-cyan-400'
  },
  {
    level: 5,
    name: 'Diamond Legend',
    badge: 'DIAMOND',
    shortBadge: 'DIAM...',
    targetReferrals: 50,
    rewardAmount: 3000,
    rewardText: '$3,000 Global Profit Share',
    perk: 'VIP Regional Ambassador Status',
    numBg: 'bg-[#29133a] text-purple-300 border-purple-500/50',
    titleColor: 'text-purple-300',
    activeCardBorder: 'border-purple-400 bg-[#221033] shadow-[0_0_15px_rgba(192,132,252,0.3)] ring-1 ring-purple-400'
  }
];

class AffiliateMilestoneCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      claimingLevel: null,
      claimedLevels: [],
      successMessage: '',
      errorMessage: ''
    };
  }

  componentDidMount() {
    const { user = {} } = this.props;
    if (Array.isArray(user.claimedMilestones)) {
      this.setState({ claimedLevels: [...user.claimedMilestones] });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user?.claimedMilestones !== this.props.user?.claimedMilestones) {
      if (Array.isArray(this.props.user?.claimedMilestones)) {
        this.setState({ claimedLevels: [...this.props.user.claimedMilestones] });
      }
    }
  }

  handleClaimMilestone = async (level) => {
    this.setState({ claimingLevel: level, errorMessage: '', successMessage: '' });
    try {
      const res = await api.post('/user/milestone/claim', { level });
      if (res.data && res.data.success) {
        this.setState(prev => ({
          claimedLevels: res.data.claimedMilestones || [...prev.claimedLevels, level],
          successMessage: res.data.message || `Milestone reward claimed successfully!`,
          claimingLevel: null
        }));

        // Dispatch window event so dashboard balance updates immediately
        window.dispatchEvent(new Event('balanceUpdated'));
      }
    } catch (err) {
      this.setState({
        errorMessage: err.response?.data?.error || 'Failed to claim milestone bonus.',
        claimingLevel: null
      });
    }
  };

  render() {
    const { user = {}, referrals = [] } = this.props;
    const { claimingLevel, claimedLevels, successMessage, errorMessage } = this.state;

    const activeReferralsCount = Number(referrals.length || user.referralCount || 0);

    // Count how many milestones unlocked
    const unlockedMilestones = MILESTONES.filter(m => activeReferralsCount >= m.targetReferrals);
    const unlockedCount = unlockedMilestones.length;

    // Highest unlocked index or 0
    let currentActiveIdx = 0;
    if (unlockedCount > 0) {
      currentActiveIdx = Math.min(unlockedCount - 1, MILESTONES.length - 1);
    }

    return (
      <div className="bg-[#070D1A] border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 text-white">
        
        {/* Messages / Alerts */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
            <span className="font-semibold">{successMessage}</span>
            <button 
              onClick={() => this.setState({ successMessage: '' })}
              className="text-gray-400 hover:text-white text-xs px-2 py-0.5"
            >
              ✕
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between animate-in fade-in">
            <span>{errorMessage}</span>
            <button 
              onClick={() => this.setState({ errorMessage: '' })}
              className="text-gray-400 hover:text-white text-xs px-2 py-0.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Header: Milestone Roadmap */}
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#FFD700]" />
          <h3 className="text-sm sm:text-base font-black tracking-wide uppercase text-white">
            MILESTONE ROADMAP
          </h3>
          <span className="text-xs text-gray-400 font-normal ml-1">
            {unlockedCount === 0 ? `Starter Level (0 / 5 Unlocked)` : `Level ${unlockedCount} (${unlockedCount} / 5 Unlocked)`}
          </span>
        </div>

        {/* 2. Top Horizontal Milestone Nodes Row */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {MILESTONES.map((m, idx) => {
            const isUnlocked = activeReferralsCount >= m.targetReferrals;
            const isClaimed = claimedLevels.includes(m.level) || (Array.isArray(user.claimedMilestones) && user.claimedMilestones.includes(m.level));
            const isSelected = idx === currentActiveIdx || (idx === 0 && unlockedCount === 0);

            return (
              <div 
                key={m.badge}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all text-center ${
                  isSelected
                    ? 'border-[#FFD700] bg-[#1a180a] shadow-[0_0_12px_rgba(255,215,0,0.25)] ring-1 ring-[#FFD700]'
                    : isUnlocked
                    ? 'border-emerald-500/40 bg-[#0c1e1c]'
                    : 'border-slate-800/90 bg-[#0d1526]/80'
                }`}
              >
                {/* Circle Icon */}
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center mb-1.5 ${
                  isClaimed || isUnlocked
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-[#152033] border border-slate-700/60 text-slate-400'
                }`}>
                  {isClaimed || isUnlocked ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                {/* Badge Label */}
                <span className="text-[10px] sm:text-xs font-black uppercase text-white tracking-wider truncate w-full">
                  <span className="sm:hidden">{m.shortBadge}</span>
                  <span className="hidden sm:inline">{m.badge}</span>
                </span>

                {/* Requirement */}
                <span className="text-[9px] sm:text-[10px] text-gray-400 font-mono mt-0.5">
                  {m.targetReferrals} Ref{m.targetReferrals > 1 ? 's' : ''}
                </span>
              </div>
            );
          })}
        </div>

        {/* 3. Section Title: All Affiliate Milestone Reward Tiers */}
        <div className="pt-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <h4 className="text-xs sm:text-sm font-black text-[#FFD700] uppercase tracking-wider">
              ALL AFFILIATE MILESTONE REWARD TIERS
            </h4>
          </div>
        </div>

        {/* 4. Vertical Milestone Reward Tier Cards */}
        <div className="space-y-3">
          {MILESTONES.map((m) => {
            const isUnlocked = activeReferralsCount >= m.targetReferrals;
            const isClaimed = claimedLevels.includes(m.level) || (Array.isArray(user.claimedMilestones) && user.claimedMilestones.includes(m.level));
            const isClaiming = claimingLevel === m.level;

            return (
              <div
                key={m.badge}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-[#0A1629] border-emerald-500/40 shadow-lg'
                    : 'bg-[#0B1322] border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Circle Number Badge */}
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-black text-sm shrink-0 shadow-inner ${m.numBg}`}>
                    {m.level}
                  </div>

                  {/* Tier Title and Subtitle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className={`text-sm sm:text-base font-bold ${m.titleColor}`}>
                        {m.name}
                      </span>
                      <span className="text-xs text-gray-400 font-normal">
                        ({m.targetReferrals} Referral{m.targetReferrals > 1 ? 's' : ''})
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      {m.perk}
                    </p>
                  </div>
                </div>

                {/* Bottom Reward Pill / Action Button */}
                <div className="flex items-center justify-end pt-1">
                  {isClaimed ? (
                    <div className="w-full sm:w-auto bg-[#04241d] border border-emerald-500/50 rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Claimed: 🎁 {m.rewardText} (Credited)</span>
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => this.handleClaimMilestone(m.level)}
                      disabled={isClaiming}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isClaiming ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Claiming...</span>
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4" />
                          <span>Claim {m.rewardText}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="w-full sm:w-auto bg-[#04241d] border border-[#0d594b] rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-[#00e699] text-xs font-bold font-mono">
                      <span>🎁</span>
                      <span>{m.rewardText}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    );
  }
}

export default AffiliateMilestoneCard;
