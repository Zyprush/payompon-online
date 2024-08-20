import Link from "next/link";
import React from "react";
interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isMinimized: boolean;
  isActive: boolean;
}
export const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  isMinimized,
  isActive,
}) => (
  <Link
    href={href}
    className={`w-full items-center justify-start flex gap-3 text-sm font-[500] p-3 hover:bg-secondary rounded-md hover:text-white transition-all duration-300  hover:shadow-inner ${
      isActive ? "bg-primary text-gray-100" : "text-gray-700"
    }`}
  >
    <span className={`w-auto ${isMinimized ? "mx-auto" : ""}`}>
      <Icon className="text-xl" />
    </span>
    {!isMinimized && label}
  </Link>
);
