import React, { Component, createContext } from 'react';
import api from '../services/api.js';

export const AuthContext = createContext(null);

export class AuthProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      token: localStorage.getItem('goldbod_token') || null,
      loading: true,
      error: null,
      authModalOpen: false,
      authModalMode: 'login' // 'login' | 'register'
    };
  }

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth = async () => {
    const token = localStorage.getItem('goldbod_token');
    if (!token) {
      this.setState({ user: null, loading: false });
      return;
    }

    try {
      const res = await api.get('/auth/me');
      this.setState({ user: res.data.user, loading: false });
    } catch (err) {
      console.warn('Session expired or invalid token');
      localStorage.removeItem('goldbod_token');
      this.setState({ user: null, token: null, loading: false });
    }
  };

  login = async (emailOrUsername, password) => {
    try {
      this.setState({ error: null });
      const res = await api.post('/auth/login', { emailOrUsername, password });
      const { token, user } = res.data;
      localStorage.setItem('goldbod_token', token);
      this.setState({ token, user, authModalOpen: false });
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please check credentials.';
      this.setState({ error: msg });
      return { success: false, error: msg };
    }
  };

  register = async (formData) => {
    try {
      this.setState({ error: null });
      const res = await api.post('/auth/register', formData);
      const { token, user } = res.data;
      localStorage.setItem('goldbod_token', token);
      this.setState({ token, user, authModalOpen: false });
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed.';
      this.setState({ error: msg });
      return { success: false, error: msg };
    }
  };

  logout = () => {
    localStorage.removeItem('goldbod_token');
    this.setState({ user: null, token: null });
  };

  openAuthModal = (mode = 'login') => {
    this.setState({ authModalOpen: true, authModalMode: mode, error: null });
  };

  closeAuthModal = () => {
    this.setState({ authModalOpen: false, error: null });
  };

  refreshUserData = async () => {
    if (!this.state.token) return;
    try {
      const res = await api.get('/auth/me');
      this.setState({ user: res.data.user });
    } catch (err) {
      console.error('Failed to refresh user data', err);
    }
  };

  render() {
    const value = {
      ...this.state,
      login: this.login,
      register: this.register,
      logout: this.logout,
      openAuthModal: this.openAuthModal,
      closeAuthModal: this.closeAuthModal,
      refreshUserData: this.refreshUserData
    };

    return (
      <AuthContext.Provider value={value}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
