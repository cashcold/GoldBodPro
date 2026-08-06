import React, { Component } from 'react';
import { User, ShieldCheck, Key, Lock, CheckCircle, Smartphone } from 'lucide-react';

class ProfileTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.user?.name || '',
      email: props.user?.email || '',
      phone: props.user?.phone || '+1 555-0192',
      country: props.user?.country || 'United States',
      walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      oldPassword: '',
      newPassword: '',
      savedMsg: null
    };
  }

  handleSaveProfile = (e) => {
    e.preventDefault();
    this.setState({ savedMsg: 'Profile information updated successfully!' });
    setTimeout(() => this.setState({ savedMsg: null }), 3000);
  };

  render() {
    const { user } = this.props;
    const { name, email, phone, country, walletAddress, oldPassword, newPassword, savedMsg } = this.state;

    return (
      <div className="space-y-8 animate-in fade-in">
        
        {/* Profile Card */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F7C948] via-[#FFD700] to-[#FFF085] p-0.5">
              <div className="w-full h-full bg-[#090E18] rounded-[14px] flex items-center justify-center font-extrabold text-2xl text-[#FFD700]">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Active Investor
                </span>
              </div>
              <p className="text-xs text-gray-400">{user?.email} • Account ID: #GB-{user?.id?.slice(0, 8) || '92831'}</p>
            </div>
          </div>

          {savedMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{savedMsg}</span>
            </div>
          )}

          <form onSubmit={this.handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                  className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2.5 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-[#090E18]/50 border border-slate-800 rounded-xl px-4 py-2.5 text-gray-400 text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => this.setState({ phone: e.target.value })}
                  className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2.5 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => this.setState({ country: e.target.value })}
                  className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2.5 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Default Payout USDT (TRC20 / BEP20) Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => this.setState({ walletAddress: e.target.value })}
                className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:border-[#FFD700] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="btn-gold py-2.5 px-6 text-xs font-bold uppercase tracking-wider"
            >
              Save Profile Settings
            </button>
          </form>
        </div>

        {/* Security & 2FA */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-[#FFD700]" />
            <h3 className="text-lg font-bold text-white">Security & 2-Factor Authentication</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-300 uppercase">Change Account Password</label>
              <input
                type="password"
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => this.setState({ oldPassword: e.target.value })}
                className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2.5 text-white text-xs"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => this.setState({ newPassword: e.target.value })}
                className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2.5 text-white text-xs"
              />
              <button
                type="button"
                onClick={() => alert('Password updated successfully')}
                className="btn-outline-gold text-xs py-2 px-4"
              >
                Update Password
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#090E18] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Google Authenticator (2FA)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">Active</span>
              </div>
              <p className="text-[11px] text-gray-400">Two-Factor authentication protects your withdrawals and login attempts.</p>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default ProfileTab;
