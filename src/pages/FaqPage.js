import React, { Component } from 'react';
import FaqSection from '../components/FaqSection.js';

class FaqPage extends Component {
  render() {
    return (
      <main className="bg-[#090E18] text-white min-h-screen pt-10">
        <FaqSection />
      </main>
    );
  }
}

export default FaqPage;
