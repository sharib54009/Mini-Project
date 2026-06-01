import React from 'react';
import { TrendingUp, Flame, Calendar } from 'lucide-react';

const SkinLogHeader = ({ weeklyCompletion, streak, activeDays }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {/* Weekly Completion */}
      <div className="bg-white rounded-lg shadow-sm p-4 text-center">
        <div className="flex justify-center mb-2">
          <TrendingUp size={24} className="text-pink-500" />
        </div>
        <p className="text-gray-600 text-xs font-medium mb-1">Weekly</p>
        <p className="text-2xl font-bold text-gray-900">{weeklyCompletion}%</p>
        <p className="text-gray-500 text-xs mt-1">Completion</p>
      </div>

      {/* Current Streak */}
      <div className="bg-white rounded-lg shadow-sm p-4 text-center">
        <div className="flex justify-center mb-2">
          <Flame size={24} className="text-orange-500" />
        </div>
        <p className="text-gray-600 text-xs font-medium mb-1">Streak</p>
        <p className="text-2xl font-bold text-gray-900">{streak}</p>
        <p className="text-gray-500 text-xs mt-1">Days</p>
      </div>

      {/* Active Days */}
      <div className="bg-white rounded-lg shadow-sm p-4 text-center">
        <div className="flex justify-center mb-2">
          <Calendar size={24} className="text-green-500" />
        </div>
        <p className="text-gray-600 text-xs font-medium mb-1">Active</p>
        <p className="text-2xl font-bold text-gray-900">{activeDays}</p>
        <p className="text-gray-500 text-xs mt-1">Days/7</p>
      </div>
    </div>
  );
};

export default SkinLogHeader;
