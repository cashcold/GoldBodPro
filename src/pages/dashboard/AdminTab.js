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
  DollarSign
} from 'lucide-react';

class AdminTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminData: null,
      loading: true,
      activeSubTab: 'deposits',
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
  }

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
    const { adminData, loading, activeSubTab, actionLoading, msg, walletCurrency, walletAddress, selectedUserId, customBalance } = this.state;

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

    const pendingDeposits = deposits.filter(d => d.status === 'pending');
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

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

          <button
            onClick={this.fetchAdminData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#090E18] border border-slate-700 text-xs font-bold text-gray-300 hover:text-[#FFD700] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FFD700]' : ''}`} />
            Refresh Portal Data
          </button>
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
              ${(876834764 + (Math.max(2, Math.floor((Date.now() - new Date('2026-08-02T00:00:00Z').getTime()) / (1000 * 60 * 60 * 24))) * 9500)).toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold">+ $9,500 Auto-credit Every 24h</span>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
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
        </div>

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
                        <td className="py-3 px-2 font-black text-emerald-400 font-mono">${d.amount?.toFixed(2)}</td>
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
                        <td className="py-3 px-2 font-black text-[#FFD700] font-mono">${w.amount?.toFixed(2)}</td>
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
                        {u.name} ({u.email}) - Current: ${u.balance?.toFixed(2)}
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
                        <td className="py-3 px-2 font-black text-[#FFD700] font-mono">${u.balance?.toFixed(2)}</td>
                        <td className="py-3 px-2 font-mono text-gray-300">${u.pendingWithdrawals?.toFixed(2) || '0.00'}</td>
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

      </div>
    );
  }
}

export default AdminTab;
