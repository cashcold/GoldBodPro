import React, { Component } from 'react';
import api from '../services/api.js';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

class FaqSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faqs: [],
      openIndex: 0
    };
  }

  componentDidMount() {
    this.fetchFaqs();
  }

  fetchFaqs = async () => {
    try {
      const res = await api.get('/faqs');
      this.setState({ faqs: res.data || [] });
    } catch (err) {
      // Fallback state
    }
  };

  toggleFaq = (index) => {
    this.setState((prevState) => ({
      openIndex: prevState.openIndex === index ? null : index
    }));
  };

  render() {
    const { faqs, openIndex } = this.state;

    return (
      <section className="py-20 bg-[#090E18] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#FFD700]/30 text-xs font-semibold text-[#FFD700] uppercase mb-3">
              <HelpCircle className="w-4 h-4" /> Got Questions?
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Frequently Asked <span className="text-gold-gradient">Questions</span>
            </h2>
            <p className="mt-4 text-gray-300 text-sm sm:text-base">
              Find instant answers regarding deposits, automated returns, cloud mining, and account security.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.id || index}
                  className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#FFD700]/20 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => this.toggleFaq(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-[#FFD700]/5 transition-colors"
                  >
                    <span className="font-bold text-white text-base sm:text-lg">
                      {faq.question}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#090E18] border border-amber-500/30 flex items-center justify-center text-[#FFD700] shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-sm text-gray-300 leading-relaxed border-t border-slate-800/80">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>
    );
  }
}

export default FaqSection;
