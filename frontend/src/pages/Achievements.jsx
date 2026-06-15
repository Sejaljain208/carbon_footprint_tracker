import React, { useEffect, useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../utils/hooks';
import { Trophy, Award, Target, Zap, Loader } from 'lucide-react';

export const Achievements = () => {
  const { token } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalEmissions: 0,
    carbonSaved: 0,
    streakDays: 0,
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setActivities(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (activitiesList) => {
    const total = activitiesList.length;
    const totalEmis = activitiesList.reduce((sum, act) => sum + (act.emission || 0), 0);
    
    // Calculate carbon saved (assuming goal is 20kg)
    const carbonSaved = Math.min(20, totalEmis * 0.3);
    
    // Calculate streak (consecutive days with activities)
    const dates = [...new Set(activitiesList.map(act => 
      new Date(act.createdAt).toDateString()
    ))].sort();
    
    let streak = 0;
    let currentStreak = 0;
    let lastDate = null;
    
    for (let i = dates.length - 1; i >= 0; i--) {
      const currentDate = new Date(dates[i]);
      if (!lastDate) {
        currentStreak = 1;
      } else {
        const diffDays = Math.floor((lastDate - currentDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
      lastDate = currentDate;
      streak = Math.max(streak, currentStreak);
    }

    setStats({
      totalActivities: total,
      totalEmissions: totalEmis,
      carbonSaved: Math.round(carbonSaved * 10) / 10,
      streakDays: streak,
    });
  };

  const achievements = [
    {
      id: 1,
      name: 'First Step',
      description: 'Log your first activity',
      icon: Trophy,
      unlocked: stats.totalActivities >= 1,
      progress: Math.min(stats.totalActivities, 1),
      total: 1,
    },
    {
      id: 2,
      name: 'Eco Warrior',
      description: 'Log 50 activities',
      icon: Award,
      unlocked: stats.totalActivities >= 50,
      progress: stats.totalActivities,
      total: 50,
    },
    {
      id: 3,
      name: 'Carbon Cutter',
      description: 'Save 20 kg CO₂e',
      icon: Target,
      unlocked: stats.carbonSaved >= 20,
      progress: stats.carbonSaved,
      total: 20,
    },
    {
      id: 4,
      name: 'Perfect Streak',
      description: 'Log activities for 30 consecutive days',
      icon: Zap,
      unlocked: stats.streakDays >= 30,
      progress: stats.streakDays,
      total: 30,
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          <TopBar />
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin text-emerald-500" size={40} />
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
                🏆 Achievements
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Unlock badges as you make progress toward a sustainable future
              </p>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Achievements Unlocked</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {unlockedCount} / {achievements.length}
                  </p>
                </div>
                <div className="w-px bg-gray-200 dark:bg-gray-700 h-16 hidden sm:block"></div>
                <div className="flex-1 min-w-[200px]">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {unlockedCount === achievements.length 
                      ? "🎉 Perfect! You're a sustainability champion!" 
                      : `Keep tracking to unlock ${achievements.length - unlockedCount} more achievements!`}
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                const progressPercent = Math.min((achievement.progress / achievement.total) * 100, 100);

                return (
                  <div
                    key={achievement.id}
                    className={`rounded-lg p-6 transition ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                        achievement.unlocked
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      <Icon size={24} />
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {achievement.description}
                    </p>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {achievement.progress} / {achievement.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            achievement.unlocked ? 'bg-emerald-500' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Only show "Unlocked" badge if actually unlocked */}
                    {achievement.unlocked && (
                      <div className="mt-3 inline-block px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold">
                        ✓ Unlocked
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-3">
                💡 Tips to Unlock More Achievements:
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
                <li>✓ Log your activities consistently</li>
                <li>✓ Use the AI Assistant to analyze your activities</li>
                <li>✓ Track multiple categories (Transport, Energy, Diet)</li>
                <li>✓ Monitor your progress on the Dashboard</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};