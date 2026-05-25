import React, { useState, useEffect, useRef } from "react";
import { SunMedium, MoonStar, Check } from "lucide-react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Routines = () => {
  const navigate = useNavigate();

  const { type } = useParams();

  const userId = localStorage.getItem("userId");

  const [routine, setRoutine] = useState([]);

  const [savedLogs, setSavedLogs] = useState([]);

  const calendarRef = useRef(null);

  const currentType = type || "morning";

  const [completedSteps, setCompletedSteps] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  // =========================
  // TODAY
  // =========================

  const today = new Date();

  const todayFormatted = today.toLocaleDateString("en-GB");

  const selectedFormattedDate = selectedDate.toLocaleDateString("en-GB");

  // =========================
  // CHECKS
  // =========================

  const isFutureDate =
    selectedDate.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0);

  const isCurrentDay = selectedFormattedDate === todayFormatted;

  const isPastDay = !isCurrentDay && !isFutureDate;

  // =========================
  // MONTH YEAR
  // =========================

  const monthYear = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // =========================
  // CALENDAR DAYS
  // =========================

  const generateDays = () => {
    const days = [];

    const year = selectedDate.getFullYear();

    const month = selectedDate.getMonth();

    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= totalDays; i++) {
      const dateObj = new Date(year, month, i);

      days.push({
        dayNumber: i,

        dayName: dateObj.toLocaleDateString("en-US", {
          weekday: "short",
        }),

        fullDate: dateObj.toLocaleDateString("en-GB"),
      });
    }

    return days;
  };

  // =========================
  // AUTO SCROLL TO CURRENT DAY
  // =========================

  useEffect(() => {
    if (!calendarRef.current) return;

    const selectedIndex = calendarDays.findIndex(
      (day) => day.fullDate === selectedFormattedDate,
    );

    if (selectedIndex === -1) return;

    const dayWidth = 77;

    const scrollPosition = selectedIndex * dayWidth;

    calendarRef.current.scrollTo({
      left: scrollPosition - 120,

      behavior: "smooth",
    });
  }, [selectedFormattedDate, monthYear]);

  const calendarDays = generateDays();

  // =========================
  // MONTH NAVIGATION
  // =========================

  const goToPreviousMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1),
    );
  };

  // =========================
  // FETCH ROUTINE
  // =========================

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
        console.log(err);

        setRoutine([]);
      }
    };

    fetchRoutine();
  }, [type, userId]);

  // =========================
  // FETCH LOGS
  // =========================

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/routinelog?user_id=${userId}`,
        );

        const data = await res.json();

        if (res.ok) {
          setSavedLogs(data.logs);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchLogs();
  }, [userId]);

  // =========================
  // LOAD SAVED COMPLETED STEPS
  // =========================

  useEffect(() => {
    const currentLog = savedLogs.find(
      (log) =>
        log.date === selectedFormattedDate && log.routine_type === currentType,
    );

    if (currentLog) {
      setCompletedSteps(currentLog.completed_indexes || []);
    } else {
      setCompletedSteps([]);
    }
  }, [savedLogs, selectedFormattedDate, currentType]);

  // =========================
  // SAVE ROUTINE LOG
  // =========================

  useEffect(() => {
    if (!routine.length || !isCurrentDay) return;

   const saveLog = async () => {

  try {

    const bodyData = {

      user_id: userId,

      date:
        selectedFormattedDate,

      routine_type:
        currentType,

      completed_steps:
        completedSteps.length,

      completed_indexes:
        completedSteps,

      total_steps:
        routine.length,
    };

    const res = await fetch(
      "http://127.0.0.1:5000/routinelog",
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          bodyData
        ),
      }
    );

    if (res.ok) {

      // UPDATE FRONTEND STATE INSTANTLY

      setSavedLogs((prev) => {

        const existing =
          prev.find(
            (log) =>

              log.date ===
                selectedFormattedDate &&

              log.routine_type ===
                currentType
          );

        // UPDATE EXISTING

        if (existing) {

          return prev.map((log) =>

            log.date ===
              selectedFormattedDate &&

            log.routine_type ===
              currentType

              ? {

                  ...log,

                  completed_steps:
                    completedSteps.length,

                  completed_indexes:
                    completedSteps,

                  total_steps:
                    routine.length,
                }

              : log
          );
        }

        // CREATE NEW

        return [

          ...prev,

          {

            date:
              selectedFormattedDate,

            routine_type:
              currentType,

            completed_steps:
              completedSteps.length,

            completed_indexes:
              completedSteps,

            total_steps:
              routine.length,
          },
        ];
      });
    }

  } catch (err) {

    console.log(err);
  }
};

    saveLog();
  }, [
    completedSteps,
    routine,
    currentType,
    selectedFormattedDate,
    isCurrentDay,
    userId,
  ]);

  // =========================
  // TOGGLE STEP
  // =========================

  const toggleStep = (index) => {
    // ONLY CURRENT DAY EDITABLE

    if (!isCurrentDay) return;

    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#faede7] pb-32">
      {/* HEADER */}

      <h1 className="font-semibold text-2xl px-4 py-10">Routines</h1>

      {/* CALENDAR */}

      <div className="px-4">
        {/* MONTH */}

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="
              bg-white
              px-4
              py-2
              rounded-xl
            "
          >
            ←
          </button>

          <h1 className="text-lg font-semibold">{monthYear}</h1>

          <button
            onClick={goToNextMonth}
            className="
              bg-white
              px-4
              py-2
              rounded-xl
            "
          >
            →
          </button>
        </div>

        {/* DAYS */}

        <div
          ref={calendarRef}
          className="
    flex
    gap-3
    overflow-x-auto
    pb-3
    no-scrollbar
    scroll-smooth
  "
        >
          {calendarDays.map((item, idx) => {
            const isSelected = item.fullDate === selectedFormattedDate;

            const hasData = savedLogs.some((log) => log.date === item.fullDate);

            const isToday = item.fullDate === todayFormatted;

            return (
              <div
                key={idx}
                onClick={() => {
                  const parts = item.fullDate.split("/");

                  const clickedDate = new Date(
                    parts[2],
                    parts[1] - 1,
                    parts[0],
                  );

                  setSelectedDate(clickedDate);
                }}
                className={`
                    min-w-[65px]
                    rounded-2xl
                    px-3
                    py-3
                    flex
                    flex-col
                    items-center
                    justify-center
                    cursor-pointer
                    transition-all
                    relative
                    ${
                      isSelected
                        ? "bg-pink-500 text-white"
                        : hasData
                          ? "bg-pink-100 text-pink-500"
                          : "bg-white text-gray-700"
                    }
                  `}
              >
                {/* CURRENT DAY GREEN DOT */}

                {isToday && (
                  <div
                    className="
                        absolute
                        top-2
                        right-2
                        w-2
                        h-2
                        rounded-full
                        bg-green-500
                      "
                  ></div>
                )}

                <p className="text-sm font-medium">{item.dayName}</p>

                <h1 className="text-xl font-bold">{item.dayNumber}</h1>
              </div>
            );
          })}
        </div>
      </div>

      {/* MORNING EVENING */}

      <div className="px-4 mt-6">
        <div className="w-full flex p-1 gap-2 rounded-lg bg-white">
          {/* MORNING */}

          <div
            onClick={() => navigate("/routines/morning")}
            className={`flex-1 rounded-xl flex items-center justify-center gap-2 py-3 cursor-pointer transition-all duration-200 ${
              currentType === "morning"
                ? "bg-pink-100 text-pink-500"
                : "bg-white text-gray-700"
            }`}
          >
            <SunMedium size={22} />

            <h1 className="text-lg font-semibold">Morning</h1>
          </div>

          {/* EVENING */}

          <div
            onClick={() => navigate("/routines/evening")}
            className={`flex-1 rounded-xl flex items-center justify-center gap-2 py-3 cursor-pointer transition-all duration-200 ${
              currentType === "evening"
                ? "bg-pink-100 text-pink-500"
                : "bg-white text-gray-700"
            }`}
          >
            <MoonStar size={20} />

            <h1 className="text-lg font-semibold">Evening</h1>
          </div>
        </div>
      </div>

      {/* PROGRESS */}

      <div className="px-8 mt-4">
        <p className="text-sm text-gray-600 mb-2">
          {completedSteps.length} / {routine.length}
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
              width: `${
                routine.length
                  ? (completedSteps.length / routine.length) * 100
                  : 0
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* ROUTINES */}

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
                  } ${!isCurrentDay ? "opacity-80" : ""}`}
                >
                  <div>
                    <p className="text-pink-500 text-sm font-semibold">
                      Step {idx + 1}
                    </p>

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
    </div>
  );
};
export default Routines;
