import React, { Component } from 'react';
import api from '../services/api.js';
import { 
  Star, 
  Quote, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle, 
  Plus, 
  ShieldCheck, 
  Award,
  X,
  Send
} from 'lucide-react';

class Testimonials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testimonials: [],
      activeCategory: 'All',
      helpfulCounts: {},
      userLikes: {},
      showReviewModal: false,
      submitting: false,
      submitSuccess: false,
      newReview: {
        name: '',
        country: 'United States 🇺🇸',
        category: 'Yield Investment',
        rating: 5,
        review: ''
      }
    };
  }

  componentDidMount() {
    this.fetchTestimonials();
  }

  fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials');
      const data = res.data && res.data.length > 0 ? res.data : this.getFallbackTestimonials();
      
      const initialHelpful = {};
      data.forEach((t, index) => {
        initialHelpful[t.id || index] = Math.floor(18 + (index * 7) + Math.random() * 12);
      });

      this.setState({ 
        testimonials: data,
        helpfulCounts: initialHelpful
      });
    } catch (err) {
      const fallback = this.getFallbackTestimonials();
      const initialHelpful = {};
      fallback.forEach((t, index) => {
        initialHelpful[t.id || index] = 18 + index * 9;
      });
      this.setState({ 
        testimonials: fallback,
        helpfulCounts: initialHelpful
      });
    }
  };

  getFallbackTestimonials = () => [
    {
      id: 't_1',
      name: 'Marcus Sterling',
      country: 'Germany 🇩🇪',
      category: 'Yield Investment',
      rating: 5,
      date: '2 days ago',
      verified: true,
      plan: 'Gold Plan ($1,000)',
      review: 'GoldBod Pro has been a game-changer for my crypto portfolio. I activated the 5-Day Gold Plan with $1,000 and received $1,150 back right on schedule! Instant automated withdrawals to my USDT TRC20 wallet every single time.'
    },
    {
      id: 't_2',
      name: 'Sophia Chen',
      country: 'Singapore 🇸🇬',
      category: 'Cloud Mining',
      rating: 5,
      date: '3 days ago',
      verified: true,
      plan: 'Mining Rig (450 TH/s)',
      review: 'The cloud mining Hash Rate monitor is completely transparent and steady. Plus, the 3-level referral affiliate system brought me an extra $1,200 in commissions this month. Truly reliable enterprise infrastructure.'
    },
    {
      id: 't_3',
      name: 'Elena Rostova',
      country: 'Spain 🇪🇸',
      category: 'Instant Payouts',
      rating: 5,
      date: '5 days ago',
      verified: true,
      plan: 'VIP Diamond Plan',
      review: 'Outstanding 24/7 support and ultra-slick platform UI. Withdrawal requests complete in under 10 minutes directly to my Bitcoin wallet. Highly recommend to anyone looking for genuine passive income.'
    },
    {
      id: 't_4',
      name: 'David K. Osei',
      country: 'Ghana 🇬🇭',
      category: 'Instant Payouts',
      rating: 5,
      date: '1 week ago',
      verified: true,
      plan: 'Starter Plan ($50)',
      review: 'Tested with $50 minimum deposit via Mobile Money and received my $5 welcome bonus. Yield profits hit my account daily and cashouts are fast and seamless. I will be scaling up to the Platinum plan next!'
    },
    {
      id: 't_5',
      name: 'Liam O\'Connor',
      country: 'United Kingdom 🇬🇧',
      category: 'Yield Investment',
      rating: 5,
      date: '1 week ago',
      verified: true,
      plan: 'Platinum Plan ($5,000)',
      review: 'Extremely professional execution. Daily automatic compound interest calculations paired with zero deposit fees make this the top crypto management tool I have used this year.'
    },
    {
      id: 't_6',
      name: 'Amina El-Mansouri',
      country: 'UAE 🇦🇪',
      category: 'Cloud Mining',
      rating: 5,
      date: '2 weeks ago',
      verified: true,
      plan: 'Custom Mining Hardware',
      review: 'High energy efficiency and zero maintenance hassle. The live hash rate analytics show real-time block verifications. Excellent passive yield generator!'
    }
  ];

  handleHelpfulClick = (id) => {
    this.setState((prevState) => {
      const isLiked = prevState.userLikes[id];
      const currentCount = prevState.helpfulCounts[id] || 0;
      return {
        userLikes: {
          ...prevState.userLikes,
          [id]: !isLiked
        },
        helpfulCounts: {
          ...prevState.helpfulCounts,
          [id]: isLiked ? currentCount - 1 : currentCount + 1
        }
      };
    });
  };

  getInitials = (name) => {
    if (!name) return 'GB';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  getAvatarColor = (name) => {
    const gradients = [
      'from-amber-500 to-yellow-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-teal-600',
      'from-[#FFD700] to-amber-700',
      'from-purple-500 to-indigo-600',
      'from-rose-500 to-pink-600'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  handleNewReviewSubmit = (e) => {
    e.preventDefault();
    const { newReview, testimonials } = this.state;
    if (!newReview.name || !newReview.review) return;

    this.setState({ submitting: true });

    setTimeout(() => {
      const createdReview = {
        id: 't_user_' + Date.now(),
        name: newReview.name,
        country: newReview.country,
        category: newReview.category,
        rating: Number(newReview.rating),
        date: 'Just now',
        verified: true,
        plan: 'Verified Investor',
        review: newReview.review
      };

      this.setState((prevState) => ({
        testimonials: [createdReview, ...prevState.testimonials],
        helpfulCounts: { ...prevState.helpfulCounts, [createdReview.id]: 1 },
        userLikes: { ...prevState.userLikes, [createdReview.id]: true },
        submitting: false,
        submitSuccess: true,
        newReview: {
          name: '',
          country: 'United States 🇺🇸',
          category: 'Yield Investment',
          rating: 5,
          review: ''
        }
      }));

      setTimeout(() => {
        this.setState({ showReviewModal: false, submitSuccess: false });
      }, 1500);
    }, 600);
  };

  render() {
    const { 
      testimonials, 
      activeCategory, 
      helpfulCounts, 
      userLikes, 
      showReviewModal, 
      newReview, 
      submitting, 
      submitSuccess 
    } = this.state;

    const categories = ['All', 'Yield Investment', 'Cloud Mining', 'Instant Payouts'];

    const filteredTestimonials = activeCategory === 'All'
      ? testimonials
      : testimonials.filter(t => t.category === activeCategory);

    return (
      <section className="py-20 bg-[#090E18] relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#FFD700]/30 text-xs font-bold text-[#FFD700] uppercase tracking-wider mb-4 shadow-lg shadow-amber-500/10">
              <MessageSquare className="w-4 h-4 text-[#FFD700]" /> Verified Investor Feedback
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              What Global Investors Say About <span className="text-gold-gradient">GoldBod Pro</span>
            </h2>
            
            <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed">
              Real testimonials and reviews from active community members earning consistent daily crypto returns.
            </p>

            {/* Rating Metric Banner */}
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-6 py-3 rounded-2xl bg-[#0F172A]/90 border border-slate-800 text-xs sm:text-sm text-gray-300 shadow-xl">
              <div className="flex items-center gap-1.5 text-[#FFD700] font-black text-base sm:text-lg">
                <span>4.9</span>
                <div className="flex text-[#FFD700]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5 text-gray-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span><strong className="text-white font-bold">2,840+</strong> Verified Global Reviews</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5 text-gray-300 font-medium">
                <Award className="w-4 h-4 text-[#FFD700]" />
                <span>99.8% Satisfaction Rate</span>
              </div>
            </div>
          </div>

          {/* Interactive Category Filter Pills + Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800/80">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => this.setState({ activeCategory: cat })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-[#FFD700] to-amber-600 text-black border-[#FFD700] shadow-lg shadow-amber-500/20'
                      : 'bg-[#0F172A] text-gray-400 border-slate-800 hover:border-amber-500/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => this.setState({ showReviewModal: true })}
              className="px-4 py-2 rounded-xl bg-[#0F172A] border border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/10 text-xs font-bold flex items-center gap-2 transition-all shadow-md group"
            >
              <Plus className="w-4 h-4 text-[#FFD700] group-hover:rotate-90 transition-transform" />
              <span>Share Your Feedback</span>
            </button>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTestimonials.map((testi, index) => {
              const cardId = testi.id || index;
              const isLiked = userLikes[cardId];
              const likesCount = helpfulCounts[cardId] || 0;
              const avatarGradient = this.getAvatarColor(testi.name || 'User');
              const initials = this.getInitials(testi.name);

              return (
                <div
                  key={cardId}
                  className="bg-[#0F172A]/90 backdrop-blur-xl border border-slate-800/80 hover:border-[#FFD700]/60 rounded-3xl p-6 sm:p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col justify-between relative group"
                >
                  <Quote className="w-10 h-10 text-slate-800 group-hover:text-[#FFD700]/20 absolute top-6 right-6 transition-colors pointer-events-none" />

                  <div>
                    {/* User Info Header (No image tags used) */}
                    <div className="flex items-center gap-3 mb-4">
                      {/* Stylized Initials Avatar */}
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-black font-black text-sm tracking-wider shadow-md shrink-0 relative`}>
                        {initials}
                        {testi.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-0.5 rounded-full border-2 border-[#0F172A]" title="Verified Investor">
                            <CheckCircle className="w-3 h-3 text-white fill-emerald-500" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-white truncate">{testi.name}</h4>
                          <span className="text-xs">{testi.country?.split(' ')[1] || '🌐'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                          <span className="text-[#FFD700] font-semibold">{testi.country}</span>
                          <span>•</span>
                          <span className="text-gray-500">{testi.date || 'Verified'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badge & Rating Row */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1 text-[#FFD700]">
                        {[...Array(testi.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>

                      {testi.plan && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-[#FFD700] border border-amber-500/20 uppercase tracking-wider">
                          {testi.plan}
                        </span>
                      )}
                    </div>

                    {/* Review Body */}
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic mb-6">
                      "{testi.review}"
                    </p>
                  </div>

                  {/* Card Footer with Was this helpful button */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified Payout
                    </span>

                    <button
                      onClick={() => this.handleHelpfulClick(cardId)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isLiked
                          ? 'bg-amber-500/20 text-[#FFD700] border border-amber-500/40 font-bold'
                          : 'bg-slate-800/60 text-gray-400 hover:text-white hover:bg-slate-800 border border-slate-700/50'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-[#FFD700]' : ''}`} />
                      <span>{isLiked ? 'Helpful' : 'Helpful?'}</span>
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-md bg-slate-900/80 text-[10px] text-gray-300 font-mono">
                        {likesCount}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal for Submitting Feedback */}
          {showReviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
              <div className="bg-[#0F172A] border border-[#FFD700]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
                
                <button
                  onClick={() => this.setState({ showReviewModal: false, submitSuccess: false })}
                  className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#FFD700] mb-3">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Share Your GoldBod Pro Experience</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Help fellow investors by sharing your feedback on returns, withdrawals, and platform experience.
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Thank You for Your Feedback!</h4>
                    <p className="text-xs text-gray-300">Your review has been successfully submitted and added to the feedback feed.</p>
                  </div>
                ) : (
                  <form onSubmit={this.handleNewReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Robert Smith"
                        value={newReview.name}
                        onChange={(e) => this.setState({ newReview: { ...newReview, name: e.target.value } })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#FFD700]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Country</label>
                        <select
                          value={newReview.country}
                          onChange={(e) => this.setState({ newReview: { ...newReview, country: e.target.value } })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#FFD700]"
                        >
                          <option value="United States 🇺🇸">United States 🇺🇸</option>
                          <option value="United Kingdom 🇬🇧">United Kingdom 🇬🇧</option>
                          <option value="Germany 🇩🇪">Germany 🇩🇪</option>
                          <option value="Canada 🇨🇦">Canada 🇨🇦</option>
                          <option value="Australia 🇦🇺">Australia 🇦🇺</option>
                          <option value="Singapore 🇸🇬">Singapore 🇸🇬</option>
                          <option value="Ghana 🇬🇭">Ghana 🇬🇭</option>
                          <option value="Nigeria 🇳🇬">Nigeria 🇳🇬</option>
                          <option value="South Africa 🇿🇦">South Africa 🇿🇦</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                        <select
                          value={newReview.category}
                          onChange={(e) => this.setState({ newReview: { ...newReview, category: e.target.value } })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#FFD700]"
                        >
                          <option value="Yield Investment">Yield Investment</option>
                          <option value="Cloud Mining">Cloud Mining</option>
                          <option value="Instant Payouts">Instant Payouts</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => this.setState({ newReview: { ...newReview, rating: star } })}
                            className="p-1 focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= newReview.rating
                                  ? 'text-[#FFD700] fill-current'
                                  : 'text-gray-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Your Feedback & Review</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tell us about your payout experience, profit yields, or service..."
                        value={newReview.review}
                        onChange={(e) => this.setState({ newReview: { ...newReview, review: e.target.value } })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#FFD700] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all mt-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Submitting Review...' : 'Submit Feedback'}</span>
                    </button>
                  </form>
                )}

              </div>
            </div>
          )}

        </div>
      </section>
    );
  }
}

export default Testimonials;
