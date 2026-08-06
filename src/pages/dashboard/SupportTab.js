import React, { Component } from 'react';
import { LifeBuoy, Send, MessageSquare, CheckCircle, Clock } from 'lucide-react';

class SupportTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      category: 'General Inquiry',
      message: '',
      submitted: false,
      tickets: [
        {
          id: 'TICK-9081',
          subject: 'Deposit Confirmation Delay',
          category: 'Deposit',
          status: 'Resolved',
          date: '2025-02-18'
        },
        {
          id: 'TICK-9244',
          subject: 'Hash Power Upgrade Verification',
          category: 'Mining',
          status: 'Open',
          date: '2025-02-22'
        }
      ]
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { subject, category, tickets } = this.state;
    const newTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      category,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    this.setState({
      tickets: [newTicket, ...tickets],
      subject: '',
      message: '',
      submitted: true
    });

    setTimeout(() => {
      this.setState({ submitted: false });
    }, 4000);
  };

  render() {
    const { subject, category, message, submitted, tickets } = this.state;

    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-[#FFD700] flex items-center justify-center border border-[#FFD700]/30">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Investor Support Portal</h2>
              <p className="text-xs text-gray-400">24/7 Priority Support Desk for GoldBod Pro members</p>
            </div>
          </div>

          {submitted && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Your support ticket has been logged successfully! An assigned agent will respond shortly.</span>
            </div>
          )}

          <form onSubmit={this.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => this.setState({ subject: e.target.value })}
                  placeholder="E.g. Deposit Query"
                  className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => this.setState({ category: e.target.value })}
                  className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white text-xs focus:border-[#FFD700] focus:outline-none"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Deposit">Deposit</option>
                  <option value="Withdrawal">Withdrawal</option>
                  <option value="Mining">Mining Rig</option>
                  <option value="Account & Security">Account & Security</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">Message Details</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => this.setState({ message: e.target.value })}
                placeholder="Describe your query or issue in detail..."
                className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white text-xs focus:border-[#FFD700] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="btn-gold py-3 px-6 text-xs uppercase font-bold tracking-wider"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </form>
        </div>

        {/* Existing Tickets List */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Your Recent Support Tickets</h3>
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-[#090E18] border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#FFD700] font-bold">{t.id}</span>
                    <span className="text-xs text-gray-400">• {t.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{t.subject}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Submitted on {t.date}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    t.status === 'Resolved'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default SupportTab;
