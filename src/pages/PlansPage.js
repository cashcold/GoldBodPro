import React, { Component } from 'react';
import InvestmentPlans from '../components/InvestmentPlans.js';
import InvestmentCalculator from '../components/InvestmentCalculator.js';
import HowItWorks from '../components/HowItWorks.js';

class PlansPage extends Component {
  render() {
    return (
      <main className="bg-[#090E18] text-white min-h-screen pt-10">
        <InvestmentPlans />
        <InvestmentCalculator />
        <HowItWorks />
      </main>
    );
  }
}

export default PlansPage;
