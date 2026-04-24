import React from "react";
import User from "./User";
import RoutinesDashBoard from "./RoutinesDashBoard";
import RouProSkinNavs from "./RouProSkinNavs";
import SkinCheck from "./SkinCheck";
import AddProducts from "./AddProducts";
import BottomNavbar from "./BottomNavbar";
import { useEffect, useState } from "react";
import {
  SunMedium,
  MoonStar,
  CircleSmall,
  Droplets,
  Package,
  NotepadText,
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
    path: "/routines",
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

        const response = await fetch(`http://127.0.0.1:5000/user/${userId}`);
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
    <div className="min-h-screen bg-[#faede7]">
      <div className="max-w-md mx-auto  rounded-lg py-6">
        <User userName={userName} />

        <div className="px-3">
          <div className="bg-white w-full px-5 py-5  mt-4 rounded-lg shadow-gray shadow-2xl ">
            <h1 className="text-xs font-semibold  ">TODAY'S ROUTINES</h1>
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
        </div>

        <div className="flex gap-7 mt-5 justify-center">
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
        <BottomNavbar />
      </div>


    </div>
  );
};

export default HomePage;
