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
        {/* Dashboard Section */}
        <SkinLogHeader
          weeklyCompletion={data?.weeklyCompletion || 0}
          streak={data?.streak || 0}
          activeDays={data?.activeDays || 0}
        />

        {/* Weekly Progress Chart */}
        <WeeklyProgressChart weeklyData={data?.weeklyData || []} />

        {/* Improvements Section */}
        <ImprovementCard
          improvements={data?.improvements || []}
          weeklyCompletion={data?.weeklyCompletion || 0}
          logsCount={data?.logsCount || 0}
        />

        {/* Insights Section */}
        <InsightCard insights={data?.insights || []} />
      </div>
    </div>
  );
};

export default SkinLog;
