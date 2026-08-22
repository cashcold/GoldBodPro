import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import api from '../services/api.js';
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
      forgotStep: 1, // 1: enter email, 2: enter code & new pass, 3: success
      forgotEmail: '',
      forgotOtp: '',
      forgotNewPassword: '',
      forgotConfirmPassword: '',
      showForgotNewPassword: false,
      showForgotConfirmPassword: false,
      forgotSuccessMsg: '',
      localError: null
    };
  }

  handleSendResetOtp = async (e) => {
    e.preventDefault();
    const { forgotEmail } = this.state;
    if (!forgotEmail || !forgotEmail.trim()) {
      this.setState({ localError: 'Please enter your registered email address.' });
      return;
    }

    this.setState({ submitting: true, localError: null, forgotSuccessMsg: '' });
    try {
      const response = await api.post('/auth/forgot-password', { email: forgotEmail.trim() });
      const data = response.data;

      this.setState({
        submitting: false,
        forgotStep: 2,
        forgotSuccessMsg: data.message || `Verification code sent to ${forgotEmail}. Please check your inbox and spam folder.`
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to send reset code. Please try again.';
      this.setState({ submitting: false, localError: errorMsg });
    }
  };

  handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    const { forgotEmail, forgotOtp, forgotNewPassword, forgotConfirmPassword } = this.state;

    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      this.setState({ localError: 'Please enter the 6-digit verification code sent to your email.' });
      return;
    }

    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      this.setState({ localError: 'New password must be at least 6 characters long.' });
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      this.setState({ localError: 'New passwords do not match. Please re-type.' });
      return;
    }

    this.setState({ submitting: true, localError: null, forgotSuccessMsg: '' });
    try {
      const response = await api.post('/auth/reset-password', {
        email: forgotEmail.trim(),
        code: forgotOtp.trim(),
        newPassword: forgotNewPassword
      });
      const data = response.data;

      this.setState({
        submitting: false,
        forgotStep: 3,
        forgotSuccessMsg: 'Password updated successfully! You can now sign in with your new password.',
        loginInput: forgotEmail,
        loginPassword: forgotNewPassword
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update password. Please check your code.';
      this.setState({ submitting: false, localError: errorMsg });
    }
  };

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
              {this.state.forgotSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-semibold">
                  {this.state.forgotSuccessMsg}
                </div>
              )}

              {/* Step 1: Request Email */}
              {this.state.forgotStep === 1 && (
                <form onSubmit={this.handleSendResetOtp} className="space-y-4">
                  <p className="text-xs text-gray-300">
                    Enter your registered account email. We will send a secure 6-digit verification code to your email.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Account Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={this.state.forgotEmail}
                        onChange={(e) => this.setState({ forgotEmail: e.target.value })}
                        placeholder="investor@goldbod.pro"
                        className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#FFD700] focus:outline-none pr-10"
                      />
                      <Mail className="w-4 h-4 text-gray-500 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full py-3 text-xs font-bold uppercase tracking-wider"
                  >
                    {submitting ? 'Sending Email Code...' : 'Send Verification Code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => this.setState({ forgotView: false, localError: null })}
                    className="w-full text-center text-xs text-gray-400 hover:text-white"
                  >
                    Back to Login
                  </button>
                </form>
              )}

              {/* Step 2: Enter Code and New Password */}
              {this.state.forgotStep === 2 && (
                <form onSubmit={this.handleResetPasswordSubmit} className="space-y-3">
                  <p className="text-xs text-gray-300">
                    Check your email (<span className="text-[#FFD700] font-semibold">{this.state.forgotEmail}</span>) for the 6-digit code.
                  </p>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">6-Digit Verification Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={this.state.forgotOtp}
                      onChange={(e) => this.setState({ forgotOtp: e.target.value.replace(/\D/g, '') })}
                      placeholder="123456"
                      className="w-full bg-[#090E18] border border-amber-500/40 rounded-xl px-4 py-2.5 text-center text-white text-lg tracking-widest font-mono font-bold focus:border-[#FFD700] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={this.state.showForgotNewPassword ? 'text' : 'password'}
                        required
                        value={this.state.forgotNewPassword}
                        onChange={(e) => this.setState({ forgotNewPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2 text-white text-xs focus:border-[#FFD700] focus:outline-none pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => this.setState({ showForgotNewPassword: !this.state.showForgotNewPassword })}
                        className="absolute right-2.5 top-2 text-gray-400 hover:text-white"
                      >
                        {this.state.showForgotNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={this.state.showForgotConfirmPassword ? 'text' : 'password'}
                        required
                        value={this.state.forgotConfirmPassword}
                        onChange={(e) => this.setState({ forgotConfirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-2 text-white text-xs focus:border-[#FFD700] focus:outline-none pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => this.setState({ showForgotConfirmPassword: !this.state.showForgotConfirmPassword })}
                        className="absolute right-2.5 top-2 text-gray-400 hover:text-white"
                      >
                        {this.state.showForgotConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full py-3 text-xs font-bold uppercase tracking-wider mt-2"
                  >
                    {submitting ? 'Updating Password...' : 'Reset & Save Password'}
                  </button>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={this.handleSendResetOtp}
                      disabled={submitting}
                      className="text-xs text-[#FFD700] hover:underline"
                    >
                      Resend Code
                    </button>
                    <button
                      type="button"
                      onClick={() => this.setState({ forgotStep: 1, localError: null })}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Change Email
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Success & Sign In */}
              {this.state.forgotStep === 3 && (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Password Reset Complete!</h3>
                  <p className="text-xs text-gray-300">
                    Your password has been securely updated in MongoDB. You can now log into your GoldBod Pro account.
                  </p>
                  <button
                    type="button"
                    onClick={() => this.setState({ forgotView: false, forgotStep: 1, localError: null, forgotSuccessMsg: '' })}
                    className="btn-gold w-full py-3 text-xs font-bold uppercase tracking-wider"
                  >
                    Proceed to Login
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    );
  }
}

export default AuthModals;
