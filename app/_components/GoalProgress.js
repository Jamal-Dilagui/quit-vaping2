'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function GoalProgress() {
  const { data: session } = useSession();
  const [goal, setGoal] = useState(null);
  const [todayPuffs, setTodayPuffs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ type: 'daily', targetPuffs: 200 });

  useEffect(() => {
    fetchGoal();
    fetchTodayPuffs();
  }, []);

  const fetchGoal = async () => {
    try {
      const res = await fetch('/api/goal');
      const data = await res.json();
      if (data.success && data.data) {
        setGoal(data.data);
      }
    } catch (error) {
      console.error('Error fetching goal:', error);
    }
  };

  const fetchTodayPuffs = async () => {
    try {
      const res = await fetch('/api/puffs/today');
      const data = await res.json();
      if (data.success) {
        setTodayPuffs(data.data.totalCount);
      }
    } catch (error) {
      console.error('Error fetching today\'s puffs:', error);
    }
  };

  const createGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });
      
      if (res.ok) {
        await fetchGoal();
        setShowGoalForm(false);
        setNewGoal({ type: 'daily', targetPuffs: 200 });
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create goal');
      }
    } catch (error) {
      alert('Error creating goal');
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  const progress = goal ? Math.min((todayPuffs / goal.targetPuffs) * 100, 100) : 0;
  const remaining = goal ? Math.max(goal.targetPuffs - todayPuffs, 0) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-700">Goal Progress</h2>
        {!goal && (
          <button
            onClick={() => setShowGoalForm(true)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Set Goal
          </button>
        )}
      </div>

      {goal ? (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {todayPuffs}<span className="text-lg text-slate-400">/{goal.targetPuffs}</span>
            </div>
            <div className="text-sm text-slate-500">
              {remaining > 0 ? `${remaining} puffs remaining` : 'Goal reached! 🎉'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="text-center">
            <div className="text-sm text-slate-600">
              {progress.toFixed(1)}% of daily goal
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-slate-500 mb-4">No goal set yet</p>
          <button
            onClick={() => setShowGoalForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Set Your First Goal
          </button>
        </div>
      )}

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-purple-700 mb-4">Set Your Goal</h3>
            <form onSubmit={createGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Goal Type
                </label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Puffs
                </label>
                <input
                  type="number"
                  value={newGoal.targetPuffs}
                  onChange={(e) => setNewGoal({...newGoal, targetPuffs: parseInt(e.target.value)})}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  min="1"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 