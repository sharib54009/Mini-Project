import React from 'react';

const WeeklyProgressChart = ({ weeklyData }) => {
  const maxPercentage = 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Weekly Progress</h2>
      
      <div className="flex items-end justify-between h-40 gap-2">
        {weeklyData && weeklyData.length > 0 ? (
          weeklyData.map((dayData, index) => {
            const percentage = dayData.percentage || 0;
            const heightPercentage = (percentage / maxPercentage) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                {/* Bar */}
                <div className="w-full bg-gray-100 rounded-t-md overflow-hidden mb-2" style={{ height: '120px' }}>
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      percentage === 0
                        ? 'bg-gray-200'
                        : percentage < 50
                        ? 'bg-red-400'
                        : percentage < 75
                        ? 'bg-yellow-400'
                        : 'bg-green-400'
                    }`}
                    style={{ height: `${heightPercentage}%` }}
                  />
                </div>
                
                {/* Day Label */}
                <p className="text-xs font-semibold text-gray-600 text-center">{dayData.day}</p>
                
                {/* Percentage */}
                <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
              </div>
            );
          })
        ) : (
          <div className="w-full text-center py-8 text-gray-500">
            <p className="text-sm">No data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyProgressChart;
