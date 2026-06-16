import React from "react";
import { Link } from "react-router-dom";

const RouProSkinNavs = ({logo, text, path, bg, iconColor}) => {
  return (
    <Link to={path} className="block h-full">
      <div className={`app-card-sm w-full h-full min-h-[72px] px-3 py-3 flex flex-col items-center justify-center rounded-2xl border border-gray-200 hover:shadow-sm transition overflow-hidden`}>
        <div className={`flex items-center justify-center ${bg} rounded-full w-12 h-12 mb-2 flex-shrink-0`}> 
          <span className={`${iconColor}`}>{logo}</span>
        </div>
        <h1 className="text-sm font-semibold text-gray-900 text-center truncate">{text}</h1>
      </div>
    </Link>
  );
};

export default RouProSkinNavs;
