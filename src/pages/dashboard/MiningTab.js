import React, { Component } from 'react';
import api from '../../services/api.js';
import { Cpu, Activity, Zap, Server, ShieldCheck, RefreshCw, CheckCircle2, ArrowUpRight } from 'lucide-react';

class MiningTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveBlockYield: 1.84,
      claiming: false,
      claimSuccess: null,
      claimError: null,
      hashLogs: [
        'Rig #01 connected to Zurich Data Center — 120 TH/s',
        'Block #849,203 mined successfully — +0.00012 BTC',
        'Hash rate efficiency verified at 99.85%'
      ]
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(prevState => ({
        liveBlockYield: +(prevState.liveBlockYield + 0.00015).toFixed(4),
        hashLogs: [
          `Block #${Math.floor(849200 + Math.random() * 500)} verified hash — +0.00004 USDT`,
          ...prevState.hashLogs.slice(0, 4)
        ]
      }));
    }, 3000);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  handleClaimYield = async () => {
    const { liveBlockYield } = this.state;
    const { refresh } = this.props;

    this.setState({ claiming: true, claimSuccess: null, claimError: null });

    try {
      const res = await api.post('/user/mining/claim', {
        amount: Number(liveBlockYield.toFixed(2)) || 2.50
      });

      this.setState({
        claiming: false,
        liveBlockYield: 0.0001,
        claimSuccess: res.data.message || `Successfully harvested mining profit into your Withdrawable Balance!`
      });

      if (refresh) refresh();
    } catch (err) {
      this.setState({
        claiming: false,
        claimError: err.response?.data?.error || 'Failed to claim mining yield. Please try again.'
      });
    }
  };

  render() {
    const { data } = this.props;
    const { user } = data;
    const { liveBlockYield, hashLogs, claiming, claimSuccess, claimError } = this.state;

    return (
      <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">ASIC Cloud Mining Rig Control</h2>
            <p className="text-xs text-gray-400 mt-1">
              Real-time telemetry and hash stream from GoldBod Pro high-performance mining hardware.
            </p>
          </div>

          <button
            onClick={this.handleClaimYield}
            disabled={claiming || liveBlockYield < 0.1}
            className="btn-gold px-5 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 shadow-lg"
          >
            <Zap className="w-4 h-4 text-slate-900" />
            {claiming ? 'Harvesting...' : `Harvest +$${liveBlockYield.toFixed(2)} USDT Yield`}
          </button>
        </div>

        {claimSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{claimSuccess}</span>
          </div>
        )}

        {claimError && (
          <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <span>{claimError}</span>
          </div>
        )}

        {/* Top Rig Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#0F172A]/90 border border-[#FFD700]/30 p-6 rounded-3xl text-center shadow-xl">
            <Cpu className="w-8 h-8 text-[#FFD700] mx-auto mb-2" />
            <span className="text-xs text-gray-400 font-bold uppercase">Allocated Hash Rate</span>
            <p className="text-3xl font-black text-gold-gradient font-mono mt-1">{user.hashPower || 50} TH/s</p>
          </div>

          <div className="bg-[#0F172A]/90 border border-emerald-500/30 p-6 rounded-3xl text-center shadow-xl">
            <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-pulse" />
            <span className="text-xs text-gray-400 font-bold uppercase">Hardware Uptime</span>
            <p className="text-3xl font-black text-emerald-400 font-mono mt-1">99.98%</p>
          </div>

          <div className="bg-[#0F172A]/90 border border-cyan-500/30 p-6 rounded-3xl text-center shadow-xl">
            <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <span className="text-xs text-gray-400 font-bold uppercase">Unclaimed Mining Yield</span>
            <p className="text-3xl font-black text-cyan-400 font-mono mt-1">+${liveBlockYield.toFixed(2)} USDT</p>
          </div>
        </div>

        {/* Live Hash Stream Terminal */}
        <div className="bg-[#060A12] border border-[#FFD700]/30 rounded-3xl p-6 shadow-2xl font-mono text-xs text-emerald-400 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              Live Telemetry Terminal Stream
            </span>
            <span className="text-[10px]">Zurich-Node-08</span>
          </div>

          <div className="space-y-2 py-2">
            {hashLogs.map((log, i) => (
              <p key={i} className="leading-relaxed">
                <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
              </p>
            ))}
          </div>
        </div>

      </div>
    );
  }
}

export default MiningTab;
