import React, { Component } from 'react';
import { Target, Eye, Cpu, ShieldCheck, Globe, Users } from 'lucide-react';

class AboutSection extends Component {
  render() {
    return (
      <section className="py-20 bg-[#090E18] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image / Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#FFD700]/30 bg-[#0F172A] shadow-2xl p-2">
                <img
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80"
                  alt="GoldBod Pro Mining Hardware"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />
                
                {/* Floating Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-[#090E18]/90 backdrop-blur-md border border-[#FFD700]/30 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-[#FFD700] flex items-center justify-center shrink-0">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Advanced Cloud Rigs</h4>
                    <p className="text-xs text-gray-400">99.98% Hash Efficiency & Cold Storage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#FFD700]/30 text-xs font-semibold text-[#FFD700] uppercase">
                About GoldBod Pro
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Empowering Global Investors With <span className="text-gold-gradient">Next-Gen Crypto Mining</span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Founded by veteran blockchain engineers and financial strategists, GoldBod Pro bridges institutional-grade cloud mining hardware with retail cryptocurrency investment opportunity. We eliminate technical friction, offering simple, secure, and automated yield generation.
              </p>

              {/* Mission & Vision Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                
                <div className="p-5 rounded-2xl bg-[#0F172A] border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-[#FFD700]">
                    <Target className="w-5 h-5" />
                    <h3 className="text-base font-bold text-white">Our Mission</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-normal">
                    To deliver frictionless, high-yield cryptocurrency investment plans backed by verifiable cloud mining hash rate and bulletproof security.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0F172A] border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-[#FFD700]">
                    <Eye className="w-5 h-5" />
                    <h3 className="text-base font-bold text-white">Our Vision</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-normal">
                    To remain the world’s most trusted multi-asset cloud mining ecosystem, serving over 1 million investors across 140 countries.
                  </p>
                </div>

              </div>

              {/* Key Features Bullet List */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-xs font-medium text-gray-300">Worldwide Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-xs font-medium text-gray-300">Bank-Grade SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-xs font-medium text-gray-300">124k+ Active Users</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    );
  }
}

export default AboutSection;
