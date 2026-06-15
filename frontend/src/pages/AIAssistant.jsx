import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../utils/hooks';
import { Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export const AIAssistant = () => {
  const { token } = useAuth();
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/activities/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      setResult(data);
      setHistory([data, ...history]);
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🤖 AI Activity Analyzer
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Describe your activity in plain language and let AI extract carbon emissions
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Describe Your Activity
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Example: Drove 40 km in my SUV this morning. Or: Flew from Delhi to Mumbai. Or: Had a steak dinner."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    rows="4"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                    <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !description.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Analyze Activity
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Result */}
            {result && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 border-emerald-500 animate-slideIn">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Analysis Complete
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Activity saved to your history
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Activity Type</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {result.analysis?.activity_type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {result.activity?.category || 'Other'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quantity</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {result.analysis?.quantity} {result.analysis?.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Emission (CO₂e)</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {result.analysis?.estimated_emission_kg_co2e?.toFixed(2)} kg
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📋 Analysis History
                </h3>
                <div className="space-y-3">
                  {history.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-500 transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                            {item.activity?.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {item.activity?.category} • {new Date(item.activity?.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {item.activity?.emission?.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">kg CO₂e</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-3">
                ✨ Try these examples:
              </h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
                <li>• "Drove 40 km in my SUV this morning"</li>
                <li>• "Had a steak dinner"</li>
                <li>• "Flew from Delhi to Mumbai"</li>
                <li>• "Left AC on for 6 hours"</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
