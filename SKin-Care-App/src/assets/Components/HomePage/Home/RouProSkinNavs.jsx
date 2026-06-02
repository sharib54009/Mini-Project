import React from "react";
import { Link } from "react-router-dom";

const RouProSkinNavs = ({logo, text, path, bg, iconColor}) => {
  return (
    <Link to={path} className="block">
      <div className={`app-card-sm w-full px-4 gap-1 py-3 flex flex-col justify-center items-center`}>
        <div className={`w-fit p-2 rounded-2xl flex items-center justify-center ${bg}`}>
          <span className={`${iconColor}`}>{logo}</span>
        </div>
        <h1 className="text-xs font-semibold">{text}</h1>
      </div>
    </Link>
  );
};

export default RouProSkinNavs;
