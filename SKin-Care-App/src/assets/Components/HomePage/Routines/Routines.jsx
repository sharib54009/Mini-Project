import React, { useState, useEffect } from "react";
import { SunMedium, MoonStar } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Routines = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const [active, setActive] = useState("morning");

  useEffect(() => {
    setActive(type === "evening" ? "evening" : "morning");
  }, [type]);

  return (
    <div className="w-full h-screen  bg-[#faede7]">
      <h1 className="font-semibold text-2xl px-4 py-10">Routine</h1>

      <div className="px-4">
        <div className="w-full flex px-1 py-1 gap-2 rounded-lg bg-white">
          {/* Morning */}
          <div
            onClick={() => {
              navigate("/routines/morning");
            }}
            className={`rounded-xl flex items-center gap-1 px-5 py-1 cursor-pointer ${
              active === "morning"
                ? "bg-pink-100 text-pink-500"
                : "bg-white text-gray-700"
            }`}
          >
            <SunMedium size={25} />
            <h1 className="text-lg font-semibold">Morning</h1>
          </div>

          {/* Evening */}
          <div
            onClick={() => {
              navigate("/routines/evening");
            }}
            className={`rounded-xl flex items-center gap-1 px-5 py-1 cursor-pointer ${
              active === "evening"
                ? "bg-pink-100 text-pink-500"
                : "bg-white text-gray-700"
            }`}
          >
            <MoonStar size={20} />
            <h1 className="text-lg font-semibold">Evening</h1>
          </div>
        </div>
      </div>
      <div className="px-4 mt-3 ">
        <div className="w-full px-4 py-3  bg-white rounded-lg">Routines to be displayed</div>
      </div>
    </div>
  );
};

export default Routines;
