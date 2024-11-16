import { IconChecklist, IconDeviceFloppy, IconHelpHexagon, IconInfoSquare, IconLayoutDashboard, IconMail, IconNotification, IconPremiumRights, IconSettings, IconUserHexagon, IconUsers, IconVip } from "@tabler/icons-react";

export const adminNavItems = [
    { href: "/admin/dashboard", icon: IconLayoutDashboard, label: "Dashboard" },
    { href: "/admin/certificate", icon: IconChecklist, label: "Certificate" },
    { href: "/admin/officials", icon: IconVip, label: "Officials" },
    { href: "/admin/staff", icon: IconUsers, label: "User Management" },
    { href: "/admin/resident", icon: IconUserHexagon, label: "Resident" },
    { href: "/admin/announce", icon: IconInfoSquare, label: "Announcement" },
    { href: "/admin/notification", icon: IconNotification, label: "Notification" },
    { href: "/admin/revenue", icon: IconPremiumRights, label: "Revenue"},
    { href: "/admin/logs", icon: IconDeviceFloppy, label: "Logs"},
    { href: "/admin/settings", icon: IconSettings, label: "Settings" },
];


export const staffNavItems = [
    { href: "/admin/dashboard", icon: IconLayoutDashboard, label: "Dashboard" },
    { href: "/admin/certificate", icon: IconChecklist, label: "Certificate" },
    { href: "/admin/officials", icon: IconVip, label: "Officials" },
    { href: "/admin/resident", icon: IconUserHexagon, label: "Resident" },
    { href: "/admin/announce", icon: IconInfoSquare, label: "Announcement" },
    { href: "/admin/notification", icon: IconNotification, label: "Notification" },
    { href: "/admin/revenue", icon: IconPremiumRights, label: "Revenue"},
];

export const userNavItems = [
    { href: "/user/dashboard", icon: IconLayoutDashboard, label: "Home" },
    { href: "/user/request", icon: IconChecklist, label: "Request" },
    { href: "/user/officials", icon: IconUsers, label: "Officials" },
    { href: "/user/announce", icon: IconInfoSquare, label: "Announcement" },
    { href: "/user/notification", icon: IconNotification, label: "Notification" },
    { href: "/user/about", icon: IconHelpHexagon, label: "About" },
];


