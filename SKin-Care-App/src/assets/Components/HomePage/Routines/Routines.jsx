import React, { useState, useEffect } from "react";
import { SunMedium, MoonStar } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const Routines = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const userId = localStorage.getItem("userId");
  const [routine, setRoutine] = useState([]);
  const currentType = type || "morning";
  const [completedSteps, setCompletedSteps] = useState([]);

  const toggleStep = (index) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i != index) : [...prev, index],
    );
  };

  useEffect(() => {
    if (!userId || !type) return;

    const fetchRoutine = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/recommendation/${userId}/${type}`,
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

  // LOAD
  useEffect(() => {
    if (!type) return;

    const key = `steps-${type}`;
    const saved = JSON.parse(localStorage.getItem(key));

    if (saved) {
      setCompletedSteps(saved);
    } else {
      setCompletedSteps([]); // reset properly when switching
    }
  }, [type]);

  // SAVE
  useEffect(() => {
    if (!type) return;

    const key = `steps-${type}`;
    localStorage.setItem(key, JSON.stringify(completedSteps));
  }, [completedSteps, type]);

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
      <div className="px-8 mt-4">
        <p className="text-sm text-gray-600 mb-2">
          {completedSteps.length} / {routine.length} completed
        </p>

        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                routine.length
                  ? (completedSteps.length / routine.length) * 100
                  : 0
              }%`,
            }}
          ></div>
        </div>
      </div>

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
                    isDone
                      ? "bg-green-300 border-green-600 text-gray-500"
                      : "border-transparent"
                  }`}
                >
                  <div>
                    <p className="text-pink-500 text-sm font-semibold">
                      Step {idx + 1}
                    </p>
                    <p className={`${isDone ? "line-through" : ""}`}>{step}</p>
                  </div>

                  {isDone && (
                    <Check className="text-green-500 mt-6" size={50} />
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No routine available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Routines;
