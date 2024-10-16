"use client";

import React, { ReactNode } from "react";
import SideNavbar from "./navbar/SideNavbar";
import Header from "./navbar/Header";
import MobileHeader from "./navbar/MobileHeader";
import { adminNavItems, staffNavItems } from "./navbar/navItems";
import useUserData from "@/hooks/useUserData";
import FloatingMessageIcon from "./FloatingMessageIcon";

interface NavbarProps {
  children: ReactNode;
}

const NavLayout: React.FC<NavbarProps> = ({ children }) => {
  const { userRole } = useUserData();
  const navItems = userRole == "admin" ? adminNavItems : staffNavItems;
  return (
    <div className="flex gap-0 w-full">
      <SideNavbar navItems={navItems} />
      <div className="flex flex-col w-full">
        <Header />
        <MobileHeader navItems={navItems} />
        <main className="md:pt-10 pt-20 p-5 bg-[#fbfaf7] md:h-full h-screen">
          {children}
          <FloatingMessageIcon />
        </main>
      </div>
    </div>
  );
};

export default NavLayout;
