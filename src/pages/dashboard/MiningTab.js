import React, { Component } from 'react';
import { Cpu, Activity, Zap, Server, ShieldCheck, RefreshCw } from 'lucide-react';

class MiningTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveBlockYield: 0.00042,
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
        liveBlockYield: +(prevState.liveBlockYield + 0.00003).toFixed(5),
        hashLogs: [
          `Block #${Math.floor(849200 + Math.random() * 500)} verified hash — +0.00004 USDT`,
          ...prevState.hashLogs.slice(0, 4)
        ]
      }));
    }, 4000);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  render() {
    const { data } = this.props;
    const { user } = data;
    const { liveBlockYield, hashLogs } = this.state;

    return (
      <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
        
        <div>
          <h2 className="text-2xl font-black text-white">ASIC Cloud Mining Rig Control</h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time telemetry and hash stream from GoldBod Pro high-performance mining hardware.
          </p>
        </div>

        {/* Top Rig Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#0F172A]/90 border border-[#FFD700]/30 p-6 rounded-3xl text-center shadow-xl">
            <Cpu className="w-8 h-8 text-[#FFD700] mx-auto mb-2" />
            <span className="text-xs text-gray-400 font-bold uppercase">Allocated Hash Rate</span>
            <p className="text-3xl font-black text-gold-gradient font-mono mt-1">{user.hashPower} TH/s</p>
          </div>

          <div className="bg-[#0F172A]/90 border border-emerald-500/30 p-6 rounded-3xl text-center shadow-xl">
            <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-pulse" />
            <span className="text-xs text-gray-400 font-bold uppercase">Hardware Uptime</span>
            <p className="text-3xl font-black text-emerald-400 font-mono mt-1">99.98%</p>
          </div>

          <div className="bg-[#0F172A]/90 border border-cyan-500/30 p-6 rounded-3xl text-center shadow-xl">
            <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <span className="text-xs text-gray-400 font-bold uppercase">Live Session Yield</span>
            <p className="text-3xl font-black text-cyan-400 font-mono mt-1">+${liveBlockYield} USDT</p>
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
