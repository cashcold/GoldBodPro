import mongoose, { Schema, Document } from 'mongoose';

// 1. User Schema & Model (collection: 'users')
export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  password?: string;
  passwordHash?: string;
  role: 'user' | 'admin';
  country?: string;
  phone?: string;
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  activeInvestment: number;
  todaysProfit: number;
  totalProfit: number;
  referralIncome: number;
  pendingWithdrawals: number;
  hashPower: number;
  firstDepositRewardGiven: boolean;
  claimedMilestones?: number[];
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  kycDocType?: string;
  kycDocUrl?: string;
  referralCode: string;
  referredBy?: string | null;
  createdAt: Date;
}

const UserGoldBodProSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, default: '' },
  passwordHash: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  country: { type: String, default: 'United States' },
  phone: { type: String, default: '' },
  balance: { type: Number, default: 5.00 },
  totalDeposited: { type: Number, default: 0.00 },
  totalWithdrawn: { type: Number, default: 0.00 },
  activeInvestment: { type: Number, default: 0.00 },
  todaysProfit: { type: Number, default: 0.00 },
  totalProfit: { type: Number, default: 0.00 },
  referralIncome: { type: Number, default: 0.00 },
  pendingWithdrawals: { type: Number, default: 0.00 },
  hashPower: { type: Number, default: 50 }, // TH/s
  firstDepositRewardGiven: { type: Boolean, default: false },
  claimedMilestones: { type: [Number], default: [] },
  kycStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
  kycDocType: { type: String, default: '' },
  kycDocUrl: { type: String, default: '' },
  referralCode: { type: String, default: '' },
  referredBy: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
}, { strict: false, timestamps: true });

// 2. Investment Plan Schema & Model (collection: 'plans')
const PlanGoldBodProSchema = new Schema({
  id: { type: String },
  name: { type: String, required: true },
  badge: { type: String, default: 'Popular' },
  tag: { type: String, default: '' },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  profitPercent: { type: Number, required: true },
  dailyPercentage: { type: Number },
  durationDays: { type: Number, required: true },
  capitalReturn: { type: Boolean, default: true },
  active: { type: Boolean, default: true }
}, { strict: false });

// 3. Deposit / Recharge Schema & Model (collection: 'deposits')
const DepositGoldBodProSchema = new Schema({
  userId: { type: Schema.Types.Mixed, required: true },
  userEmail: { type: String },
  userName: { type: String },
  amount: { type: Number, required: true },
  gateway: { type: String, required: true }, // BTC, ETH, USDT_TRC20, USDT_BEP20, MOBILE_MONEY
  walletAddress: { type: String },
  txHash: { type: String, default: '' },
  proofUrl: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}, { strict: false, timestamps: true });

// 4. Withdrawal Schema & Model (collection: 'withdrawals')
const WithdrawalGoldBodProSchema = new Schema({
  userId: { type: Schema.Types.Mixed, required: true },
  userEmail: { type: String },
  userName: { type: String },
  amount: { type: Number, required: true },
  gateway: { type: String, required: true },
  walletAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}, { strict: false, timestamps: true });

// 5. Transaction Schema & Model (collection: 'transactions')
const TransactionGoldBodProSchema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true }, // Deposit, Withdrawal, Plan Profit, Plan Capital, Mining Yield, Referral Bonus
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USDT' },
  description: { type: String, default: '' },
  status: { type: String, default: 'Completed' },
  createdAt: { type: Date, default: Date.now }
}, { strict: false, timestamps: true });

// 6. User Active Investment Schema & Model (collection: 'investments')
const ActiveInvestmentGoldBodProSchema = new Schema({
  userId: { type: Schema.Types.Mixed, required: true },
  planId: { type: String },
  planName: { type: String, required: true },
  amount: { type: Number, required: true },
  profitPercent: { type: Number, default: 5 },
  dailyROI: { type: Number },
  dailyReturn: { type: Number },
  durationDays: { type: Number, required: true },
  totalReturn: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  completedAt: { type: Date },
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
}, { strict: false, timestamps: true });

// 7. Cloud Mining Investment Schema & Model (collection: 'mining_investments')
const MiningInvestmentGoldBodProSchema = new Schema({
  userId: { type: Schema.Types.Mixed, required: true },
  hashPower: { type: Number, required: true }, // in TH/s
  cost: { type: Number, required: true },
  dailyYieldEst: { type: Number, default: 0 }, // USDT
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
}, { strict: false, timestamps: true });

// 8. Admin Wallet Settings Schema & Model (collection: 'wallets')
const WalletGoldBodProSchema = new Schema({
  currency: { type: String, required: true }, // BTC, ETH, USDT_TRC20, USDT_BEP20, MOBILE_MONEY
  address: { type: String, required: true },
  qrCodeUrl: { type: String, default: '' },
  instructions: { type: String, default: '' }
}, { strict: false });

// 9. System Reserve Schema & Model (collection: 'system_reserves')
const SystemReserveGoldBodProSchema = new Schema({
  companyMoney: { type: Number, default: 876834764 },
  totalDeposited: { type: Number, default: 284520450 },
  totalWithdrawn: { type: Number, default: 142850800 },
  activeInvestors: { type: Number, default: 28450 },
  lastUpdated: { type: Date, default: Date.now }
}, { strict: false });

