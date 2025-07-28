'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function DailyStats() {
  const { data: session } = useSession();
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyStats();
  }, []);

  const fetchDailyStats = async () => {
    try {
      const res = await fetch('/api/puffs/today');
      const data = await res.json();
      if (data.success) {
        setDailyData(data.data);
      }
    } catch (error) {
      console.error('Error fetching daily stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeOfDay = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const hours = date.getHours();
    if (hours < 12) return 'Morning';
    if (hours < 17) return 'Afternoon';
    if (hours < 21) return 'Evening';
    return 'Night';
  };

  const getTriggerIcon = (trigger) => {
    const icons = {
      stress: '😰',
      boredom: '😴',
      social: '👥',
      habit: '🔄',
      other: '📝'
    };
    return icons[trigger] || '📝';
  };

  const getTriggerColor = (trigger) => {
    const colors = {
      stress: 'bg-red-100 text-red-600',
      boredom: 'bg-yellow-100 text-yellow-600',
      social: 'bg-blue-100 text-blue-600',
      habit: 'bg-purple-100 text-purple-600',
      other: 'bg-gray-100 text-gray-600'
    };
    return colors[trigger] || 'bg-gray-100 text-gray-600';
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

  if (!dailyData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Today's Statistics</h2>
        <p className="text-slate-500">No data available for today.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-purple-700 mb-4">Today's Statistics</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{dailyData.totalCount}</div>
          <div className="text-sm text-slate-600">Total Puffs</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{dailyData.puffCount}</div>
          <div className="text-sm text-slate-600">Sessions</div>
        </div>
      </div>

      {/* Last Puff Info */}
      {dailyData.latestPuff && (
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-slate-700 mb-2">Latest Puff</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Time:</span>
              <span className="text-sm font-medium text-slate-700">
                {new Date(dailyData.latestPuff.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Count:</span>
              <span className="text-sm font-medium text-slate-700">
                {dailyData.latestPuff.count} puffs
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Trigger:</span>
              <span className={`text-sm px-2 py-1 rounded-full ${getTriggerColor(dailyData.latestPuff.trigger)}`}>
                {getTriggerIcon(dailyData.latestPuff.trigger)} {dailyData.latestPuff.trigger}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Time of Day:</span>
              <span className="text-sm font-medium text-slate-700">
                {getTimeOfDay(dailyData.latestPuff.timestamp)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Daily Insights */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-700">Daily Insights</h3>
        
        {dailyData.totalCount === 0 ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-green-600 font-medium">Great job! No puffs today!</p>
            <p className="text-sm text-slate-500 mt-1">Keep up the excellent work!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <span className="text-sm text-slate-600">Average per session</span>
              </div>
              <span className="font-semibold text-green-600">
                {dailyData.puffCount > 0 ? (dailyData.totalCount / dailyData.puffCount).toFixed(1) : 0}
              </span>
            </div>

            {dailyData.latestPuff && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏰</span>
                  <span className="text-sm text-slate-600">Last activity</span>
                </div>
                <span className="font-semibold text-blue-600">
                  {new Date(dailyData.latestPuff.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <span className="text-sm text-slate-600">Tracking streak</span>
              </div>
              <span className="font-semibold text-purple-600">
                {dailyData.puffCount > 0 ? 'Active' : 'Start tracking'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchDailyStats}
        className="w-full mt-4 py-2 px-4 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm"
      >
        Refresh Data
      </button>
    </div>
  );
} 