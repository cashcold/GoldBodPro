import React, { Component } from 'react';
import Hero from '../components/Hero.js';
import Statistics from '../components/Statistics.js';
import InvestmentPlans from '../components/InvestmentPlans.js';
import InvestmentCalculator from '../components/InvestmentCalculator.js';
import AboutSection from '../components/AboutSection.js';
import WhyChooseUs from '../components/WhyChooseUs.js';
import HowItWorks from '../components/HowItWorks.js';
import LiveTransactions from '../components/LiveTransactions.js';
import ReferralProgram from '../components/ReferralProgram.js';
import LatestNews from '../components/LatestNews.js';
import FaqSection from '../components/FaqSection.js';
import Testimonials from '../components/Testimonials.js';

class HomePage extends Component {
  render() {
    return (
      <main className="bg-[#090E18] text-white min-h-screen">
        <Hero />
        <Statistics />
        <InvestmentPlans />
        <InvestmentCalculator />
        <AboutSection />
        <WhyChooseUs />
        <HowItWorks />
        <LiveTransactions />
        <ReferralProgram />
        <LatestNews />
        <FaqSection />
        <Testimonials />
      </main>
    );
  }
}

export default HomePage;