// 10. Blog Schema & Model (collection: 'blogs')
const BlogGoldBodProSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Crypto Market' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80' },
  summary: { type: String, default: '' },
  content: { type: String, default: '' },
  author: { type: String, default: 'GoldBod Pro Team' },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

// 11. FAQ Schema & Model (collection: 'faqs')
const FaqGoldBodProSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' }
}, { strict: false });

// 12. Support Ticket Schema & Model (collection: 'support_tickets')
const SupportTicketGoldBodProSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, default: '' },
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
}, { strict: false });

// 13. Testimonial Schema & Model (collection: 'testimonials')
const TestimonialGoldBodProSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Investor' },
  avatar: { type: String, default: '' },
  content: { type: String, required: true },
  rating: { type: Number, default: 5 },
  verified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

// Mongoose Models with explicit collection names
export const UserModelGoldBodPro = mongoose.models.userGoldBodPro || mongoose.models.UserGoldBodPro || mongoose.model('userGoldBodPro', UserGoldBodProSchema, 'users');
export const PlanModelGoldBodPro = mongoose.models.planGoldBodPro || mongoose.models.PlanGoldBodPro || mongoose.model('planGoldBodPro', PlanGoldBodProSchema, 'investment_plans');
export const DepositModelGoldBodPro = mongoose.models.depositGoldBodPro || mongoose.models.DepositGoldBodPro || mongoose.model('depositGoldBodPro', DepositGoldBodProSchema, 'deposits');
export const RechargeModelGoldBodPro = mongoose.models.rechargeGoldBodPro || mongoose.model('rechargeGoldBodPro', DepositGoldBodProSchema, 'deposits');
export const WithdrawalModelGoldBodPro = mongoose.models.withdrawalGoldBodPro || mongoose.models.WithdrawalGoldBodPro || mongoose.model('withdrawalGoldBodPro', WithdrawalGoldBodProSchema, 'withdrawals');
export const TransactionModelGoldBodPro = mongoose.models.transactionGoldBodPro || mongoose.models.TransactionGoldBodPro || mongoose.model('transactionGoldBodPro', TransactionGoldBodProSchema, 'transactions');
export const ActiveInvestmentModelGoldBodPro = mongoose.models.investmentGoldBodPro || mongoose.models.ActiveInvestmentGoldBodPro || mongoose.model('investmentGoldBodPro', ActiveInvestmentGoldBodProSchema, 'investments');
export const MiningModelGoldBodPro = mongoose.models.MiningGoldBodPro || mongoose.model('MiningGoldBodPro', MiningInvestmentGoldBodProSchema, 'mining_investments');
export const WalletModelGoldBodPro = mongoose.models.WalletGoldBodPro || mongoose.model('WalletGoldBodPro', WalletGoldBodProSchema, 'wallets');
export const SystemReserveModelGoldBodPro = mongoose.models.systemReserveGoldBodPro || mongoose.model('systemReserveGoldBodPro', SystemReserveGoldBodProSchema, 'system_reserves');
export const BlogModelGoldBodPro = mongoose.models.BlogGoldBodPro || mongoose.model('BlogGoldBodPro', BlogGoldBodProSchema, 'blogs');
export const FaqModelGoldBodPro = mongoose.models.FaqGoldBodPro || mongoose.model('FaqGoldBodPro', FaqGoldBodProSchema, 'faqs');
export const SupportTicketModelGoldBodPro = mongoose.models.SupportTicketGoldBodPro || mongoose.model('SupportTicketGoldBodPro', SupportTicketGoldBodProSchema, 'support_tickets');
export const TestimonialModelGoldBodPro = mongoose.models.TestimonialGoldBodPro || mongoose.model('TestimonialGoldBodPro', TestimonialGoldBodProSchema, 'testimonials');

// Aliases matching schemas.ts and Models.ts conventions
export const UserModel = UserModelGoldBodPro;
export const userGoldBodPro = UserModelGoldBodPro;
export const PlanModel = PlanModelGoldBodPro;
export const planGoldBodPro = PlanModelGoldBodPro;
export const DepositModel = DepositModelGoldBodPro;
export const depositGoldBodPro = DepositModelGoldBodPro;
export const rechargeGoldBodPro = RechargeModelGoldBodPro;
export const WithdrawalModel = WithdrawalModelGoldBodPro;
export const withdrawalGoldBodPro = WithdrawalModelGoldBodPro;
export const TransactionModel = TransactionModelGoldBodPro;
export const transactionGoldBodPro = TransactionModelGoldBodPro;
export const ActiveInvestmentModel = ActiveInvestmentModelGoldBodPro;
export const investmentGoldBodPro = ActiveInvestmentModelGoldBodPro;
export const MiningModel = MiningModelGoldBodPro;
export const WalletModel = WalletModelGoldBodPro;
export const systemReserveGoldBodPro = SystemReserveModelGoldBodPro;
export const BlogModel = BlogModelGoldBodPro;
export const FaqModel = FaqModelGoldBodPro;
export const SupportTicketModel = SupportTicketModelGoldBodPro;
export const TestimonialModel = TestimonialModelGoldBodPro;

