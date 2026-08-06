import React, { Component } from 'react';
import api from '../../services/api.js';
import { QrCode, Copy, Check, Upload, ArrowDownCircle, ShieldCheck, AlertCircle } from 'lucide-react';

class DepositTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGateway: 'USDT_TRC20',
      amount: 500,
      txHash: '',
      proofUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=400&q=80',
      copiedAddress: false,
      submitting: false,
      successMsg: null,
      errorMsg: null
    };
  }

  copyWalletAddress = (address) => {
    navigator.clipboard.writeText(address);
    this.setState({ copiedAddress: true });
    setTimeout(() => this.setState({ copiedAddress: false }), 2000);
  };

  handleSubmitDeposit = async (e) => {
    e.preventDefault();
    const { amount, selectedGateway, txHash, proofUrl } = this.state;
    const { refresh } = this.props;

    this.setState({ submitting: true, successMsg: null, errorMsg: null });

    try {
      const res = await api.post('/user/deposit', {
        amount: Number(amount),
        gateway: selectedGateway.replace('_', ' '),
        txHash,
        proofUrl
      });

      this.setState({
        submitting: false,
        successMsg: res.data.message,
        txHash: ''
      });

      if (refresh) refresh();

    } catch (err) {
      this.setState({
        submitting: false,
        errorMsg: err.response?.data?.error || 'Failed to submit deposit.'
      });
    }
  };

  render() {
    const { data } = this.props;
    const { selectedGateway, amount, txHash, proofUrl, copiedAddress, submitting, successMsg, errorMsg } = this.state;
    const { wallets, deposits } = data;

    const gatewayList = [
      { id: 'USDT_TRC20', name: 'USDT (TRC20)', badge: 'TRON Network • Popular' },
      { id: 'BTC', name: 'Bitcoin (BTC)', badge: 'Crypto Standard' },
      { id: 'ETH', name: 'Ethereum (ETH)', badge: 'Web3 Gateway' }
    ];

    const defaultWallets = {
      USDT_TRC20: {
        address: 'TMmpdCUFH9xJ5efivRdyAw8MBVGqdsJmpX',
        notice: 'Deposits via smart contracts are not supported with the exception of ETH via ERC20, Arbitrum & Optimism network or BNB via BSC network.',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TMmpdCUFH9xJ5efivRdyAw8MBVGqdsJmpX'
      },
      BTC: {
        address: '15512yaegwoVpZ2mjnsZ8mmVdhMnbcYybZ',
        notice: 'Binance supports deposits from all BTC addresses (starting with "1", "3", "bc1p" and "bc1q")',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=15512yaegwoVpZ2mjnsZ8mmVdhMnbcYybZ'
      },
      ETH: {
        address: '0x450306b9721d2cc03a70f3c6aa9b7a61b0137b44',
        notice: 'Please do not send validator rewards to your Binance deposit address, as they will not be credited and funds may be lost.',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x450306b9721d2cc03a70f3c6aa9b7a61b0137b44'
      }
    };

    const currentWallet = wallets?.[selectedGateway] || defaultWallets[selectedGateway] || defaultWallets.USDT_TRC20;

    return (
      <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
        
        {/* Title */}
        <div>
          <h2 className="text-2xl font-black text-white">Deposit Crypto Funds</h2>
          <p className="text-xs text-gray-400 mt-1">
            Send payment to the official GoldBod Pro address below, then submit your transaction hash. Deposits remain pending until verified on the network and updated in database.
          </p>
        </div>

        {/* Deposit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Select Gateway & Wallet Address Details */}
          <div className="lg:col-span-6 bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-6 shadow-2xl space-y-6">
            
            {/* Gateway Selection Buttons */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-3">
                Select Deposit Gateway
              </label>
              <div className="space-y-2">
                {gatewayList.map((gw) => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => this.setState({ selectedGateway: gw.id })}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold border transition-all ${
                      selectedGateway === gw.id
                        ? 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]'
                        : 'bg-[#090E18] text-gray-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{gw.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#FFD700]">
                      {gw.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet Address Box */}
            <div className="bg-[#090E18] border border-amber-500/30 rounded-2xl p-5 text-center space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Official Deposit Address ({selectedGateway.replace('_', ' ')})
              </span>

              {/* QR Code display */}
              <div className="flex justify-center my-2">
                <div className="p-2.5 bg-white rounded-2xl shadow-lg border border-amber-500/40">
                  <img 
                    src={currentWallet.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentWallet.address}`} 
                    alt="Deposit Wallet QR Code" 
                    className="w-32 h-32 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#0F172A] border border-slate-800 rounded-xl p-2.5">
                <input
                  type="text"
                  readOnly
                  value={currentWallet.address}
                  className="w-full bg-transparent text-xs font-mono text-white focus:outline-none"
                />
                <button
                  onClick={() => this.copyWalletAddress(currentWallet.address)}
                  className="btn-gold !py-1.5 !px-3 text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedAddress ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-[11px] text-amber-400 flex items-center justify-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                Send only {selectedGateway.replace('_', ' ')} to this address.
              </p>

              {/* Binance Network Specific Notice */}
              {currentWallet.notice && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left leading-relaxed font-medium space-y-1">
                  <span className="font-extrabold uppercase text-[10px] tracking-wider text-[#FFD700] block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" /> Binance Network Notice:
                  </span>
                  <p className="text-gray-200">{currentWallet.notice}</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Deposit Form */}
          <div className="lg:col-span-6 bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-3xl p-6 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-white">Submit Payment Details</h3>

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={this.handleSubmitDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Deposit Amount (USD / USDT Equivalent)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={50}
                    required
                    value={amount}
                    onChange={(e) => this.setState({ amount: e.target.value })}
                    className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white font-mono text-base focus:border-[#FFD700] focus:outline-none"
                  />
                  <span className="absolute right-4 top-3 text-xs font-bold text-[#FFD700]">USD / USDT</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Transaction Hash / Reference ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paste TxHash e.g. 0x8a7f92b41..."
                  value={txHash}
                  onChange={(e) => this.setState({ txHash: e.target.value })}
                  className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-[#FFD700] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Upload Payment Screenshot / Proof URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={proofUrl}
                    onChange={(e) => this.setState({ proofUrl: e.target.value })}
                    className="w-full bg-[#090E18] border border-amber-500/30 rounded-xl px-3 py-2.5 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                {submitting ? 'Submitting Request...' : 'Confirm Deposit Submission'}
              </button>
            </form>
          </div>

        </div>

        {/* Deposits History */}
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/25 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4">My Recent Deposits</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#090E18] font-semibold text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Gateway</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Tx Hash</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {deposits?.map((d) => (
                  <tr key={d.id}>
                    <td className="px-4 py-3 font-bold text-amber-400">{d.gateway}</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">${d.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 font-mono text-gray-400 truncate max-w-[120px]">{d.txHash}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        d.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : d.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }
}

export default DepositTab;
