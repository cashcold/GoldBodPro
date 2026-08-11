import React, { Component } from 'react';
import { Share2, Copy, Check, Users, Award, DollarSign } from 'lucide-react';
import AffiliateMilestoneCard from '../../components/AffiliateMilestoneCard.js';

class ReferralTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
  }

  copyLink = () => {
    const { data } = this.props;
    const refLink = `${window.location.origin}/register?ref=${data.user.referralCode}`;
    navigator.clipboard.writeText(refLink);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render() {
    const { data } = this.props;
    const { user, referrals } = data;
    const { copied } = this.state;

    const refLink = `${window.location.origin}/register?ref=${user.referralCode}`;

    return (
      <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
        
        <div>
          <h2 className="text-2xl font-black text-white">Affiliate Partner Network</h2>
          <p className="text-xs text-gray-400 mt-1">
            Earn an instant <span className="text-[#FFD700] font-bold">10% auto referral reward</span> on the first deposit made by every investor you refer!
          </p>
        </div>

        {/* Link Banner */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-6 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-300 uppercase">
              Your Dedicated Affiliate Referral Link
            </label>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
              ⚡ 10% Auto First Deposit Reward Active
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#090E18] border border-amber-500/30 rounded-2xl p-2">
            <input
              type="text"
              readOnly
              value={refLink}
              className="w-full bg-transparent px-3 text-xs font-mono text-white focus:outline-none"
            />
            <button onClick={this.copyLink} className="btn-gold !py-2.5 !px-5 text-xs font-bold shrink-0">
              {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Gamified Affiliate Milestone Progress Bar */}
        <AffiliateMilestoneCard user={user} referrals={referrals || []} />

        {/* Commission Level Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#0F172A] border border-amber-500/30 p-6 rounded-3xl text-center shadow-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-[#FFD700] border border-amber-500/30 uppercase">
              First Deposit Bonus
            </span>
            <div className="text-3xl font-black text-gold-gradient font-mono my-2">10%</div>
            <p className="text-xs text-gray-400">Auto Reward on Referral 1st Deposit</p>
          </div>

          <div className="bg-[#0F172A] border border-cyan-500/30 p-6 rounded-3xl text-center shadow-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
              Level 1 Direct
            </span>
            <div className="text-3xl font-black text-cyan-400 font-mono my-2">5%</div>
            <p className="text-xs text-gray-400">Ongoing Direct Plan Deposits</p>
          </div>

          <div className="bg-[#0F172A] border border-purple-500/30 p-6 rounded-3xl text-center shadow-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
              Level 2 & Level 3
            </span>
            <div className="text-3xl font-black text-purple-400 font-mono my-2">2% - 1%</div>
            <p className="text-xs text-gray-400">Team Network Deposits</p>
          </div>
        </div>

        {/* Referred Members List */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4">My Referral Team Members ({referrals?.length || 0})</h3>

          {referrals?.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">No active investor referrals yet. Once a referred user makes their first approved deposit, they count toward your team and milestone progress.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#090E18] font-semibold text-gray-400 uppercase">
                  <tr>
                    <th className="px-4 py-3">Username</th>
                    <th className="px-4 py-3">Tier Level</th>
                    <th className="px-4 py-3">Joined Date</th>
                    <th className="px-4 py-3">Commission Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {referrals?.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 font-bold text-white">{r.username}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-[#FFD700]">
                          Level {r.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{new Date(r.joinedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400">+${r.commission.toFixed(2)} USDT</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    );
  }
}

export default ReferralTab;
