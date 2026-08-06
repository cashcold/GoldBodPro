import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import { Users, Copy, Check, Share2, Layers, DollarSign, Award } from 'lucide-react';

class ReferralProgram extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
  }

  copyLink = () => {
    const { user } = this.context;
    const refCode = user ? user.referralCode : 'GBP-[#10293]';
    const link = `${window.location.origin}/register?ref=${refCode}`;

    navigator.clipboard.writeText(link);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2500);
  };

  render() {
    const { user, openAuthModal } = this.context;
    const { copied } = this.state;
    const refCode = user ? user.referralCode : 'GBP-WELCOME';
    const refLink = `${window.location.origin}/register?ref=${refCode}`;

    const levels = [
      {
        level: 'First Deposit Bonus',
        commission: '10%',
        desc: 'Earn an instant 10% auto referral bonus on the first deposit made by every user you refer.',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      },
      {
        level: 'Level 1 Direct',
        commission: '5%',
        desc: 'Earn 5% ongoing commission on subsequent deposits made by your direct referrals.',
        badgeBg: 'bg-amber-500/20 text-[#FFD700] border-[#FFD700]/30'
      },
      {
        level: 'Level 2 & 3 Team',
        commission: '2% - 1%',
        desc: 'Earn 2% on Level 2 and 1% on Level 3 indirect team network investments.',
        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      }
    ];

    return (
      <section className="py-20 bg-[#090E18] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#FFD700]/30 text-xs font-semibold text-[#FFD700] uppercase mb-3">
              <Share2 className="w-4 h-4" /> Multi-Tier Affiliate Rewards
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              3-Tier <span className="text-gold-gradient">Referral Program</span>
            </h2>
            <p className="mt-4 text-gray-300 text-sm sm:text-base">
              Earn unlimited passive affiliate income by inviting friends and building a global crypto investment network.
            </p>
          </div>

          {/* 3 Level Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            {levels.map((lvl, idx) => (
              <div
                key={idx}
                className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/20 rounded-3xl p-8 text-center hover:border-[#FFD700] transition-all duration-300 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${lvl.badgeBg} mb-5`}>
                    {lvl.level}
                  </span>
                  <div className="text-5xl font-black text-gold-gradient font-mono my-4">
                    {lvl.commission}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Commission Reward</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{lvl.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Referral Link Copy Box Banner */}
          <div className="bg-[#0F172A] border border-[#FFD700]/30 rounded-3xl p-8 sm:p-10 shadow-2xl max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FFD700]" />
                  Your Exclusive Referral Link
                </h3>
                <p className="text-xs text-gray-400">
                  Share this link with your network to accumulate daily affiliate commissions.
                </p>
              </div>

              <div className="w-full md:w-auto flex-1 max-w-lg">
                <div className="flex items-center gap-2 bg-[#090E18] border border-amber-500/30 rounded-2xl p-2">
                  <input
                    type="text"
                    readOnly
                    value={refLink}
                    className="w-full bg-transparent px-3 text-xs font-mono text-gray-200 focus:outline-none"
                  />
                  <button
                    onClick={user ? this.copyLink : () => openAuthModal('register')}
                    className="btn-gold !py-2.5 !px-5 text-xs font-bold shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-900" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    );
  }
}

export default ReferralProgram;
