import React from "react";
import { SunMedium, MoonStar } from "lucide-react";

const RoutineTabs = ({ navigate, currentType }) => {
  return (
    <div className="px-4 mt-6">
      <div className="w-full flex p-1 gap-2 rounded-lg bg-white">
        <div
          onClick={() => navigate("/routines/morning")}
          className={`flex-1 rounded-xl flex items-center justify-center gap-2 py-3 cursor-pointer transition-all duration-200 ${
            currentType === "morning" ? "bg-pink-100 text-pink-500" : "bg-white text-gray-700"
          }`}
        >
          <SunMedium size={22} />

          <h1 className="text-lg font-semibold">Morning</h1>
        </div>

        <div
          onClick={() => navigate("/routines/evening")}
          className={`flex-1 rounded-xl flex items-center justify-center gap-2 py-3 cursor-pointer transition-all duration-200 ${
            currentType === "evening" ? "bg-pink-100 text-pink-500" : "bg-white text-gray-700"
          }`}
        >
          <MoonStar size={20} />

          <h1 className="text-lg font-semibold">Evening</h1>
        </div>
      </div>
    </div>
  );
};

export default RoutineTabs;
