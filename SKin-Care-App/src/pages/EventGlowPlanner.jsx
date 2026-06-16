import React, { useState, useEffect } from "react";
import { Sparkles, Sun, Moon, AlertCircle, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import eventGlowPlans from "../data/eventGlowPlans.json";

const EventGlowPlanner = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("event"); // "event", "days", "result"
  const [selectedEvent, setSelectedEvent] = useState("");
  const [daysRemaining, setDaysRemaining] = useState("");
  const [customDays, setCustomDays] = useState("");
  const [routine, setRoutine] = useState(null);
  const [userSkinType, setUserSkinType] = useState("");
  const [userSkinConcerns, setUserSkinConcerns] = useState([]);

  const eventOptions = [
    "Wedding",
    "Engagement",
    "Date Night",
    "Party",
    "Birthday",
    "Festival",
    "Function",
    "Photoshoot",
    "Interview",
    "Other",
  ];

  const dayOptions = [1, 3, 7, 14, 21, 30, 45, 60, 90];

  // Load user data from localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5000/user/${userId}`);
        const data = await response.json();

        if (response.ok && data.skinType) {
          setUserSkinType(data.skinType);
          setUserSkinConcerns(data.skinProblems || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("eventGlowData");
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedEvent(data.event);
      setDaysRemaining(data.days);
      setRoutine(data.routine);
      setStep("result");
    }
  }, []);

  const generateRoutine = (event, days) => {
    const plan = eventGlowPlans[event];
    if (!plan) return null;

    const dayKey = days.toString();
    const routine = plan[dayKey];

    if (!routine) {
      // Find the closest available plan
      const availableDays = Object.keys(plan)
        .map(Number)
        .sort((a, b) => a - b);
      const closest = availableDays.reduce((prev, curr) =>
        Math.abs(curr - days) < Math.abs(prev - days) ? curr : prev
      );
      return plan[closest.toString()];
    }

    return routine;
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setStep("days");
  };

  const handleDaysSelect = (days) => {
    setDaysRemaining(days);
    const generatedRoutine = generateRoutine(selectedEvent, days);
    setRoutine(generatedRoutine);

    // Save to localStorage
    localStorage.setItem(
      "eventGlowData",
      JSON.stringify({
        event: selectedEvent,
        days: days,
        routine: generatedRoutine,
        timestamp: new Date().toISOString(),
      })
    );

    setStep("result");
  };

  const handleCustomDays = () => {
    const days = parseInt(customDays);
    if (days > 0 && days <= 365) {
      handleDaysSelect(days);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("eventGlowData");
    setSelectedEvent("");
    setDaysRemaining("");
    setRoutine(null);
    setStep("event");
  };

  return (
    <div className="min-h-full flex flex-col justify-center space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        {step !== "event" && (
          <button
            onClick={() => setStep(step === "days" ? "event" : "days")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <Sparkles size={26} className="text-[#d85167]" />
          <h1 className="text-xl font-semibold text-gray-900">Event Glow</h1>
        </div>
      </div>

      {/* Event Selection */}
      {step === "event" && (
        <div className="space-y-3">
          <div className="app-card p-4">
            <p className="text-sm text-gray-600 mb-4">
              Select an event to get a customized skincare routine
            </p>

            <div className="grid grid-cols-2 gap-3">
              {eventOptions.map((event) => (
                <button
                  key={event}
                  onClick={() => handleEventSelect(event)}
                  className={`px-4 py-3 rounded-2xl border-2 transition text-center font-medium text-sm ${
                    selectedEvent === event
                      ? "border-[#d85167] bg-[#faede7] text-[#d85167]"
                      : "border-gray-200 bg-white text-gray-900 hover:border-[#d85167]"
                  }`}
                >
                  {event}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Days Selection */}
      {step === "days" && (
        <div className="space-y-3">
          <div className="app-card p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Days until your event?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose from preset options or enter a custom number
            </p>

            {/* Preset Options */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {dayOptions.map((day) => (
                <button
                  key={day}
                  onClick={() => handleDaysSelect(day)}
                  className="px-3 py-3 rounded-2xl border-2 transition text-center border-gray-200 bg-white hover:border-[#d85167] hover:bg-[#faede7] font-medium text-sm"
                >
                  <span className="text-gray-900 font-semibold">{day}</span>
                  <p className="text-xs text-gray-500">
                    {day === 1 ? "day" : "days"}
                  </p>
                </button>
              ))}
            </div>

            {/* Custom Days Input */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter custom days:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  placeholder="Enter days"
                  className="app-input flex-1 text-sm"
                />
                <button
                  onClick={handleCustomDays}
                  className="px-4 py-3 bg-[#d85167] text-white rounded-2xl hover:bg-[#c13d59] transition font-semibold text-sm"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {step === "result" && routine && (
        <div className="space-y-3">
          {/* Summary Card */}
          <div className="app-card p-4 bg-[var(--surface-strong)] border-[#d85167] border-2">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedEvent}
                </h2>
                <p className="text-sm text-gray-600">
                  {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining
                </p>
              </div>
              <Sparkles size={28} className="text-[#d85167]" />
            </div>

            {userSkinType && (
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                  {userSkinType} Skin
                </span>
                {userSkinConcerns.length > 0 && (
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                    {userSkinConcerns.join(", ")}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Morning Routine */}
          <div className="app-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sun size={22} className="text-[#d85167]" />
              <h3 className="font-semibold text-gray-900 text-sm">
                Morning Routine
              </h3>
            </div>
            <ol className="space-y-2">
              {routine.morning.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-[#faede7] rounded-full text-xs font-semibold text-[#d85167]">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 text-sm pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Evening Routine */}
          <div className="app-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Moon size={22} className="text-[#d85167]" />
              <h3 className="font-semibold text-gray-900 text-sm">
                Evening Routine
              </h3>
            </div>
            <ol className="space-y-2">
              {routine.evening.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-[#faede7] rounded-full text-xs font-semibold text-[#d85167]">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 text-sm pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {routine.tips && (
            <div className="app-card p-4 border-l-4 border-[#d85167]">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                💡 Tips
              </h3>
              <ul className="space-y-2">
                {routine.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-2 text-gray-700 text-sm">
                    <span className="text-sm">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {routine.warnings && (
            <div className="app-card p-4 border-l-4 border-red-500">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  Warnings
                </h3>
              </div>
              <ul className="space-y-1 ml-6">
                {routine.warnings.map((warning, idx) => (
                  <li key={idx} className="text-gray-700 text-sm">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep("event")}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-900 rounded-2xl hover:bg-gray-50 transition font-semibold text-sm"
            >
              Change
            </button>
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-3 bg-[#d85167] text-white rounded-2xl hover:bg-[#c13d59] transition font-semibold text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {step === "result" && !routine && (
        <div className="app-card p-6 text-center">
          <p className="text-gray-600 mb-4 text-sm">
            No routine found for this combination
          </p>
          <button
            onClick={() => setStep("event")}
            className="px-4 py-2 bg-[#d85167] text-white rounded-2xl hover:bg-[#c13d59] transition font-semibold text-sm"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default EventGlowPlanner;
