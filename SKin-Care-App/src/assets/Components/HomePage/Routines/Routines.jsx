  import React, { useState, useEffect, useRef } from "react";

  import { useParams } from "react-router-dom";
  import { useNavigate } from "react-router-dom";
  import Calendar from "./Calendar";
  import RoutineTabs from "./RoutineTabs";
  import ProgressBar from "./ProgressBar";
  import RoutineList from "./RoutineList";
  import { apiFetch } from "../../../../api/api";

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

    const formatDate = (d) => {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const todayFormatted = formatDate(today);

    const selectedFormattedDate = formatDate(selectedDate);

    // =========================
    // CHECKS
    // =========================

  const selectedDay = new Date(selectedDate);
  selectedDay.setHours(0, 0, 0, 0);

  const todayDay = new Date();
  todayDay.setHours(0, 0, 0, 0);

  const isFutureDate =
    selectedDay > todayDay;

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

          fullDate: formatDate(dateObj),
        });
      }

      return days;
    };

    // =========================
    // AUTO SCROLL TO CURRENT DAY
    // =========================
useEffect(() => {

  if (!calendarRef.current) return;

  const selectedIndex =
    calendarDays.findIndex(
      (day) =>
        day.fullDate ===
        selectedFormattedDate
    );

  if (selectedIndex === -1) return;

  const dayWidth = 77;

  calendarRef.current.scrollTo({
    left:
      selectedIndex * dayWidth - 120,
    behavior: "smooth",
  });

}, [selectedFormattedDate]);

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
          const res = await apiFetch(`/recommendation/${userId}/${type}`);

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

   const fetchLogs = async () => {
  try {
    const res = await apiFetch(`/routinelog?user_id=${userId}`);

    const data = await res.json();

    if (res.ok) {
      console.log("FETCHED LOGS", { count: (data.logs || []).length });
      setSavedLogs(data.logs || []);
    } else {
      console.log("FETCH LOGS FAILED", res.status, data);
    }
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  if (!userId) return;
  fetchLogs();
}, [userId]);
    // =========================
    // LOAD SAVED COMPLETED STEPS
    // =========================

    useEffect(() => {
      const normalizedType = (currentType || "morning").toLowerCase();

      console.log("LOAD LOGS DEBUG", {
        selectedFormattedDate,
        currentType: normalizedType,
        savedLogsCount: savedLogs.length,
        routineLength: routine.length,
      });

      // Try to restore from localStorage first (fast, reliable for navigation)
      const storageKey = `routines_${userId || 'anon'}_${selectedFormattedDate}_${normalizedType}`;
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const valid = Array.isArray(parsed)
            ? parsed.map(Number).filter((n) => !Number.isNaN(n) && n >= 0 && n < routine.length)
            : [];

          const unique = [...new Set(valid)].sort((a, b) => a - b);
          setCompletedSteps(unique);
          return;
        } catch (err) {
          // ignore and fall through to server logs
        }
      }

      const currentLog = savedLogs.find(
        (log) =>
          log.date === selectedFormattedDate &&
          (log.routine_type || "").toLowerCase() === normalizedType,
      );

      if (currentLog) {
        const raw = Array.isArray(currentLog.completed_indexes)
          ? currentLog.completed_indexes
          : [];

        const indexes = raw
          .map((x) => Number(x))
          .filter((n) => !Number.isNaN(n) && n >= 0 && n < routine.length);

        const unique = [...new Set(indexes)].sort((a, b) => a - b);

        setCompletedSteps(unique);
      } else {
        setCompletedSteps([]);
      }
    }, [savedLogs, selectedFormattedDate, currentType, routine.length]);

    // =========================
    // SAVE ROUTINE LOG
    // =========================

    const saveLog = async (nextCompletedIndexes) => {
      if (!routine.length || !isCurrentDay) return;

      const normalizedType = (currentType || "morning").toLowerCase();

      const valid = Array.isArray(nextCompletedIndexes)
        ? nextCompletedIndexes.map(Number).filter((n) => !Number.isNaN(n) && n >= 0 && n < routine.length)
        : [];

      const unique = [...new Set(valid)].sort((a, b) => a - b);

      try {
        const bodyData = {
          user_id: userId,
          date: selectedFormattedDate,
          routine_type: normalizedType,
          completed_steps: unique.length,
          completed_indexes: unique,
          total_steps: routine.length,
        };

        console.log("SAVE LOG DEBUG", { bodyData });

        const res = await apiFetch("/routinelog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        });

        const text = await res.text();
        console.log("SAVE LOG RESPONSE", res.status, text);

        if (res.ok) {
          const updatedLog = {
            date: selectedFormattedDate,
            routine_type: normalizedType,
            completed_steps: unique.length,
            total_steps: routine.length,
            completed_indexes: unique,
            completion_percentage: routine.length ? (unique.length / routine.length) * 100 : 0,
          };

          setSavedLogs((prev) => {
            const filtered = prev.filter(
              (log) => !(log.date === selectedFormattedDate && (log.routine_type || "").toLowerCase() === normalizedType),
            );
            return [...filtered, updatedLog];
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    // =========================
    // TOGGLE STEP
    // =========================
  const toggleStep = (index) => {

    if (!isCurrentDay) return;

    if (index < 0 || index >= routine.length) return;

    setCompletedSteps((prev) => {
      const next = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index].sort((a, b) => a - b);

      // persist locally for quick restore on navigation
      try {
        const normalizedType = (currentType || "morning").toLowerCase();
        const storageKey = `routines_${userId || 'anon'}_${selectedFormattedDate}_${normalizedType}`;
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (err) {
        console.log("localStorage save failed", err);
      }

      saveLog(next);
      return next;
    });
  };

    return (
  <div className="w-full bg-[#faede7] pb-40">
          {/* HEADER */}

        <h1 className="app-page-title px-4 py-10">Routines</h1>

        
        <Calendar
          calendarRef={calendarRef}
          calendarDays={calendarDays}
          selectedFormattedDate={selectedFormattedDate}
          todayFormatted={todayFormatted}
          savedLogs={savedLogs}
          onSelectDate={(fullDate) => {
            const parts = fullDate.split("/");
            const clickedDate = new Date(parts[2], parts[1] - 1, parts[0]);
            setSelectedDate(clickedDate);
          }}
          goToPreviousMonth={goToPreviousMonth}
          goToNextMonth={goToNextMonth}
          monthYear={monthYear}
        />

        <RoutineTabs navigate={navigate} currentType={currentType} />

        <ProgressBar completedStepsLength={completedSteps.length} totalSteps={routine.length} />

        <RoutineList routine={routine} completedSteps={completedSteps} toggleStep={toggleStep} isCurrentDay={isCurrentDay} />
      </div>
    );
  };
  export default Routines;
