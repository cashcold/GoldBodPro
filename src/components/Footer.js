import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Send, ShieldCheck, Heart } from 'lucide-react';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      subscribed: false
    };
  }

  handleNewsletter = (e) => {
    e.preventDefault();
    this.setState({ subscribed: true, email: '' });
  };

  render() {
    const { email, subscribed } = this.state;

    return (
      <footer className="bg-[#060A12] border-t border-[#FFD700]/20 text-gray-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
            
            {/* Branding Column */}
            <div className="lg:col-span-4 space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F7C948] via-[#FFD700] to-[#FFF085] p-0.5 shadow-lg shadow-[#FFD700]/20">
                  <div className="w-full h-full bg-[#090E18] rounded-[14px] flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-[#FFD700]" />
                  </div>
                </div>
                <div>
                  <span className="font-extrabold text-xl text-white font-mono">GoldBod <span className="text-[#FFD700]">Pro</span></span>
                  <p className="text-[10px] text-gray-400">Secure Crypto Investment & Cloud Mining</p>
                </div>
              </Link>

              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                GoldBod Pro is a registered digital asset investment and high-tech cloud mining platform providing automated, multi-currency yields with zero hardware requirements.
              </p>

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>EV-SSL Certified & Multi-Sig Vault Encrypted</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/about" className="hover:text-[#FFD700] transition-colors">About Us</Link></li>
                <li><Link to="/plans" className="hover:text-[#FFD700] transition-colors">Investment Plans</Link></li>
                <li><Link to="/affiliate" className="hover:text-[#FFD700] transition-colors">Affiliate Program</Link></li>
                <li><Link to="/blog" className="hover:text-[#FFD700] transition-colors">Latest News</Link></li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support & Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/faq" className="hover:text-[#FFD700] transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-[#FFD700] transition-colors">Contact Us</Link></li>
                <li><Link to="/admin" className="hover:text-[#FFD700] transition-colors font-semibold text-amber-400">Admin Control Portal</Link></li>
                <li><a href="#terms" className="hover:text-[#FFD700] transition-colors">Terms of Service</a></li>
                <li><a href="#privacy" className="hover:text-[#FFD700] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Newsletter Subscription */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Stay Updated</h4>
              <p className="text-xs text-gray-400">
                Subscribe to our newsletter for market reports and bonus deposit offers.
              </p>

              {subscribed ? (
                <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                  ✓ Thank you for subscribing to GoldBod Pro updates!
                </p>
              ) : (
                <form onSubmit={this.handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full bg-[#090E18] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#FFD700] focus:outline-none"
                  />
                  <button type="submit" className="btn-gold !py-2.5 !px-4 text-xs shrink-0">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
            <p>© 2026 GoldBod Pro. All Rights Reserved.</p>
            <p className="flex items-center gap-1">
              Engineered with precision for global financial growth.
            </p>
          </div>

        </div>
      </footer>
    );
  }
}

export default Footer;
