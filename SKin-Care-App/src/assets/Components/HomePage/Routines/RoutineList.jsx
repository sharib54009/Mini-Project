import React from "react";
import { Check } from "lucide-react";

const RoutineList = ({ routine, completedSteps, toggleStep, isCurrentDay }) => {
  return (
    <div className="px-8 py-7">
      <div className="rounded-lg space-y-6 py-6">
        {routine && routine.length > 0 ? (
          routine.map((step, idx) => {
            const isDone = completedSteps.includes(idx);

            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`cursor-pointer bg-white px-4 py-3 rounded-2xl border transition-all duration-200 flex justify-between items-start ${
                  isDone ? "bg-green-300 border-green-600 text-gray-500" : "border-transparent"
                } ${!isCurrentDay ? "opacity-80" : ""}`}
              >
                <div>
                  <p className="text-pink-500 text-sm font-semibold">Step {idx + 1}</p>

                  <p className={`${isDone ? "line-through" : ""}`}>{step}</p>
                </div>

                {isDone && (
                  <Check
                    className="
                            text-green-500
                            mt-6
                          "
                    size={50}
                  />
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No routine available</p>
        )}
      </div>
    </div>
  );
};

export default RoutineList;
