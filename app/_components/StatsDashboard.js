'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function StatsDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('weekly');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Statistics</h2>
        <p className="text-slate-500">No data available yet. Start tracking your puffs!</p>
      </div>
    );
  }

  const maxPuffs = Math.max(...stats.weeklyStats.map(day => day.puffs), 1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-purple-700 mb-4">Statistics</h2>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'weekly'
              ? 'bg-purple-100 text-purple-600'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-purple-100 text-purple-600'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Overview
        </button>
      </div>

      {activeTab === 'weekly' && (
        <div className="space-y-4">
          {/* Weekly Chart */}
          <div className="space-y-2">
            <div className="flex items-end gap-1 h-24">
              {stats.weeklyStats.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-purple-400 to-blue-400 rounded-t transition-all duration-300"
                    style={{ 
                      height: `${(day.puffs / maxPuffs) * 100}%`,
                      minHeight: day.puffs > 0 ? '4px' : '0'
                    }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-1">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.weeklyTotal}</div>
              <div className="text-sm text-slate-500">Total Puffs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.weeklyAverage}</div>
              <div className="text-sm text-slate-500">Daily Average</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.monthlyTotal}</div>
              <div className="text-sm text-slate-600">Monthly Total</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.streak}</div>
              <div className="text-sm text-slate-600">Day Streak</div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-200">
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
} 