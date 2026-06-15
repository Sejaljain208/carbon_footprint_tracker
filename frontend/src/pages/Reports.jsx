import React, { useEffect, useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../utils/hooks';
import { Download, AlertCircle, Loader } from 'lucide-react';

export const Reports = () => {
  const { token } = useAuth();
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [weekRes, monthRes, sumRes] = await Promise.all([
        fetch('/api/reports/weekly', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/reports/monthly', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/reports/summary', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (weekRes.ok) setWeeklyData(await weekRes.json());
      if (monthRes.ok) setMonthlyData(await monthRes.json());
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData.summary);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const content = `
CarbonLens Report
${new Date().toLocaleDateString()}

WEEKLY SUMMARY
Period: ${weeklyData?.week}
Total Emissions: ${weeklyData?.total} kg CO₂e
Activities: ${weeklyData?.count}

By Category:
${Object.entries(weeklyData?.categories || {})
  .map(([cat, val]) => `  ${cat}: ${val} kg CO₂e`)
  .join('\n')}

MONTHLY SUMMARY
Period: ${monthlyData?.month}
Total Emissions: ${monthlyData?.total} kg CO₂e
Activities: ${monthlyData?.count}

By Category:
${Object.entries(monthlyData?.categories || {})
  .map(([cat, val]) => `  ${cat}: ${val} kg CO₂e`)
  .join('\n')}

AI INSIGHTS
${summary}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbonlens-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          <TopBar />
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader className="inline-block animate-spin h-12 w-12 text-emerald-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading reports...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  📊 Reports & Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  View your carbon footprint trends and AI-generated insights
                </p>
              </div>
              <button
                onClick={generatePDF}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition"
              >
                <Download size={20} />
                Download Report
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Weekly Report */}
            {weeklyData && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  📅 Weekly Summary
                </h2>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Period</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {weeklyData.week}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Emissions</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {weeklyData.total} kg CO₂e
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Activities</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {weeklyData.count}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    By Category
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(weeklyData.categories).map(([category, value]) => (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">{category}</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {value} kg
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Report */}
            {monthlyData && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  📆 Monthly Summary
                </h2>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Period</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {monthlyData.month}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Emissions</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {monthlyData.total} kg CO₂e
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Activities</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {monthlyData.count}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    By Category
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(monthlyData.categories).map(([category, value]) => (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">{category}</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {value} kg
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI Summary */}
            {summary && (
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  🤖 AI Insights
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {summary}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
