import mongoose, { Schema } from 'mongoose';

// User Schema
const UserGoldBodProSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  country: { type: String, default: 'United States' },
  phone: { type: String, default: '' },
  balance: { type: Number, default: 1250.00 },
  activeInvestment: { type: Number, default: 1000.00 },
  todaysProfit: { type: Number, default: 45.50 },
  totalProfit: { type: Number, default: 380.00 },
  referralIncome: { type: Number, default: 125.00 },
  pendingWithdrawals: { type: Number, default: 0.00 },
  hashPower: { type: Number, default: 450 }, // TH/s
  kycStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
  kycDocType: { type: String, default: '' },
  kycDocUrl: { type: String, default: '' },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

// Investment Plan Schema
const PlanGoldBodProSchema = new Schema({
  name: { type: String, required: true },
  badge: { type: String, default: 'Popular' },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  profitPercent: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  capitalReturn: { type: Boolean, default: true },
  active: { type: Boolean, default: true }
});

// Deposit Schema
const DepositGoldBodProSchema = new Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  amount: { type: Number, required: true },
  gateway: { type: String, required: true }, // BTC, ETH, USDT_TRC20, USDT_BEP20, MOBILE_MONEY
  txHash: { type: String, required: true },
  proofUrl: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Withdrawal Schema
const WithdrawalGoldBodProSchema = new Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  amount: { type: Number, required: true },
  gateway: { type: String, required: true },
  walletAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Transaction Schema
const TransactionGoldBodProSchema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true }, // Deposit, Withdrawal, Plan Profit, Plan Capital, Mining Yield, Referral Bonus
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USDT' },
  description: { type: String, required: true },
  status: { type: String, default: 'Completed' },
  createdAt: { type: Date, default: Date.now }
});

// User Active Investment Schema
const ActiveInvestmentGoldBodProSchema = new Schema({
  userId: { type: String, required: true },
  planName: { type: String, required: true },
  amount: { type: Number, required: true },
  profitPercent: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  dailyReturn: { type: Number, required: true },
  totalReturn: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

// Cloud Mining Investment Schema
const MiningInvestmentGoldBodProSchema = new Schema({
  userId: { type: String, required: true },
  hashPower: { type: Number, required: true }, // in TH/s
  cost: { type: Number, required: true },
  dailyYieldEst: { type: Number, required: true }, // USDT
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

// Admin Wallet Settings Schema
const WalletGoldBodProSchema = new Schema({
  currency: { type: String, required: true, unique: true }, // BTC, ETH, USDT_TRC20, USDT_BEP20, MOBILE_MONEY
  address: { type: String, required: true },
  qrCodeUrl: { type: String, default: '' },
  instructions: { type: String, default: '' }
});

// Blog Schema
const BlogGoldBodProSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Crypto Market' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80' },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'GoldBod Pro Team' },
  createdAt: { type: Date, default: Date.now }
});

// FAQ Schema
const FaqGoldBodProSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' }
});

// Support Ticket Schema
const SupportTicketGoldBodProSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String, default: 'General' },
  priority: { type: String, default: 'Medium' },
  messages: [{
    sender: { type: String, required: true }, // 'user' or 'admin'
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  createdAt: { type: Date, default: Date.now }
});

// Export Schemas
export const UserSchema = UserGoldBodProSchema;
export const PlanSchema = PlanGoldBodProSchema;
export const DepositSchema = DepositGoldBodProSchema;
export const WithdrawalSchema = WithdrawalGoldBodProSchema;
export const TransactionSchema = TransactionGoldBodProSchema;
export const ActiveInvestmentSchema = ActiveInvestmentGoldBodProSchema;
export const MiningInvestmentSchema = MiningInvestmentGoldBodProSchema;
export const WalletSchema = WalletGoldBodProSchema;
export const BlogSchema = BlogGoldBodProSchema;
export const FaqSchema = FaqGoldBodProSchema;
export const SupportTicketSchema = SupportTicketGoldBodProSchema;

export const UserModelGoldBodPro = mongoose.models.UserGoldBodPro || mongoose.model('UserGoldBodPro', UserGoldBodProSchema);
export const PlanModelGoldBodPro = mongoose.models.PlanGoldBodPro || mongoose.model('PlanGoldBodPro', PlanGoldBodProSchema);
export const DepositModelGoldBodPro = mongoose.models.DepositGoldBodPro || mongoose.model('DepositGoldBodPro', DepositGoldBodProSchema);
export const WithdrawalModelGoldBodPro = mongoose.models.WithdrawalGoldBodPro || mongoose.model('WithdrawalGoldBodPro', WithdrawalGoldBodProSchema);
export const TransactionModelGoldBodPro = mongoose.models.TransactionGoldBodPro || mongoose.model('TransactionGoldBodPro', TransactionGoldBodProSchema);
export const ActiveInvestmentModelGoldBodPro = mongoose.models.ActiveInvestmentGoldBodPro || mongoose.model('ActiveInvestmentGoldBodPro', ActiveInvestmentGoldBodProSchema);
export const MiningModelGoldBodPro = mongoose.models.MiningGoldBodPro || mongoose.model('MiningGoldBodPro', MiningInvestmentGoldBodProSchema);
export const WalletModelGoldBodPro = mongoose.models.WalletGoldBodPro || mongoose.model('WalletGoldBodPro', WalletGoldBodProSchema);
export const BlogModelGoldBodPro = mongoose.models.BlogGoldBodPro || mongoose.model('BlogGoldBodPro', BlogGoldBodProSchema);
export const FaqModelGoldBodPro = mongoose.models.FaqGoldBodPro || mongoose.model('FaqGoldBodPro', FaqGoldBodProSchema);
export const SupportTicketModelGoldBodPro = mongoose.models.SupportTicketGoldBodPro || mongoose.model('SupportTicketGoldBodPro', SupportTicketGoldBodProSchema);

// Backwards compatibility exports
export const UserModel = UserModelGoldBodPro;
export const PlanModel = PlanModelGoldBodPro;
export const DepositModel = DepositModelGoldBodPro;
export const WithdrawalModel = WithdrawalModelGoldBodPro;
export const TransactionModel = TransactionModelGoldBodPro;
export const ActiveInvestmentModel = ActiveInvestmentModelGoldBodPro;
export const MiningModel = MiningModelGoldBodPro;
export const WalletModel = WalletModelGoldBodPro;
export const BlogModel = BlogModelGoldBodPro;
export const FaqModel = FaqModelGoldBodPro;
export const SupportTicketModel = SupportTicketModelGoldBodPro;

