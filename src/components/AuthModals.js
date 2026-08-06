import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import { X, Lock, Mail, User, Phone, Globe, Sparkles, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

class AuthModals extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      // Login state
      loginInput: '',
      loginPassword: '',
      showLoginPassword: false,
      
      // Register state
      regName: '',
      regEmail: '',
      regUsername: '',
      regPassword: '',
      regConfirmPassword: '',
      showRegPassword: false,
      showRegConfirmPassword: false,
      regCountry: 'United States',
      regPhone: '',
      regRefCode: '',

      submitting: false,
      forgotView: false,
      localError: null
    };
  }

  handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { loginInput, loginPassword } = this.state;
    const { login } = this.context;

    this.setState({ submitting: true, localError: null });
    const res = await login(loginInput, loginPassword);
    this.setState({ submitting: false });

    if (res.success) {
      if (res.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    }
  };

  handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { regName, regEmail, regUsername, regPassword, regConfirmPassword, regCountry, regPhone, regRefCode } = this.state;
    const { register } = this.context;

    if (regPassword !== regConfirmPassword) {
      this.setState({ localError: 'Passwords do not match. Please re-type your confirm password.' });
      return;
    }

    this.setState({ submitting: true, localError: null });
    const res = await register({
      name: regName || regUsername,
      email: regEmail,
      username: regUsername,
      password: regPassword,
      country: regCountry,
      phone: regPhone,
      referralCode: regRefCode
    });
    this.setState({ submitting: false });

    if (res.success) {
      window.location.href = '/dashboard';
    }
  };

  render() {
    const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, error } = this.context;
    const { 
      loginInput, loginPassword, showLoginPassword,
      regName, regEmail, regUsername, regPassword, regConfirmPassword, 
      showRegPassword, showRegConfirmPassword,
      regCountry, regPhone, regRefCode, submitting, forgotView, localError 
    } = this.state;

    if (!authModalOpen) return null;

    const isLogin = authModalMode === 'login';
    const activeError = localError || error;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
        <div className="bg-[#0F172A] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
          
          {/* Top Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-[#FFD700] flex items-center justify-center mx-auto mb-3 border border-[#FFD700]/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">
              {forgotView ? 'Reset Password' : isLogin ? 'Welcome Back to GoldBod Pro' : 'Create Investor Account'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {forgotView ? 'Enter your registered email to receive reset link.' : isLogin ? 'Access your crypto portfolio & cloud mining rigs.' : 'Get $5 signup bonus & start investing today.'}
            </p>
          </div>

          {/* Error Banner */}
          {activeError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs text-center font-semibold">
              {activeError}
            </div>
          )}

          {/* Login Form */}
          {isLogin && !forgotView && (
            <form onSubmit={this.handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Email or Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginInput}
                    onChange={(e) => this.setState({ loginInput: e.target.value })}
                    placeholder="investor@goldbod.pro"
                    className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#FFD700] focus:outline-none pr-10"
                  />
                  <Mail className="w-4 h-4 text-gray-500 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => this.setState({ loginPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#FFD700] focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => this.setState({ showLoginPassword: !showLoginPassword })}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => this.setState({ forgotView: true })}
                  className="text-xs text-[#FFD700] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full py-3 text-sm uppercase font-bold tracking-wider"
              >
                {submitting ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-400">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => { this.setState({ localError: null }); openAuthModal('register'); }}
                  className="text-xs font-bold text-[#FFD700] hover:underline"
                >
                  Register Free
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {!isLogin && !forgotView && (
            <form onSubmit={this.handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => this.setState({ regName: e.target.value })}
                  placeholder="Alex Vance"
                  className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => this.setState({ regEmail: e.target.value })}
                    placeholder="alex@gmail.com"
                    className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => this.setState({ regUsername: e.target.value })}
                    placeholder="alexvance"
                    className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => this.setState({ regPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#FFD700] focus:outline-none pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => this.setState({ showRegPassword: !showRegPassword })}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => this.setState({ regConfirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#FFD700] focus:outline-none pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => this.setState({ showRegConfirmPassword: !showRegConfirmPassword })}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    value={regCountry}
                    onChange={(e) => this.setState({ regCountry: e.target.value })}
                    className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Referral Code</label>
                  <input
                    type="text"
                    value={regRefCode}
                    onChange={(e) => this.setState({ regRefCode: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full py-3 text-xs uppercase font-bold tracking-wider mt-2"
              >
                {submitting ? 'Creating Account...' : 'Register & Claim $5 Bonus'}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-gray-400">Already registered? </span>
                <button
                  type="button"
                  onClick={() => { this.setState({ localError: null }); openAuthModal('login'); }}
                  className="text-xs font-bold text-[#FFD700] hover:underline"
                >
                  Log In
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password View */}
          {forgotView && (
            <div className="space-y-4">
              <p className="text-xs text-gray-300">
                Please enter your account email address. Password reset instructions will be sent.
              </p>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2.5 text-white text-sm"
              />
              <button
                onClick={() => { alert('Password reset link sent to email!'); this.setState({ forgotView: false }); }}
                className="btn-gold w-full py-2.5 text-xs font-bold uppercase"
              >
                Send Reset Link
              </button>
              <button
                onClick={() => this.setState({ forgotView: false })}
                className="w-full text-center text-xs text-gray-400 hover:text-white"
              >
                Back to Login
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }
}

export default AuthModals;
