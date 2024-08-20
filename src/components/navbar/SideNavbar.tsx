/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { IoIosArrowBack, IoLogoSlack } from "react-icons/io";
import navItems from "./navItems";
import { NavLink } from "./NavLink";

const SideNavbar: React.FC = () => {
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleNavbar = () => {
    setIsMinimized((prev: boolean) => !prev);
  };

  return (
    <div
      className={`h-screen w-auto ${
        isMinimized ? "w-20" : "w-56"
      } hidden md:flex md:flex-col z-50`}
    >
      <span
        className={`h-14 bg-gray-100 justify-between px-5 items-center border-r border-b border-gray-300 hidden transition-width duration-300 md:flex`}
      >
        <span className="flex items-center text-primary font-semibold rounded-md gap-2">
          <IoLogoSlack className="text-3xl text-gray-700" />
        </span>
      </span>
      <div className="w-full overflow-y-auto h-full flex">
        <nav
          className={`flex ${
            isMinimized ? "w-20" : "w-56"
          } bg-gray-100 shadow-lg border-r border-gray-300 relative h-auto transition-width duration-300 flex-col items-start justify-start pt-5 p-4 gap-2`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isMinimized={isMinimized}
              isActive={pathname === item.href}
            />
          ))}
          <button
            onClick={toggleNavbar}
            className={`flex items-center p-1 border bg-inherit border-gray-400 absolute bottom-4 text-gray-500 rounded-lg transition-all duration-500 ${
              isMinimized ? "transform rotate-180" : ""
            }`}
          >
            <IoIosArrowBack className="text-xl" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default SideNavbar;
