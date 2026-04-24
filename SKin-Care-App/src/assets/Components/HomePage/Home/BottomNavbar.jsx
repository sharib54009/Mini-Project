import React from 'react'
import { Home, Droplets, Package, NotepadText, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Droplets, label: "Routine", path: "/routines" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: NotepadText, label: "Skin-Log", path: "/skin-log" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNavbar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 w-full bg-white border-t flex justify-around py-2">
      
      {navItems.map((item, idx) => {
        const Icon = item.icon;

        const isActive =
          item.path === "/routines"
            ? location.pathname.startsWith("/routines")
            : location.pathname === item.path;

        return (
          <Link
            key={idx}
            to={item.path}
            className={`flex flex-col items-center text-xs ${
              isActive ? "text-pink-500" : "text-gray-500"
            }`}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </Link>
        );
      })}

    </div>
  );
};

export default BottomNavbar
