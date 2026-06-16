import React from "react";

const Calendar = ({
  calendarRef,
  calendarDays,
  selectedFormattedDate,
  todayFormatted,
  savedLogs,
  onSelectDate,
  goToPreviousMonth,
  goToNextMonth,
  monthYear,
}) => {
  return (
    <div className="px-4">
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

          const hasData = savedLogs.some((log) => log.date === item.fullDate && Number(log.completed_steps) > 0);

          const isToday = item.fullDate === todayFormatted;

          return (
            <div
              key={idx}
              onClick={() => onSelectDate(item.fullDate)}
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
  );
};

export default Calendar;
