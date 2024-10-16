"use client";

import React, { ReactNode } from "react";
import SideNavbar from "./navbar/SideNavbar";
import Header from "./navbar/Header";
import MobileHeader from "./navbar/MobileHeader";
import { userNavItems } from "./navbar/navItems";
import FloatingMessageIcon from "./FloatingMessageIcon";

interface NavbarProps {
  children: ReactNode;
}

const UserNavLayout: React.FC<NavbarProps> = ({ children }) => {
  return (
    <div className="flex gap-0 w-full">
      <SideNavbar navItems={userNavItems} />
      <div className="flex flex-col w-full">
        <Header />
        <MobileHeader navItems={userNavItems} />
        <main className="md:pt-10 pt-20 p-5 bg-[#fbfaf7] md:h-full h-screen">
          {children}
          <FloatingMessageIcon />
        </main>
      </div>
    </div>
  );
};

export default UserNavLayout;
