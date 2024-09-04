import { IconChecklist, IconDeviceFloppy, IconHelpHexagon, IconInfoSquare, IconLayoutDashboard, IconMail, IconNotification, IconPremiumRights, IconSettings, IconUserHexagon, IconUsers } from "@tabler/icons-react";

export const adminNavItems = [
    { href: "/admin/dashboard", icon: IconLayoutDashboard, label: "Dashboard" },
    { href: "/admin/certificate", icon: IconChecklist, label: "Certificate" },
    { href: "/admin/officials", icon: IconUsers, label: "Officials" },
    { href: "/admin/resident", icon: IconUserHexagon, label: "Resident" },
    { href: "/admin/announce", icon: IconInfoSquare, label: "Announcement" },
    { href: "/admin/message", icon: IconMail, label: "Message" },
    { href: "/admin/notification", icon: IconNotification, label: "Notification" },
    { href: "/admin/revenue", icon: IconPremiumRights, label: "Revenue" },
    // { href: "/admin/backup", icon: IconDeviceFloppy, label: "Backup" },
    { href: "/admin/settings", icon: IconSettings, label: "Settings" },
];

export const userNavItems = [
    { href: "/user/dashboard", icon: IconLayoutDashboard, label: "Home" },
    { href: "/user/request", icon: IconChecklist, label: "Request" },
    { href: "/user/officials", icon: IconUsers, label: "Officials" },
    { href: "/user/announce", icon: IconInfoSquare, label: "Announcement" },
    { href: "/user/message", icon: IconMail, label: "Message" },
    { href: "/user/notification", icon: IconNotification, label: "Notification" },
    { href: "/user/about", icon: IconHelpHexagon, label: "About" },
];


