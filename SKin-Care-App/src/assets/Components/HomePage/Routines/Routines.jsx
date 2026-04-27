import React, { useState, useEffect } from "react";
import { SunMedium, MoonStar } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Routines = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const userId = localStorage.getItem("userId");
const [routine, setRoutine] = useState([]);
const currentType = type || "morning";


 



useEffect(() => {
  if (!userId || !type) return;

  const fetchRoutine = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/recommendation/${userId}/${type}`
      );

      const data = await res.json();

      if (res.ok) {
        setRoutine(data.routine || []);
      } else {
        setRoutine([]);
      }
    } catch (err) {
      console.error(err);
      setRoutine([]);
    }
  };

  fetchRoutine();
}, [type, userId]);

    return (
    <div className="w-full h-full  bg-[#faede7]">
      <h1 className="font-semibold text-2xl px-4 py-10">Routine</h1>

      <div className="px-4">
        <div className="w-full flex px-1 py-1 gap-2 rounded-lg bg-white">
          {/* Morning */}
          <div
            onClick={() => {
              navigate("/routines/morning");
            }}
            className={`${currentType === "morning" ? "bg-pink-100 text-pink-500" : "bg-white text-gray-700"} rounded-xl flex items-center gap-1 px-5 py-1 cursor-pointer`}
          >
            <SunMedium size={25} />
            <h1 className="text-lg font-semibold">Morning</h1>
          </div>

          {/* Evening */}
          <div
            onClick={() => {
              navigate("/routines/evening");
            }}
            className={`${currentType === "evening" ? "bg-pink-100 text-pink-500" : "bg-white text-gray-700"} rounded-xl flex items-center gap-1 px-5 py-1 cursor-pointer`}
          >
            <MoonStar size={20} />
            <h1 className="text-lg font-semibold">Evening</h1>
          </div>
        </div>
      </div>
     

      <div className="px-8   py-7 ">
  <div className=" rounded-lg  space-y-8  py-6  ">
    {routine && routine.length > 0 ? (
  routine.map((step, idx) => (
    <button
    className="bg-white w-full px-3 py-2   items-center  rounded-2xl"
     key={idx}><p className="text-pink-500 flex px-3  text-md font-medium">Step {idx + 1} :</p>  {step} </button>
  ))
) : (
  <p>No routine available</p>
)}
  </div>
</div>
    </div>
  );
};

export default Routines;
