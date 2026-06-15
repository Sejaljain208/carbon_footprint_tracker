import React, { useEffect, useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Sidebar } from '../components/Sidebar';
import { MetricCard } from '../components/MetricCard';
import { Chart } from '../components/Chart';
import { useAuth } from '../utils/hooks';
import { Activity, TrendingDown, Zap, Leaf, AlertCircle } from 'lucide-react';

export const Dashboard = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [trend, setTrend] = useState(null);
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsRes, trendRes, tipsRes] = await Promise.all([
        fetch('/api/dashboard/metrics', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/dashboard/trend', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/dashboard/tips', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (trendRes.ok) setTrend(await trendRes.json());
      if (tipsRes.ok) {
        const tipsData = await tipsRes.json();
        setTips(tipsData.tips);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const categoryData = metrics ? Object.entries(metrics.categoryBreakdown).map(([name, value]) => ({
    name,
    value: parseFloat(value),
  })) : [];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Metrics Grid */}
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Emissions"
                  value={metrics.totalEmission}
                  unit="kg CO₂e"
                  change={metrics.emissionChange}
                  icon={Leaf}
                  trend={metrics.emissionChange > 0 ? 'up' : 'down'}
                />
                <MetricCard
                  title="Carbon Score"
                  value={metrics.carbonScore}
                  unit="/100"
                  icon={TrendingDown}
                />
                <MetricCard
                  title="Activities Logged"
                  value={metrics.totalActivities}
                  icon={Activity}
                />
                <MetricCard
                  title="Carbon Saved"
                  value={metrics.carbonSaved}
                  unit="kg CO₂e"
                  icon={Zap}
                />
              </div>
            )}

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Trend */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <Chart
                  type="line"
                  data={trend}
                  dataKey="emission"
                  title="Weekly Carbon Trend"
                />
              </div>

              {/* Category Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <Chart
                  type="pie"
                  data={categoryData}
                  dataKey="value"
                  title="Emissions by Category"
                />
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💡 Personalized Reduction Tips
              </h3>
              {tips ? (
                <div className="space-y-3 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {tips}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Start logging activities to get personalized tips!</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
