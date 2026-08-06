import React, { Component } from 'react';
import api from '../services/api.js';
import { Newspaper, ArrowRight, X, Calendar, User } from 'lucide-react';

class LatestNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: [],
      selectedBlog: null,
      loading: true
    };
  }

  componentDidMount() {
    this.fetchBlogs();
  }

  fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      this.setState({ blogs: res.data || [], loading: false });
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  openBlogModal = (blog) => {
    this.setState({ selectedBlog: blog });
  };

  closeBlogModal = () => {
    this.setState({ selectedBlog: null });
  };

  render() {
    const { blogs, selectedBlog, loading } = this.state;

    return (
      <section className="py-20 bg-[#090E18] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#FFD700]/30 text-xs font-semibold text-[#FFD700] uppercase mb-3">
              <Newspaper className="w-4 h-4" /> Market Insights
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Latest News & <span className="text-gold-gradient">Updates</span>
            </h2>
            <p className="mt-4 text-gray-300 text-sm sm:text-base">
              Stay ahead with market analyses, mining hardware tech releases, and company announcements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-[#0F172A]/80 backdrop-blur-xl border border-[#FFD700]/20 rounded-3xl overflow-hidden hover:border-[#FFD700] transition-all duration-300 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#090E18]/80 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/30">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#FFD700]" />
                        {blog.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#FFD700]" />
                        {blog.author}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-[#FFD700] transition-colors leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      {blog.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => this.openBlogModal(blog)}
                    className="btn-outline-gold w-full text-xs py-2.5 font-bold uppercase tracking-wider"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Read Article Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0F172A] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
              <button
                onClick={this.closeBlogModal}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 inline-block mb-3">
                {selectedBlog.category}
              </span>

              <h2 className="text-2xl font-black text-white mb-3">{selectedBlog.title}</h2>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 pb-4 border-b border-slate-800">
                <span>Published by {selectedBlog.author}</span>
                <span>•</span>
                <span>{selectedBlog.createdAt}</span>
              </div>

              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-64 object-cover rounded-2xl mb-6 border border-slate-800"
              />

              <div className="text-sm text-gray-300 leading-relaxed space-y-4 font-normal">
                <p>{selectedBlog.summary}</p>
                <p>{selectedBlog.content}</p>
              </div>

            </div>
          </div>
        )}
      </section>
    );
  }
}

export default LatestNews;
