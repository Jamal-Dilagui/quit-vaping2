'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function PuffTracker() {
  const { data: session } = useSession();
  const [todayPuffs, setTodayPuffs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState('other');

  // Fetch today's puffs on component mount
  useEffect(() => {
    fetchTodayPuffs();
  }, []);

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

  const addPuff = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/puffs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 1, trigger })
      });
      
      if (res.ok) {
        await fetchTodayPuffs(); // Refresh the count
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to add puff');
      }
    } catch (error) {
      alert('Error adding puff');
    } finally {
      setLoading(false);
    }
  };

  const removeLastPuff = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/puffs', {
        method: 'DELETE'
      });
      
      if (res.ok) {
        await fetchTodayPuffs(); // Refresh the count
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to remove puff');
      }
    } catch (error) {
      alert('Error removing puff');
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-purple-700 mb-4">Today's Puffs</h2>
      
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-purple-600">{todayPuffs}</div>
        <div className="text-sm text-slate-500">puffs today</div>
      </div>

      <div className="space-y-3">
        <select
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-lg"
        >
          <option value="other">Other</option>
          <option value="stress">Stress</option>
          <option value="boredom">Boredom</option>
          <option value="social">Social</option>
          <option value="habit">Habit</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={addPuff}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Puff'}
          </button>
          
          <button
            onClick={removeLastPuff}
            disabled={loading || todayPuffs === 0}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Removing...' : 'Remove Last'}
          </button>
        </div>
      </div>
    </div>
  );
} 