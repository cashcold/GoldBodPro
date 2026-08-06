import React, { Component } from 'react';
import ContactSection from '../components/ContactSection.js';

class ContactPage extends Component {
  render() {
    return (
      <main className="bg-[#090E18] text-white min-h-screen pt-10">
        <ContactSection />
      </main>
    );
  }
}

export default ContactPage;
