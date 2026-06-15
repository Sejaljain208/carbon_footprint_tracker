import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/hooks';
import { ArrowRight, Leaf } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="text-emerald-600 dark:text-emerald-400" size={32} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CarbonLens</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">AI-Powered Carbon Footprint Tracker</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Section - Marketing */}
        <div className="space-y-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Track Your Carbon Footprint with AI
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get personalized insights and actionable strategies to reduce your environmental impact. 
            Our AI analyzes your daily activities and suggests meaningful changes.
          </p>

          <div className="space-y-3">
            {[
              '📊 Real-time emission tracking',
              '🤖 AI-powered activity analysis',
              '💡 Personalized reduction tips',
              '📈 Track progress over time',
            ].map((feature, i) => (
              <p key={i} className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ArrowRight size={20} className="text-emerald-500 flex-shrink-0" />
                {feature}
              </p>
            ))}
          </div>

          <div className="pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Join thousands making a difference in their carbon footprint
            </p>
          </div>
        </div>

        {/* Right Section - Auth Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 h-fit">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your Name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Email Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Password"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="ml-2 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-400">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>Email: sejal6249@gmail.com</p>
            <p>Password: password123</p>
          </div> */} 
        </div>
      </div>
    </div>
  );
};
