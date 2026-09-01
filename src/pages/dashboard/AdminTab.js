import React, { Component } from 'react';
import api from '../../services/api.js';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Users, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Wallet, 
  RefreshCw,
  Search,
  DollarSign,
  Database,
  Server,
  Activity,
  AlertTriangle,
  Flame,
  Cpu,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

class AdminTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminData: null,
      dbStatus: null,
      loading: true,
      dbLoading: false,
      syncLoading: false,
      activeSubTab: 'investments',
      actionLoading: null,
      msg: null,
      // Wallet edit form
      walletCurrency: 'USDT_TRC20',
      walletAddress: '',
      // User balance edit
      selectedUserId: '',
      customBalance: ''
    };
  }

  componentDidMount() {
    this.fetchAdminData();
    this.fetchDbStatus();
  }

  fetchDbStatus = async () => {
    try {
      this.setState({ dbLoading: true });
      const res = await api.get('/system/status');
      this.setState({ dbStatus: res.data, dbLoading: false });
    } catch (e) {
      console.warn('Failed to fetch db status:', e);
      this.setState({ dbLoading: false });
    }
  };

  handleReconnectDb = async () => {
    try {
      this.setState({ dbLoading: true, msg: 'Attempting connection to MongoDB Atlas...' });
      const res = await api.post('/system/reconnect-db');
      if (res.data?.connected) {
        this.setState({ 
          msg: '✅ Successfully connected to MongoDB Atlas (' + (res.data?.dbName || 'NextPlatform') + ')!', 
          dbLoading: false 
        });
      } else {
        this.setState({ 
          msg: '⚠️ Connection attempt completed: ' + (res.data?.error || 'Could not reach cluster. Check Network Access in Atlas.'), 
          dbLoading: false 
        });
      }
      await this.fetchDbStatus();
      await this.fetchAdminData();
    } catch (err) {
      this.setState({ 
        msg: 'Failed to reconnect: ' + (err.response?.data?.error || err.message), 
        dbLoading: false 
      });
    }
  };

  handleSyncAllToDb = async () => {
    try {
      this.setState({ syncLoading: true, msg: 'Synchronizing all users, active contracts, and mining rigs to MongoDB Atlas...' });
      const res = await api.post('/system/sync-all-to-db');
      this.setState({
        msg: res.data?.message || '✅ All live active contracts and database models synchronized to MongoDB Atlas!',
        syncLoading: false
      });
      await this.fetchDbStatus();
      await this.fetchAdminData();
    } catch (err) {
      this.setState({
        msg: 'Sync error: ' + (err.response?.data?.error || err.message),
        syncLoading: false
      });
    }
  };

  handleInvestmentAction = async (investmentId, action) => {
    try {
      this.setState({ actionLoading: investmentId });
      const res = await api.post('/admin/investments/action', { investmentId, action });
      this.setState({ msg: res.data?.message || `Contract ${action}ed` });
      await this.fetchAdminData();
      if (this.props.refresh) this.props.refresh();
    } catch (err) {
      this.setState({ msg: err.response?.data?.error || 'Failed investment action' });
    } finally {
      this.setState({ actionLoading: null });
    }
  };

  fetchAdminData = async () => {
    try {
      this.setState({ loading: true, msg: null });
      const res = await api.get('/admin/overview');
      this.setState({ adminData: res.data, loading: false });
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      this.setState({ loading: false });
    }
  };

  handleDepositAction = async (depositId, action) => {
    try {
      this.setState({ actionLoading: depositId });
      const res = await api.post('/admin/deposits/action', { depositId, action });
      this.setState({ msg: res.data?.message || `Deposit ${action}d` });
      await this.fetchAdminData();
      if (this.props.refresh) this.props.refresh();
    } catch (err) {
      this.setState({ msg: err.response?.data?.error || 'Failed action' });
    } finally {
      this.setState({ actionLoading: null });
    }
  };

  handleWithdrawalAction = async (withdrawalId, action) => {
    try {
      this.setState({ actionLoading: withdrawalId });
      const res = await api.post('/admin/withdrawals/action', { withdrawalId, action });
      this.setState({ msg: res.data?.message || `Withdrawal ${action}d` });
      await this.fetchAdminData();
      if (this.props.refresh) this.props.refresh();
    } catch (err) {
      this.setState({ msg: err.response?.data?.error || 'Failed action' });
    } finally {
      this.setState({ actionLoading: null });
    }
  };

  handleUpdateUserBalance = async (e) => {
    e.preventDefault();
    const { selectedUserId, customBalance } = this.state;
    if (!selectedUserId || customBalance === '') return;
    try {
      this.setState({ actionLoading: 'balance' });
      const res = await api.post('/admin/users/update-balance', {
        userId: selectedUserId,
        newBalance: Number(customBalance)
      });
      this.setState({ msg: res.data?.message, customBalance: '', selectedUserId: '' });
      await this.fetchAdminData();
      if (this.props.refresh) this.props.refresh();
    } catch (err) {
      this.setState({ msg: err.response?.data?.error || 'Failed to update balance' });
    } finally {
      this.setState({ actionLoading: null });
    }
  };

  handleUpdateWallet = async (e) => {
    e.preventDefault();
    const { walletCurrency, walletAddress } = this.state;
    if (!walletAddress) return;
    try {
      this.setState({ actionLoading: 'wallet' });
      const res = await api.post('/admin/wallets/update', {
        currency: walletCurrency,
        address: walletAddress
      });
      this.setState({ msg: res.data?.message, walletAddress: '' });
      await this.fetchAdminData();
      if (this.props.refresh) this.props.refresh();
    } catch (err) {
      this.setState({ msg: err.response?.data?.error || 'Failed to update wallet' });
    } finally {
      this.setState({ actionLoading: null });
    }
  };

  render() {
    const { 
      adminData, 
      dbStatus, 
      loading, 
      dbLoading, 
      syncLoading,
      activeSubTab, 
      actionLoading, 
      msg, 
      walletCurrency, 
      walletAddress, 
      selectedUserId, 
      customBalance 
    } = this.state;

    if (loading && !adminData) {
      return (
        <div className="flex items-center justify-center p-12">
          <RefreshCw className="w-8 h-8 text-[#FFD700] animate-spin" />
        </div>
      );
    }

    const deposits = adminData?.deposits || [];
    const withdrawals = adminData?.withdrawals || [];
    const users = adminData?.users || [];
    const investments = adminData?.activeInvestments || adminData?.investments || [];

    const activeContracts = investments.filter(i => i.status === 'active');
    const pendingDeposits = deposits.filter(d => d.status === 'pending');
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
    const totalActiveCapital = activeContracts.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in">
        
        {/* Admin Header */}
        <div className="bg-[#0F172A] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-tr from-[#FFD700]/20 to-amber-500/10 rounded-2xl border border-[#FFD700]/30">
              <ShieldCheck className="w-8 h-8 text-[#FFD700]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">Super Admin Control Portal</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-extrabold uppercase tracking-wider border border-red-500/30">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Manage user deposits, verify pending withdrawals, adjust account balances, and update payment gateway addresses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={this.handleSyncAllToDb}
              disabled={syncLoading}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-amber-500/10 border border-[#FFD700]/40 text-xs font-bold text-[#FFD700] hover:bg-[#FFD700]/20 transition-all"
            >
              <Sparkles className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
              {syncLoading ? 'Syncing...' : 'Sync Live Data to Mongo'}
            </button>

            <button
              onClick={this.fetchAdminData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#090E18] border border-slate-700 text-xs font-bold text-gray-300 hover:text-[#FFD700] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FFD700]' : ''}`} />
              Refresh Portal Data
            </button>
          </div>
        </div>

        {/* Action Message Alert */}
        {msg && (
          <div className="p-4 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/40 text-[#FFD700] text-xs font-bold flex items-center justify-between">
            <span>{msg}</span>
            <button onClick={() => this.setState({ msg: null })} className="text-gray-400 hover:text-white">Dismiss</button>
          </div>
        )}

        {/* Quick Admin Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0F172A] border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
              <span>Pending Deposits</span>
              <ArrowDownCircle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2">{pendingDeposits.length}</p>
            <span className="text-[10px] text-amber-400 font-semibold">Awaiting Verification</span>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
              <span>Pending Cashouts</span>
              <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2">{pendingWithdrawals.length}</p>
            <span className="text-[10px] text-emerald-400 font-semibold">Awaiting Approval</span>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
              <span>Total Registered Users</span>
              <Users className="w-4 h-4 text-[#FFD700]" />
            </div>
            <p className="text-2xl font-black text-white mt-2">{users.length}</p>
            <span className="text-[10px] text-gray-400">Database Accounts</span>
          </div>

          <div className="bg-[#0F172A] border border-[#FFD700]/30 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
              <span>Company Treasury Reserve</span>
              <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
            </div>
            <p className="text-xl font-black text-[#FFD700] mt-2 font-mono">
              ${(876834764 + (Math.max(1, Math.floor((Date.now() - new Date('2026-08-31T00:00:00Z').getTime()) / (1000 * 60 * 60 * 24))) * 9500)).toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold">+ $9,500 Auto-credit Every 24h</span>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => this.setState({ activeSubTab: 'investments' })}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'investments'
                ? 'bg-[#FFD700] text-black shadow-lg font-black'
                : 'bg-[#0F172A] text-gray-400 hover:text-white border border-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Active Contracts & Mining ({activeContracts.length})
          </button>

          <button
            onClick={() => this.setState({ activeSubTab: 'deposits' })}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'deposits'
                ? 'bg-[#FFD700] text-black shadow-lg font-black'
                : 'bg-[#0F172A] text-gray-400 hover:text-white border border-slate-800'
            }`}
          >
            Deposits ({pendingDeposits.length} pending)
          </button>

          <button
            onClick={() => this.setState({ activeSubTab: 'withdrawals' })}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'withdrawals'
                ? 'bg-[#FFD700] text-black shadow-lg font-black'
                : 'bg-[#0F172A] text-gray-400 hover:text-white border border-slate-800'
            }`}
          >
            Withdrawals ({pendingWithdrawals.length} pending)
          </button>

          <button
            onClick={() => this.setState({ activeSubTab: 'users' })}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'users'
                ? 'bg-[#FFD700] text-black shadow-lg font-black'
                : 'bg-[#0F172A] text-gray-400 hover:text-white border border-slate-800'
            }`}
          >
            User Accounts ({users.length})
          </button>

          <button
            onClick={() => this.setState({ activeSubTab: 'wallets' })}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'wallets'
                ? 'bg-[#FFD700] text-black shadow-lg font-black'
                : 'bg-[#0F172A] text-gray-400 hover:text-white border border-slate-800'
            }`}
          >
            Deposit Wallets Config
          </button>

          <button
            onClick={() => this.setState({ activeSubTab: 'database' })}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'database'
                ? 'bg-amber-400 text-black shadow-lg font-black'
                : dbStatus?.database?.connected
                  ? 'bg-emerald-950/40 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40'
                  : 'bg-red-950/40 text-red-300 hover:text-red-200 border border-red-500/40'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            MongoDB Atlas Status
            <span className={`w-2 h-2 rounded-full ${dbStatus?.database?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
          </button>
        </div>

        {/* TAB: ACTIVE CONTRACTS & MINING */}
        {activeSubTab === 'investments' && (
          <div className="space-y-6">
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#FFD700]" />
                    Active Investment Yield Contracts & Mining Records
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    View all user contracts, Starter ($50) & Silver ($400) plans, expected cashout timings, and manual maturity settlement.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                    Total Active Yielding: ${totalActiveCapital.toFixed(2)} USDT
                  </span>
                </div>
              </div>

              {investments.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-xs text-gray-400">No active investment contracts found in database.</p>
                  <button 
                    onClick={this.handleSyncAllToDb}
                    className="btn-gold px-4 py-2 text-xs font-bold"
                  >
                    Sync Live Seeds Now
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-gray-400 uppercase">
                        <th className="py-3 px-2">Contract Plan</th>
                        <th className="py-3 px-2">Investor User</th>
                        <th className="py-3 px-2">Principal</th>
                        <th className="py-3 px-2">Profit Rate</th>
                        <th className="py-3 px-2">Expected Return</th>
                        <th className="py-3 px-2">Duration</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {investments.map((inv) => {
                        const isStarter = inv.planName?.toLowerCase().includes('starter');
                        const isSilver = inv.planName?.toLowerCase().includes('silver');
                        const isGold = inv.planName?.toLowerCase().includes('gold');

                        return (
                          <tr key={inv.id} className="hover:bg-[#090E18]/60 transition-colors">
                            <td className="py-3 px-2">
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isStarter ? 'bg-amber-400' : isSilver ? 'bg-cyan-400' : isGold ? 'bg-[#FFD700]' : 'bg-purple-400'}`}></span>
                                {inv.planName || 'Yield Plan'}
                              </div>
                              <div className="text-[10px] text-gray-500 font-mono">ID: {inv.id}</div>
                            </td>

                            <td className="py-3 px-2">
                              <div className="font-bold text-gray-200">{inv.userName || 'Investor'}</div>
                              <div className="text-[10px] text-gray-400">{inv.userEmail || inv.userId}</div>
                            </td>

                            <td className="py-3 px-2 font-mono font-black text-white text-sm">
                              ${(Number(inv.amount || 0)).toFixed(2)} <span className="text-[10px] text-gray-400 font-normal">USDT</span>
                            </td>

                            <td className="py-3 px-2">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                                +{inv.profitPercent || 5}% Return
                              </span>
                            </td>

                            <td className="py-3 px-2 font-mono font-black text-emerald-400">
                              ${(Number(inv.totalReturn || (inv.amount * 1.05))).toFixed(2)} USDT
                            </td>

                            <td className="py-3 px-2 text-gray-300">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>{inv.durationDays || 1} Day{inv.durationDays > 1 ? 's' : ''} ({inv.durationDays * 24} Hours)</span>
                              </div>
                              <div className="text-[10px] text-gray-500">
                                Ends: {inv.endDate ? new Date(inv.endDate).toLocaleDateString() : 'Active'}
                              </div>
                            </td>

                            <td className="py-3 px-2">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                inv.status === 'active' 
                                  ? 'bg-amber-500/20 text-[#FFD700] border border-[#FFD700]/40 animate-pulse' 
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}>
                                {inv.status === 'active' ? 'ACTIVE YIELDING' : 'COMPLETED'}
                              </span>
                            </td>

                            <td className="py-3 px-2 text-right">
                              {inv.status === 'active' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    disabled={actionLoading === inv.id}
                                    onClick={() => this.handleInvestmentAction(inv.id, 'complete')}
                                    className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold transition-all"
                                    title="Immediately mature contract and credit full payout to user"
                                  >
                                    Pay Out
                                  </button>
                                  <button
                                    disabled={actionLoading === inv.id}
                                    onClick={() => this.handleInvestmentAction(inv.id, 'cancel')}
                                    className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-lg text-[10px] font-bold transition-all"
                                    title="Cancel contract and return original capital"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-gray-500 font-mono">Paid & Settled</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Cloud Mining Hash Power Rigs Overview */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                Active Cloud Mining ASIC Rigs in Database
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {users.filter(u => (Number(u.hashPower || 0) > 0)).map((u) => (
                  <div key={u.id} className="bg-[#090E18] border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{u.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                        ONLINE 24/7
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">{u.email}</p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-gray-400">Total Hash Rate:</span>
                      <span className="text-sm font-mono font-black text-[#FFD700]">{u.hashPower || 50} TH/s</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">Est. Daily Mining Yield:</span>
                      <span className="font-mono text-emerald-400">+${((u.hashPower || 50) * 0.10).toFixed(2)} USDT/day</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: DEPOSITS MANAGEMENT */}
        {activeSubTab === 'deposits' && (
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">All Deposit Requests</h3>
            
            {deposits.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No deposit requests logged yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-gray-400 uppercase">
                      <th className="py-3 px-2">ID / Date</th>
                      <th className="py-3 px-2">User ID</th>
                      <th className="py-3 px-2">Gateway</th>
                      <th className="py-3 px-2">Amount</th>
                      <th className="py-3 px-2">Tx Hash</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {deposits.map((d) => (
                      <tr key={d.id} className="hover:bg-[#090E18]/50">
                        <td className="py-3 px-2 font-mono text-gray-300">
                          <div>{d.id}</div>
                          <div className="text-[10px] text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3 px-2 font-mono text-gray-400">{d.userId}</td>
                        <td className="py-3 px-2 font-bold text-amber-300">{d.gateway}</td>
                        <td className="py-3 px-2 font-black text-emerald-400 font-mono">${(Number(d.amount || 0)).toFixed(2)}</td>
                        <td className="py-3 px-2 font-mono text-gray-400 truncate max-w-[120px]">{d.txHash || 'N/A'}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            d.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            d.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          {d.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                disabled={actionLoading === d.id}
                                onClick={() => this.handleDepositAction(d.id, 'approve')}
                                className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold flex items-center gap-1 transition-all"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Approve
                              </button>
                              <button
                                disabled={actionLoading === d.id}
                                onClick={() => this.handleDepositAction(d.id, 'reject')}
                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg font-bold flex items-center gap-1 transition-all"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-500 italic">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WITHDRAWALS MANAGEMENT */}
        {activeSubTab === 'withdrawals' && (
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">All Withdrawal Requests</h3>

            {withdrawals.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No withdrawal requests submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-gray-400 uppercase">
                      <th className="py-3 px-2">ID / Date</th>
                      <th className="py-3 px-2">User ID</th>
                      <th className="py-3 px-2">Gateway</th>
                      <th className="py-3 px-2">Destination Address</th>
                      <th className="py-3 px-2">Amount</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-[#090E18]/50">
                        <td className="py-3 px-2 font-mono text-gray-300">
                          <div>{w.id}</div>
                          <div className="text-[10px] text-gray-500">{new Date(w.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3 px-2 font-mono text-gray-400">{w.userId}</td>
                        <td className="py-3 px-2 font-bold text-amber-300">{w.gateway}</td>
                        <td className="py-3 px-2 font-mono text-gray-300 truncate max-w-[140px]">{w.walletAddress}</td>
                        <td className="py-3 px-2 font-black text-[#FFD700] font-mono">${(Number(w.amount || 0)).toFixed(2)}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            w.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            w.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          {w.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                disabled={actionLoading === w.id}
                                onClick={() => this.handleWithdrawalAction(w.id, 'approve')}
                                className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold flex items-center gap-1 transition-all"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Approve & Pay
                              </button>
                              <button
                                disabled={actionLoading === w.id}
                                onClick={() => this.handleWithdrawalAction(w.id, 'reject')}
                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg font-bold flex items-center gap-1 transition-all"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject & Refund
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-500 italic">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER ACCOUNTS & BALANCE EDIT */}
        {activeSubTab === 'users' && (
          <div className="space-y-6">
            
            {/* Balance Editor Form */}
            <form onSubmit={this.handleUpdateUserBalance} className="bg-[#0F172A] border border-[#FFD700]/30 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#FFD700]" />
                Update User Balance Manually
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Select User</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => this.setState({ selectedUserId: e.target.value })}
                    className="w-full bg-[#090E18] border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs"
                    required
                  >
                    <option value="">-- Choose User Account --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email}) - Current: ${(Number(u.balance || 0)).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">New Balance ($ USDT)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 500.00"
                    value={customBalance}
                    onChange={(e) => this.setState({ customBalance: e.target.value })}
                    className="w-full bg-[#090E18] border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={actionLoading === 'balance'}
                    className="btn-gold w-full py-2.5 text-xs font-bold"
                  >
                    Set User Balance
                  </button>
                </div>
              </div>
            </form>

            {/* Users Table */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">All Platform Users</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-gray-400 uppercase">
                      <th className="py-3 px-2">User Details</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Balance</th>
                      <th className="py-3 px-2">Pending Withdraw</th>
                      <th className="py-3 px-2">KYC Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#090E18]/50">
                        <td className="py-3 px-2">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[10px] text-gray-400">{u.email} • {u.username}</div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-gray-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-black text-[#FFD700] font-mono">${(Number(u.balance || 0)).toFixed(2)}</td>
                        <td className="py-3 px-2 font-mono text-gray-300">${(Number(u.pendingWithdrawals || 0)).toFixed(2)}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.kycStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {u.kycStatus || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: DEPOSIT WALLET CONFIG */}
        {activeSubTab === 'wallets' && (
          <form onSubmit={this.handleUpdateWallet} className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#FFD700]" />
              Update System Deposit Crypto Wallet
            </h3>
            <p className="text-xs text-gray-400">
              Change the receiver deposit wallet addresses displayed to investors when depositing funds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Currency Network</label>
                <select
                  value={walletCurrency}
                  onChange={(e) => this.setState({ walletCurrency: e.target.value })}
                  className="w-full bg-[#090E18] border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs"
                >
                  <option value="USDT_TRC20">USDT (TRC20)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">New Deposit Wallet Address</label>
                <input
                  type="text"
                  placeholder="Paste official crypto wallet address"
                  value={walletAddress}
                  onChange={(e) => this.setState({ walletAddress: e.target.value })}
                  className="w-full bg-[#090E18] border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading === 'wallet'}
              className="btn-gold px-6 py-2.5 text-xs font-bold"
            >
              Update Wallet Address
            </button>
          </form>
        )}

        {/* TAB 5: MONGODB ATLAS CLUSTER & DATABASE DIAGNOSTICS */}
        {activeSubTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border ${
                    dbStatus?.database?.connected 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">MongoDB Atlas Connection Status</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        dbStatus?.database?.connected 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {dbStatus?.database?.connected ? 'ONLINE / CONNECTED' : 'DISCONNECTED'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Direct connection pipeline between GoldBod Pro server and MongoDB Atlas cluster.
                    </p>
                  </div>
                </div>

                <button
                  onClick={this.handleReconnectDb}
                  disabled={dbLoading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl btn-gold text-xs font-bold shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${dbLoading ? 'animate-spin' : ''}`} />
                  {dbLoading ? 'Connecting...' : 'Test & Reconnect DB'}
                </button>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#090E18] border border-slate-800/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Database Name</span>
                  <p className="text-sm font-mono font-bold text-amber-300">
                    {dbStatus?.database?.dbName || 'NextPlatform'}
                  </p>
                </div>

                <div className="bg-[#090E18] border border-slate-800/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Cluster Host</span>
                  <p className="text-sm font-mono font-bold text-gray-300 truncate">
                    {dbStatus?.database?.host || 'nextplatform.fbj1o.mongodb.net'}
                  </p>
                </div>

                <div className="bg-[#090E18] border border-slate-800/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Registered Users in Mongo</span>
                  <p className="text-sm font-mono font-black text-emerald-400">
                    {dbStatus?.database?.registeredUsersInMongo ?? users.length} users
                  </p>
                </div>

                <div className="bg-[#090E18] border border-slate-800/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Active Collections</span>
                  <p className="text-sm font-mono font-bold text-sky-400">
                    {dbStatus?.database?.collections?.length || 7} collections
                  </p>
                </div>
              </div>

              {/* Error Box if Disconnected */}
              {!dbStatus?.database?.connected && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase">
                    <AlertTriangle className="w-4 h-4" />
                    <span>MongoDB Atlas Connection Issue Detected</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <strong>Error Message:</strong> <span className="font-mono text-red-300 text-[11px]">{dbStatus?.database?.diagnostics?.lastError || 'Cluster unreachable or IP not whitelisted in MongoDB Atlas.'}</span>
                  </p>
                  
                  <div className="bg-[#090E18] p-4 rounded-xl text-xs space-y-2 border border-red-500/20">
                    <p className="font-bold text-white">How to fix in 1 minute on MongoDB Atlas:</p>
                    <ol className="list-decimal list-inside space-y-1 text-gray-300 text-[11px]">
                      <li>Go to <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="text-[#FFD700] underline font-bold">MongoDB Atlas Dashboard</a></li>
                      <li>In the left sidebar under <strong>Security</strong>, click <strong>Network Access</strong></li>
                      <li>Click <strong>Add IP Address</strong> and select <strong>Allow Access from Anywhere (<span className="text-[#FFD700] font-mono">0.0.0.0/0</span>)</strong>, then click <strong>Confirm</strong></li>
                      <li>In <strong>Database Access</strong>, make sure the user <span className="text-[#FFD700] font-mono">nextplatform</span> has the <strong>readWriteAnyDatabase</strong> or <strong>Atlas Admin</strong> role</li>
                      <li>Come back here and click the <strong>"Test & Reconnect DB"</strong> button above</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Connected Success Banner */}
              {dbStatus?.database?.connected && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                    <CheckCircle className="w-4 h-4" />
                    <span>MongoDB Atlas Fully Synchronized</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    All user accounts, deposit receipts, withdrawal records, and hash power miners are actively persisting to your <strong>NextPlatform</strong> cluster collections: <span className="text-emerald-300 font-mono">users</span>, <span className="text-emerald-300 font-mono">deposits</span>, <span className="text-emerald-300 font-mono">withdrawals</span>, <span className="text-emerald-300 font-mono">investments</span>, <span className="text-emerald-300 font-mono">transactions</span>, <span className="text-emerald-300 font-mono">plans</span>, <span className="text-emerald-300 font-mono">system_reserves</span>.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    );
  }
}

export default AdminTab;
