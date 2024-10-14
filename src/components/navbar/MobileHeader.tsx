/* eslint-disable @next/next/no-img-element */
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { ReactNode, useState } from "react";
import Account from "./Account";
import { NavLink } from "./NavLink";
import { IconDotsVertical, IconX } from "@tabler/icons-react";
import GetImage from "../GetImage";
import MessageIndicator from "./MessageIndicator";

const MobileHeader: React.FC<{ navItems: any }> = ({ navItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="h-auto w-screen md:hidden flex flex-col dark:bg-gray-900">
      {/* topbar */}
      <span className="w-full h-14 z-50  bg-white justify-between px-3 items-center border-b border-zinc-300 flex fixed top-0">
        <details className="dropdown dropdown-start">
          <summary
            tabIndex={0}
            role="button"
            className="h-10 w-10 flex items-center justify-center overflow-hidden border-2 border-primary bg-primary rounded-full"
          >
            <div className="width-[40px]">
              <GetImage storageLink="settings/brgyLogo" />
            </div>
          </summary>
          <Account />
        </details>
        <MessageIndicator />
        <button
          onClick={toggleMenu}
          className="text-2xl text-zinc-700 dark:text-zinc-300 p-2"
        >
          {isMenuOpen ? <IconX /> : <IconDotsVertical />}
        </button>
      </span>
      {/* sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed h-screen top-14 bottom-0 flex flex-col p-5 gap-2 z-50 items-start justify-start w-3/5 border-r border-zinc-300  bg-white"
          >
            {navItems.map((item: any) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
                isMinimized={false}
              />
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileHeader;
