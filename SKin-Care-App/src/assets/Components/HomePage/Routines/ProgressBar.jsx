import React from "react";

const ProgressBar = ({ completedStepsLength, totalSteps }) => {
  return (
    <div className="px-8 mt-4">
      <p className="text-sm text-gray-600 mb-2">
        {completedStepsLength} / {totalSteps}
        completed
      </p>

      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className="
                bg-pink-500
                h-2
                rounded-full
                transition-all
                duration-300
              "
          style={{
            width: `${totalSteps ? (completedStepsLength / totalSteps) * 100 : 0}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
