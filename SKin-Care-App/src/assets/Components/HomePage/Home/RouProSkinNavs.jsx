import React from "react";
import { Link } from "react-router-dom";

const RouProSkinNavs = ({logo, text, path, bg, iconColor}) => {
  return (
    <div>
      <div >
        <Link to={path}>
          <div className={`bg-white w-fit px-4  gap-1 shadow-gray shadow-2xl rounded-lg py-3 flex flex-col justify-center items-center `}>
            <div className={`w-fit p-2 rounded-md flex- items-center justify-center ${bg}`}>
             <span className={`${iconColor}`}>
             {logo}
             </span>
            </div>
            <h1 className="text-xs font-semibold">{text}</h1>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RouProSkinNavs;
