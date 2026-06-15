import React, { useEffect, useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../utils/hooks';
import { Trash2, AlertCircle, Loader } from 'lucide-react';

export const ActivityHistory = () => {
  const { token } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setActivities(activities.filter((a) => a._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredActivities =
    filter === 'all'
      ? activities
      : activities.filter((a) => a.category === filter);

  const totalEmission = filteredActivities.reduce((sum, a) => sum + a.emission, 0);

  const categories = ['all', 'Transport', 'Energy', 'Diet', 'Other'];
  const categoryEmissions = {};
  activities.forEach((a) => {
    categoryEmissions[a.category] = (categoryEmissions[a.category] || 0) + a.emission;
  });

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          <TopBar />
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader className="inline-block animate-spin h-12 w-12 text-emerald-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading activities...</p>
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
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                📋 Activity History
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                View all your logged activities and emissions
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid md:grid-cols-5 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {activities.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Emissions</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {totalEmission.toFixed(1)} kg
                </p>
              </div>

              {Object.entries(categoryEmissions).map(([cat, val]) => (
                <div key={cat} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{cat}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {val.toFixed(1)} kg
                  </p>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full capitalize font-semibold transition ${
                    filter === cat
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            {/* Activities List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              {filteredActivities.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No activities found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Activity
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Emission
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredActivities.map((activity) => (
                        <tr
                          key={activity._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                            {activity.description}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">
                              {activity.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {activity.quantity} {activity.unit}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                            {activity.emission.toFixed(2)} kg
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              activity.source === 'ai_analyzed'
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}>
                              {activity.source === 'ai_analyzed' ? '🤖 AI' : '✍️ Manual'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => deleteActivity(activity._id)}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
