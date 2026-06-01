import React from 'react';
import { Lightbulb } from 'lucide-react';

const InsightCard = ({ insights }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Lightbulb size={20} className="text-yellow-500" />
        Insights & Tips
      </h2>

      {insights && insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 flex gap-3"
            >
              <span className="text-2xl flex-shrink-0">💡</span>
              <p className="text-sm text-gray-800">{insight}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            Log more routines to unlock personalized insights!
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
