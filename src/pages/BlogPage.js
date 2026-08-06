import React, { Component } from 'react';
import LatestNews from '../components/LatestNews.js';

class BlogPage extends Component {
  render() {
    return (
      <main className="bg-[#090E18] text-white min-h-screen pt-10">
        <LatestNews />
      </main>
    );
  }
}

export default BlogPage;
