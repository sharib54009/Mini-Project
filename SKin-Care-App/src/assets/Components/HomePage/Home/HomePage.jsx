import React from "react";
import User from "./User";
import RoutinesDashBoard from "./RoutinesDashBoard";
import RouProSkinNavs from "./RouProSkinNavs";
import SkinCheck from "./SkinCheck";
import AddProducts from "./AddProducts";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../../api/api";
import {
  SunMedium,
  MoonStar,
  CircleSmall,
  Droplets,
  Package,
  NotepadText,
  User as UserIcon,
} from "lucide-react";






const RoutineElems = [
  {
    logo: <SunMedium size={23} />,
    type: "morning",
    text: "Morning Routine",
    option: <CircleSmall />,
    bg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    logo: <MoonStar size={23} />,
    type: "evening",
    text: "Evening Routine",
    option: <CircleSmall />,
    bg: "bg-pink-100",
    iconColor: "text-pink-500",
  },
];

const Nav2Elems = [
  {
    logo: <Droplets size={20} />,
    text: "Routines",
    path: "/routines/morning",
    bg: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    logo: <Package size={20} />,
    text: "Products",
    path: "/products",
    bg: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    logo: <NotepadText size={20} />,
    text: "Skin Log",
    path: "/skin-log",
    bg: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
];

const HomePage = () => {

  const [userName, setUserName] = useState("");

   useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) return;

        const response = await apiFetch(`/user/${userId}`);
        const data = await response.json();
        

        if (response.ok) {
          setUserName(data.name);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-full flex flex-col justify-center space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <User userName={userName} />
        <Link to="/profile" className="app-button app-button-secondary inline-flex items-center gap-2">
          <UserIcon size={18} />
          Profile
        </Link>
      </div>

      <div className="app-card app-section mt-4 space-y-4">
        <h1 className="text-xs font-semibold">TODAY'S ROUTINES</h1>
        {RoutineElems.map((elem, idx) => (
          <RoutinesDashBoard
            key={idx}
            logo={elem.logo}
            text={elem.text}
            option={elem.option}
            bg={elem.bg}
            iconColor={elem.iconColor}
            type={elem.type}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Nav2Elems.map((elem, idx) => (
          <RouProSkinNavs
            key={idx}
            logo={elem.logo}
            text={elem.text}
            bg={elem.bg}
            iconColor={elem.iconColor}
            path={elem.path}
          />
        ))}
      </div>

      <SkinCheck />
      <AddProducts />
    </div>
  );
};

export default HomePage;
