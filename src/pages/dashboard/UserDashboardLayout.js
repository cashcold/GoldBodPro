import React, { Component } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import { withRouter } from '../../components/withRouter.js';
import api from '../../services/api.js';

import OverviewTab from './OverviewTab.js';
import DepositTab from './DepositTab.js';
import WithdrawTab from './WithdrawTab.js';
import InvestmentsTab from './InvestmentsTab.js';
import MiningTab from './MiningTab.js';
import ReferralTab from './ReferralTab.js';
import TransactionsTab from './TransactionsTab.js';
import SupportTab from './SupportTab.js';
import ProfileTab from './ProfileTab.js';
import AdminTab from './AdminTab.js';

import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Cpu,
  Users,
  History,
  LifeBuoy,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bell,
  RefreshCw
} from 'lucide-react';

class UserDashboardLayout extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.defaultTab || 'overview',
      dashboardData: null,
      loading: true,
      sidebarOpen: false
    };
  }

  componentDidMount() {
    this.fetchDashboardData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.defaultTab && this.props.defaultTab !== prevProps.defaultTab) {
      this.setState({ activeTab: this.props.defaultTab });
    }
  }

  fetchDashboardData = async () => {
    try {
      this.setState({ loading: true });
      const res = await api.get('/user/dashboard');
      this.setState({ dashboardData: res.data, loading: false });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      this.setState({ loading: false });
    }
  };

  setTab = (tab) => {
    this.setState({ activeTab: tab, sidebarOpen: false });
  };

  renderTabContent = () => {
    const { activeTab, dashboardData } = this.state;
    const { user } = this.context;

    if (!dashboardData) return null;

    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={dashboardData} refresh={this.fetchDashboardData} setTab={this.setTab} />;
      case 'deposit':
        return <DepositTab data={dashboardData} refresh={this.fetchDashboardData} />;
      case 'withdraw':
        return <WithdrawTab data={dashboardData} refresh={this.fetchDashboardData} />;
      case 'investments':
        return <InvestmentsTab data={dashboardData} refresh={this.fetchDashboardData} setTab={this.setTab} />;
      case 'mining':
        return <MiningTab data={dashboardData} refresh={this.fetchDashboardData} />;
      case 'referral':
        return <ReferralTab data={dashboardData} refresh={this.fetchDashboardData} />;
      case 'transactions':
        return <TransactionsTab data={dashboardData} refresh={this.fetchDashboardData} />;
      case 'support':
        return <SupportTab data={dashboardData} refresh={this.fetchDashboardData} />;
      case 'profile':
        return <ProfileTab user={dashboardData.user || user} refresh={this.fetchDashboardData} />;
      case 'admin':
        return <AdminTab refresh={this.fetchDashboardData} />;
      default:
        return <OverviewTab data={dashboardData} refresh={this.fetchDashboardData} setTab={this.setTab} />;
    }
  };

  render() {
    const { user, logout } = this.context;
    const { activeTab, sidebarOpen, loading, dashboardData } = this.state;

    if (!user) {
      return (
        <div className="min-h-screen bg-[#090E18] text-white flex flex-col items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#FFD700]/30 rounded-3xl p-8 max-w-md text-center space-y-4">
            <ShieldCheck className="w-12 h-12 text-[#FFD700] mx-auto" />
            <h2 className="text-2xl font-bold">Authentication Required</h2>
            <p className="text-xs text-gray-400">Please sign in to access your GoldBod Pro investor dashboard.</p>
            <button
              onClick={() => this.props.router.navigate('/')}
              className="btn-gold w-full py-2.5 text-xs font-bold"
            >
              Return to Home Page
            </button>
          </div>
        </div>
      );
    }

    const currentUser = dashboardData?.user || user;

    const navItems = [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'deposit', label: 'Deposit Funds', icon: ArrowDownCircle },
      { id: 'withdraw', label: 'Withdraw', icon: ArrowUpCircle },
      { id: 'investments', label: 'My Investments', icon: TrendingUp },
      { id: 'mining', label: 'Cloud Mining', icon: Cpu },
      { id: 'referral', label: 'Affiliate System', icon: Users },
      { id: 'transactions', label: 'Transaction History', icon: History },
      { id: 'support', label: 'Support Tickets', icon: LifeBuoy },
      { id: 'profile', label: 'Profile & Settings', icon: User }
    ];

    if (currentUser?.role === 'admin') {
      navItems.unshift({ id: 'admin', label: 'Admin Portal', icon: ShieldCheck });
    }

    return (
      <div className="min-h-screen bg-[#090E18] text-white flex">
        
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#060A12] border-r border-[#FFD700]/20 p-5 shrink-0 justify-between sticky top-0 h-screen">
          <div>
            {/* Branding Header */}
            <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F7C948] via-[#FFD700] to-[#FFF085] p-0.5">
                <div className="w-full h-full bg-[#090E18] rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-[#FFD700]" />
                </div>
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white font-mono tracking-wide">GoldBod <span className="text-[#FFD700]">Pro</span></h1>
                <p className="text-[10px] text-gray-400 font-semibold">User Portal</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-6 space-y-1.5">
              {navItems.map((item) => {
                const IconComp = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => this.setTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#FFD700]/20 to-amber-500/10 text-[#FFD700] border border-[#FFD700]/40 shadow-lg'
                        : 'text-gray-400 hover:bg-[#0F172A] hover:text-white'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${active ? 'text-[#FFD700]' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Info Bottom */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-3 bg-[#0F172A] p-3 rounded-2xl border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-[#FFD700] flex items-center justify-center font-bold text-sm">
                {currentUser.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={() => { logout(); this.props.router.navigate('/'); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Account</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Dashboard Header Bar */}
          <header className="bg-[#060A12]/90 backdrop-blur-md border-b border-[#FFD700]/20 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <button
                onClick={() => this.setState({ sidebarOpen: !sidebarOpen })}
                className="lg:hidden p-2 rounded-xl bg-[#0F172A] text-[#FFD700] border border-amber-500/20"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-lg font-bold text-white capitalize">{activeTab}</h2>
                <p className="text-xs text-gray-400 hidden sm:block">GoldBod Pro Multi-Asset Portfolio Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#0F172A] border border-[#FFD700]/30 px-4 py-2 rounded-2xl flex items-center gap-2">
                <span className="text-xs text-gray-400 hidden sm:inline">Balance:</span>
                <span className="text-sm font-black text-gold-gradient font-mono">
                  ${currentUser.balance?.toFixed(2)} USDT
                </span>
              </div>

              <button
                onClick={this.fetchDashboardData}
                className="p-2.5 rounded-2xl bg-[#0F172A] border border-slate-800 text-gray-400 hover:text-[#FFD700] transition-colors"
                title="Refresh Balance & Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FFD700]' : ''}`} />
              </button>
            </div>
          </header>

          {/* Mobile Sidebar Overlay Drawer */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
              <div className="w-64 bg-[#060A12] h-full p-5 flex flex-col justify-between border-r border-[#FFD700]/30">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <span className="font-bold text-white font-mono">GoldBod Pro</span>
                    <button onClick={() => this.setState({ sidebarOpen: false })}>
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <nav className="mt-4 space-y-1">
                    {navItems.map((item) => {
                      const IconComp = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => this.setTab(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                            active
                              ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40'
                              : 'text-gray-400 hover:bg-[#0F172A]'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <button
                  onClick={() => { logout(); this.props.router.navigate('/'); }}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Tab Viewport */}
          <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
            {this.renderTabContent()}
          </main>

        </div>

      </div>
    );
  }
}

export default withRouter(UserDashboardLayout);
