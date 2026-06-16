import React, { useState, useEffect } from 'react';
import { api } from '../../../../api/api';
import SkinLogHeader from './SkinLogHeader';
import WeeklyProgressChart from './WeeklyProgressChart';
import ImprovementCard from './ImprovementCard';
import InsightCard from './InsightCard';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkinLog = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  // Normalize incoming weeklyData into Sunday -> Saturday order
  const normalizeWeeklyData = (raw = []) => {
    if (!Array.isArray(raw) || raw.length === 0) return [];

    const shortNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const longNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    // Build lookup by common keys: day (short/long) or date (dd/mm/yyyy)
    const lookup = new Map();

    raw.forEach((item) => {
      let key = null;
      if (item.day) key = String(item.day).trim();
      else if (item.date) {
        const parts = String(item.date).split('/');
        if (parts.length === 3) {
          const d = new Date(parts[2], parts[1] - 1, parts[0]);
          key = d.toLocaleDateString('en-US', { weekday: 'short' });
        }
      }

      if (key) lookup.set(key, item);
    });

    // Build ordered array Sun->Sat
    const ordered = shortNames.map((short, i) => {
      const long = longNames[i];
      const item = lookup.get(short) || lookup.get(long);
      const percentage = item ? (item.percentage ?? item.percent ?? item.value ?? 0) : 0;
      return { day: short, percentage };
    });

    return ordered;
  };


  useEffect(() => {
    const fetchSkinLogData = async () => {
      if (!userId) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/skinlog/${userId}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching skin log data:', err);
        setError(
          err.response?.data?.message ||
          'Failed to load skin log data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSkinLogData();
  }, [userId]);

  const weeklyData = normalizeWeeklyData(data?.weeklyData || []);
  const dashboardReady = (() => {
    const activeDays = Number(data?.activeDays || 0);
    const hasWeeklyProgress = weeklyData.some(
      (entry) => Number(entry.percentage || 0) > 0
    );
    return activeDays >= 1 || hasWeeklyProgress || Number(data?.logsCount || 0) >= 1;
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your skin log...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-pink-500 mb-6 hover:text-pink-600 transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-gray-700 font-semibold mb-2">Oops!</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => navigate('/routines/morning')}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition"
            >
              Start a Routine
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <h1 className="app-page-title px-4 py-10">Skin Log</h1>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Dashboard Section: show only when user has at least 1 active day this week or some weekly progress exists */}
          {dashboardReady ? (
            <>
              <SkinLogHeader
                weeklyCompletion={data?.weeklyCompletion || 0}
                streak={data?.streak || 0}
                activeDays={data?.activeDays || 0}
              />

              {/* Weekly Progress Chart (normalized Sunday→Saturday) */}
              <WeeklyProgressChart weeklyData={weeklyData} />

              {/* Completed Day Summary */}
              <div className="app-card-sm p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Completed days</h2>
                {weeklyData.some((entry) => Number(entry.percentage || 0) > 0) ? (
                  <div className="space-y-2">
                    {weeklyData
                      .filter((entry) => Number(entry.percentage || 0) > 0)
                      .map((entry) => (
                        <div key={entry.day} className="flex items-center justify-between bg-pink-50 rounded-2xl p-3">
                          <span className="font-medium text-gray-900">{entry.day}</span>
                          <span className="text-sm text-pink-700 font-semibold">{entry.percentage}%</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No completed days recorded yet for this week.</p>
                )}
              </div>

              {/* Improvements Section */}
              <ImprovementCard
                improvements={data?.improvements || []}
                weeklyCompletion={data?.weeklyCompletion || 0}
                logsCount={data?.logsCount || 0}
              />

              {/* Insights Section */}
              <InsightCard insights={data?.insights || []} />
            </>
          ) : (
            <div className="app-card-sm p-6 text-center">
              <h2 className="text-lg font-semibold mb-2">Almost there!</h2>
              <p className="text-sm text-gray-600 mb-4">
                Complete at least <strong>1 day</strong> of your routines this week to unlock the Skin Log dashboard and personalized insights.
              </p>
              <button
                onClick={() => navigate('/routines/morning')}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition"
              >
                Start a Routine
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default SkinLog;
