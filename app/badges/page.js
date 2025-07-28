'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function BadgesPage() {
  const { data: session } = useSession();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const res = await fetch('/api/badges');
      const data = await res.json();
      if (data.success) {
        setBadges(data.data);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const badgeTypes = {
    first_puff: { name: 'First Step', description: 'Tracked your first puff', icon: '🎯', color: 'bg-blue-100 text-blue-600' },
    three_day_streak: { name: 'Consistency', description: '3 days tracked in a row', icon: '🔥', color: 'bg-orange-100 text-orange-600' },
    goal_hit_three_days: { name: 'Goal Master', description: 'Hit your goal for 3 days', icon: '🏆', color: 'bg-yellow-100 text-yellow-600' },
    hundred_puffs_avoided: { name: 'Century Club', description: 'Avoided 100 puffs', icon: '💯', color: 'bg-green-100 text-green-600' },
    week_streak: { name: 'Week Warrior', description: '7 days tracked in a row', icon: '⚡', color: 'bg-purple-100 text-purple-600' },
    month_streak: { name: 'Month Master', description: '30 days tracked in a row', icon: '👑', color: 'bg-red-100 text-red-600' },
    zero_puffs_day: { name: 'Zero Hero', description: 'A day with zero puffs', icon: '🌟', color: 'bg-indigo-100 text-indigo-600' },
    goal_master: { name: 'Goal Master', description: 'Consistently hit your goals', icon: '🎖️', color: 'bg-pink-100 text-pink-600' }
  };

  if (!session) return null;

  if (loading) {
    return (
      <main className="w-full max-w-sm mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-sm mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg">
          <span className="text-white text-2xl">🏅</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Achievements</h1>
        <p className="text-slate-500 text-center">
          {badges.length > 0 
            ? `You've earned ${badges.length} badge${badges.length !== 1 ? 's' : ''}!`
            : 'Start tracking to earn your first badge!'
          }
        </p>
      </div>

      {/* Badges Grid */}
      {badges.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => {
            const badgeInfo = badgeTypes[badge.type] || {
              name: 'Unknown Badge',
              description: badge.description,
              icon: '❓',
              color: 'bg-gray-100 text-gray-600'
            };

            return (
              <div key={badge._id} className="bg-white rounded-xl shadow-lg p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${badgeInfo.color} flex items-center justify-center mx-auto mb-3 text-2xl`}>
                  {badgeInfo.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{badgeInfo.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{badgeInfo.description}</p>
                <div className="text-xs text-slate-400">
                  {new Date(badge.unlockedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏅</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Badges Yet</h3>
          <p className="text-slate-500 mb-6">
            Start tracking your puffs to earn your first achievement!
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="bg-slate-100 rounded-lg p-3 text-center opacity-50">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-xs text-slate-600">First Puff</div>
            </div>
            <div className="bg-slate-100 rounded-lg p-3 text-center opacity-50">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xs text-slate-600">3-Day Streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Info */}
      {badges.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-slate-700 mb-2">Keep Going!</h3>
          <p className="text-sm text-slate-600">
            You're making great progress. Continue tracking to unlock more achievements and reach your goals!
          </p>
        </div>
      )}
    </main>
  );
}
