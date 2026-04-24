import React from "react";
import { Link } from "react-router-dom";

const RoutinesDashBoard = ({ logo, text, option, bg, iconColor, type }) => {
  return (
    <Link  to={`/routines/${type}`}
  className={`w-full ${bg} mt-2 rounded-md flex shadow-2xl justify-between items-center px-2 py-1`}>
      <div className="flex items-center space-x-1">
        <span className={`${iconColor}`}>{logo}</span>
        <h1 className="font-md text-sm">{text}</h1>
      </div>
       <span className="text-gray-400">{option}</span>
    </Link>
  );
};

export default RoutinesDashBoard;
