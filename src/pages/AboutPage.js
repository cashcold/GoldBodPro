import React, { Component } from 'react';
import AboutSection from '../components/AboutSection.js';
import WhyChooseUs from '../components/WhyChooseUs.js';
import Testimonials from '../components/Testimonials.js';

class AboutPage extends Component {
  render() {
    return (
      <main className="bg-[#090E18] text-white min-h-screen pt-10">
        <AboutSection />
        <WhyChooseUs />
        <Testimonials />
      </main>
    );
  }
}

export default AboutPage;
