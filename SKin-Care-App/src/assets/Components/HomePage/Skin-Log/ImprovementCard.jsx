import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

const ImprovementCard = ({ improvements, weeklyCompletion, logsCount }) => {
  // Determine the status based on weekly completion and logs count
  const getStatus = () => {
    if (logsCount < 7) {
      return 'insufficient';
    }
    if (weeklyCompletion < 50) {
      return 'low';
    }
    if (weeklyCompletion < 75) {
      return 'moderate';
    }
    if (weeklyCompletion < 90) {
      return 'good';
    }
    return 'excellent';
  };

  const status = getStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles size={20} className="text-pink-500" />
        Skin Improvements
      </h2>

      {status === 'insufficient' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">Keep Going! 💪</p>
            <p className="text-sm text-blue-800">
              No improvement analysis available yet. Continue following your routines for at least one week for personalized insights.
            </p>
          </div>
        </div>
      )}

      {status === 'low' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-1">Boost Your Consistency</p>
            <p className="text-sm text-amber-800">
              Your routine consistency is currently too low to estimate improvements. Aim to complete your routines more regularly to see skin benefits.
            </p>
          </div>
        </div>
      )}

      {status === 'moderate' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 font-medium mb-3">
            📈 Based on your routine consistency (50-75%), you may notice:
          </p>
          {improvements && improvements.length > 0 ? (
            <div className="space-y-2">
              {improvements.map((improvement, index) => (
                <div key={index} className="flex gap-3 items-start bg-pink-50 p-3 rounded-lg">
                  <span className="text-pink-500 text-lg">✓</span>
                  <p className="text-sm text-gray-700">{improvement}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 italic">
              Keep up your routine for personalized improvement insights.
            </p>
          )}
        </div>
      )}

      {status === 'good' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 font-medium mb-3">
            🌟 Your consistent routine (75-90%) should bring noticeable improvements:
          </p>
          {improvements && improvements.length > 0 ? (
            <div className="space-y-2">
              {improvements.map((improvement, index) => (
                <div key={index} className="flex gap-3 items-start bg-green-50 p-3 rounded-lg">
                  <span className="text-green-500 text-lg">✓</span>
                  <p className="text-sm text-gray-700">{improvement}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 italic">
              Your dedication is paying off! Keep up the routine.
            </p>
          )}
        </div>
      )}

      {status === 'excellent' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 font-medium mb-3">
            ⭐ Your excellent consistency (90%+) should bring strong improvements:
          </p>
          {improvements && improvements.length > 0 ? (
            <div className="space-y-2">
              {improvements.map((improvement, index) => (
                <div key={index} className="flex gap-3 items-start bg-emerald-50 p-3 rounded-lg">
                  <span className="text-emerald-500 text-lg">✨</span>
                  <p className="text-sm text-gray-700 font-medium">{improvement}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 italic">
              Exceptional dedication! You're on the path to great skin.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImprovementCard;
