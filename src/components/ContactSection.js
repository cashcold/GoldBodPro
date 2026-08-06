import React, { Component } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

class ContactSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      subject: '',
      message: '',
      submitted: false
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ submitted: true });
    setTimeout(() => {
      this.setState({
        name: '',
        email: '',
        subject: '',
        message: '',
        submitted: false
      });
    }, 4000);
  };

  render() {
    const { name, email, subject, message, submitted } = this.state;

    return (
      <section className="py-20 bg-[#090E18] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#FFD700]/30 text-xs font-semibold text-[#FFD700] uppercase">
                Get In Touch
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                24/7 Global <span className="text-gold-gradient">Customer Support</span>
              </h2>

              <p className="text-gray-300 text-sm leading-relaxed">
                Have questions about custom institutional cloud mining, deposits, or partner programs? Send us a message and our support specialist will respond within 15 minutes.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 bg-[#0F172A] p-4 rounded-2xl border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#FFD700] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase font-semibold">Email Support</h4>
                    <p className="text-sm font-bold text-white font-mono">support@goldbod.pro</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#0F172A] p-4 rounded-2xl border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#FFD700] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase font-semibold">Hotline</h4>
                    <p className="text-sm font-bold text-white font-mono">+1 (800) 555-GOLDBOD</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#0F172A] p-4 rounded-2xl border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#FFD700] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase font-semibold">Headquarters</h4>
                    <p className="text-xs font-bold text-white">Financial District, Zurich & London</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-[#0F172A]/90 backdrop-blur-2xl border border-[#FFD700]/30 rounded-3xl p-8 sm:p-10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Send Us a Direct Message</h3>

              {submitted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Your message has been sent successfully! Our support representative will contact you shortly.</span>
                </div>
              )}

              <form onSubmit={this.handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => this.setState({ name: e.target.value })}
                      placeholder="Alex Vance"
                      className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white text-sm focus:border-[#FFD700] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                      placeholder="investor@goldbod.pro"
                      className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white text-sm focus:border-[#FFD700] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => this.setState({ subject: e.target.value })}
                    placeholder="Investment Inquiry"
                    className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white text-sm focus:border-[#FFD700] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => this.setState({ message: e.target.value })}
                    placeholder="Enter details regarding your inquiry..."
                    className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white text-sm focus:border-[#FFD700] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold w-full py-3.5 text-sm uppercase font-bold tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>
    );
  }
}

export default ContactSection;
