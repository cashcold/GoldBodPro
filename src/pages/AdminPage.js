import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import UserDashboardLayout from './dashboard/UserDashboardLayout.js';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

class AdminPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      emailOrUsername: 'admin@goldbod.com',
      password: 'admin12345@',
      loading: false,
      errorMsg: null
    };
  }

  handleAdminLogin = async (e) => {
    e.preventDefault();
    const { emailOrUsername, password } = this.state;
    const { login } = this.context;

    this.setState({ loading: true, errorMsg: null });
    const res = await login(emailOrUsername, password);
    this.setState({ loading: false });

    if (!res.success) {
      this.setState({ errorMsg: res.error || 'Invalid admin credentials.' });
    } else if (res.user?.role !== 'admin') {
      this.setState({ errorMsg: 'Account authenticated, but does not have Administrator privileges.' });
    }
  };

  fillDemoAdmin = () => {
    this.setState({
      emailOrUsername: 'admin@goldbod.com',
      password: 'admin12345@',
      errorMsg: null
    });
  };

  render() {
    const { user, loading: authLoading, logout } = this.context;
    const { emailOrUsername, password, loading, errorMsg } = this.state;

    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#090E18] text-white flex items-center justify-center p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-gray-400">Loading Administrator Portal...</span>
          </div>
        </div>
      );
    }

    // If authenticated as Admin, render the dashboard with admin tab active!
    if (user && user.role === 'admin') {
      return <UserDashboardLayout defaultTab="admin" />;
    }

    // If logged in as regular non-admin user
    if (user && user.role !== 'admin') {
      return (
        <div className="min-h-screen bg-[#090E18] text-white flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">Admin Privileges Required</h2>
              <p className="text-xs text-gray-400 mt-2">
                You are currently signed in as <span className="text-amber-300 font-semibold">{user.email}</span> ({user.role}). Administrator authorization is required to access the Super Admin Portal.
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <button
                onClick={logout}
                className="btn-gold w-full py-3 text-xs font-bold"
              >
                Sign Out & Switch to Admin
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Not logged in: Show Administrator Portal Login Screen
    return (
      <div className="min-h-screen bg-[#090E18] text-white flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md space-y-6">
          
          {/* Header Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-500/20 via-amber-500/20 to-amber-500/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-extrabold tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
              Super Admin Control Portal
            </div>
            <h1 className="text-3xl font-black text-white font-mono tracking-tight">
              Administrator <span className="text-[#FFD700]">Login</span>
            </h1>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Secure entrance for GoldBod Pro system administrators and treasury controllers.
            </p>
          </div>

          {/* Quick Demo Credential Preset */}
          <div className="bg-gradient-to-r from-[#0F172A] to-[#162032] border border-[#FFD700]/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
            <div className="text-xs space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                Demo Super Admin Account
              </div>
              <div className="text-[11px] text-gray-400 font-mono">
                admin@goldbod.com / admin12345@
              </div>
            </div>
            <button
              type="button"
              onClick={this.fillDemoAdmin}
              className="px-3 py-1.5 rounded-xl bg-[#FFD700] text-black text-[11px] font-black hover:bg-amber-400 transition-all shrink-0"
            >
              Autofill Admin
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={this.handleAdminLogin} className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Admin Email / Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => this.setState({ emailOrUsername: e.target.value })}
                  placeholder="admin@goldbod.com or admin01"
                  className="w-full bg-[#090E18] border border-slate-700 focus:border-[#FFD700] rounded-2xl px-4 py-3 text-white text-xs font-mono transition-colors outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Admin Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#090E18] border border-slate-700 focus:border-[#FFD700] rounded-2xl px-4 py-3 text-white text-xs font-mono transition-colors outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Admin Control Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    );
  }
}

export default AdminPage;
