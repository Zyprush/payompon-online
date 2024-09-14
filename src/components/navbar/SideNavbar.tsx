/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import { IconGpsFilled } from "@tabler/icons-react";
import GetText from "@/app/admin/settings/GetText";

const SideNavbar:  React.FC<{navItems:any}> = ({navItems}) => {
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div
      className={`min-h-screen ${
        isMinimized ? "w-20" : "w-56"
      } hidden md:flex md:flex-col z-50`}
    >
      <span
        className={`h-14 bg-gray-100 justify-between px-5 items-center border-r border-b border-gray-300 hidden transition-width duration-300 md:flex`}
      >
        <span className="flex items-center text-primary font-semibold rounded-md gap-2">
          <p className="p-2 text-primary custom-shadow font-extrabold rounded-md flex items-center text-xl gap-2"><GetText name="name" title="name"/></p>
        </span>
      </span>
      <div className="w-full overflow-y-auto h-full flex">
        <nav
          className={`flex ${
            isMinimized ? "w-20" : "w-56"
          } bg-gray-100 shadow-lg border-r border-gray-300 relative h-auto transition-width duration-300 flex-col items-start justify-start pt-5 p-4 gap-2`}
        >
          {navItems.map((item:any) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isMinimized={isMinimized}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideNavbar;
