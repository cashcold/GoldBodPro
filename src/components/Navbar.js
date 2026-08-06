import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import { withRouter } from './withRouter.js';
import MarketTicker from './MarketTicker.js';
import { 
  ShieldCheck, 
  Globe, 
  Menu, 
  X, 
  User, 
  LayoutDashboard, 
  LogOut, 
  Cpu, 
  ChevronDown,
  Sparkles,
  Lock
} from 'lucide-react';

class Navbar extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      mobileMenuOpen: false,
      scrolled: false,
      langOpen: false,
      selectedLang: 'English 🇺🇸'
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > 40) {
      this.setState({ scrolled: true });
    } else {
      this.setState({ scrolled: false });
    }
  };

  toggleMobileMenu = () => {
    this.setState(prevState => ({ mobileMenuOpen: !prevState.mobileMenuOpen }));
  };

  toggleLang = () => {
    this.setState(prevState => ({ langOpen: !prevState.langOpen }));
  };

  selectLanguage = (lang) => {
    this.setState({ selectedLang: lang, langOpen: false });
  };

  render() {
    const { user, logout, openAuthModal } = this.context;
    const { scrolled, mobileMenuOpen, langOpen, selectedLang } = this.state;
    const { router } = this.props;

    const languages = [
      'English 🇺🇸',
      'Spanish 🇪🇸',
      'German 🇩🇪',
      'French 🇫🇷',
      'Chinese 🇨🇳',
      'Russian 🇷🇺'
    ];

    return (
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#090E18]/95 backdrop-blur-md shadow-2xl border-b border-[#FFD700]/20' : 'bg-[#090E18]/90 backdrop-blur-sm border-b border-[#0F172A]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#F7C948] via-[#FFD700] to-[#FFF085] p-0.5 shadow-lg shadow-[#FFD700]/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#090E18] rounded-[14px] flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-[#FFD700] animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-2xl tracking-wider text-white font-mono">GoldBod</span>
                  <span className="text-[#FFD700] font-extrabold text-2xl font-mono">Pro</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium tracking-tight -mt-0.5">Secure Crypto & Cloud Mining</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-300">
              <Link to="/" className="hover:text-[#FFD700] transition-colors py-1">Home</Link>
              <Link to="/about" className="hover:text-[#FFD700] transition-colors py-1">About</Link>
              <Link to="/plans" className="hover:text-[#FFD700] transition-colors py-1">Investment Plans</Link>
              <a href="/#statistics" className="hover:text-[#FFD700] transition-colors py-1">Statistics</a>
              <Link to="/affiliate" className="hover:text-[#FFD700] transition-colors py-1">Affiliate</Link>
              <Link to="/faq" className="hover:text-[#FFD700] transition-colors py-1">FAQ</Link>
              <Link to="/blog" className="hover:text-[#FFD700] transition-colors py-1">Blog</Link>
              <Link to="/contact" className="hover:text-[#FFD700] transition-colors py-1">Contact</Link>
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              
              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={this.toggleLang}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-[#0F172A] hover:bg-[#1E293B] px-3 py-2 rounded-xl border border-amber-500/20 transition-all"
                >
                  <Globe className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>{selectedLang}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {langOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-[#0F172A] border border-[#FFD700]/30 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in">
                    {languages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => this.selectLanguage(lang)}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-[#FFD700]/10 hover:text-[#FFD700] transition-colors"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Authentication Status */}
              {user ? (
                <div className="flex items-center gap-3">
                  {user.role === 'admin' ? (
                    <Link 
                      to="/admin" 
                      className="btn-gold !py-2 !px-4 text-xs font-bold"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Admin Portal
                    </Link>
                  ) : (
                    <Link 
                      to="/dashboard" 
                      className="btn-gold !py-2 !px-4 text-xs font-bold"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard (${user.balance.toFixed(2)})
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="btn-outline-gold !py-2 !px-4 text-xs"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="btn-gold !py-2 !px-4 text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={this.toggleMobileMenu}
                className="p-2 rounded-xl bg-[#0F172A] text-gray-200 border border-amber-500/20"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-[#FFD700]" /> : <Menu className="w-6 h-6 text-[#FFD700]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#090E18] border-b border-[#FFD700]/20 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top">
            <nav className="flex flex-col gap-2 font-medium text-sm text-gray-300">
              <Link to="/" onClick={this.toggleMobileMenu} className="hover:text-[#FFD700] py-2 border-b border-gray-800">Home</Link>
              <Link to="/about" onClick={this.toggleMobileMenu} className="hover:text-[#FFD700] py-2 border-b border-gray-800">About</Link>
              <Link to="/plans" onClick={this.toggleMobileMenu} className="hover:text-[#FFD700] py-2 border-b border-gray-800">Investment Plans</Link>
              <Link to="/affiliate" onClick={this.toggleMobileMenu} className="hover:text-[#FFD700] py-2 border-b border-gray-800">Affiliate</Link>
              <Link to="/faq" onClick={this.toggleMobileMenu} className="hover:text-[#FFD700] py-2 border-b border-gray-800">FAQ</Link>
              <Link to="/blog" onClick={this.toggleMobileMenu} className="hover:text-[#FFD700] py-2 border-b border-gray-800">Blog</Link>
              <Link to="/contact" onClick={this.toggleMobileMenu} className="hover:text-[#FFD700] py-2 border-b border-gray-800">Contact</Link>
            </nav>

            <div className="pt-2 flex flex-col gap-3">
              {user ? (
                <>
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    onClick={this.toggleMobileMenu}
                    className="btn-gold w-full text-center text-xs"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Go to {user.role === 'admin' ? 'Admin Portal' : 'User Dashboard'}
                  </Link>
                  <button 
                    onClick={() => { logout(); this.toggleMobileMenu(); }}
                    className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { openAuthModal('login'); this.toggleMobileMenu(); }}
                    className="btn-outline-gold text-xs"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { openAuthModal('register'); this.toggleMobileMenu(); }}
                    className="btn-gold text-xs"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    );
  }
}

export default withRouter(Navbar);
