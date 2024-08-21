import { IconBrandApplePodcast, IconChecklist, IconInfoSquare, IconLayoutDashboard, IconMail, IconNotification, IconPremiumRights, IconSettings, IconUsers } from "@tabler/icons-react";

const navItems = [
    { href: "/admin/dashboard", icon: IconLayoutDashboard, label: "Dashboard" },
    { href: "/admin/certificate", icon: IconChecklist, label: "Certificate" },
    { href: "/admin/documents", icon: IconChecklist, label: "Documents" },
    { href: "/admin/officials", icon: IconUsers, label: "Officials" },
    { href: "/admin/resident", icon: IconBrandApplePodcast, label: "Resident" },
    { href: "/admin/announce", icon: IconInfoSquare, label: "Announcement" },
    { href: "/admin/message", icon: IconMail, label: "Message" },
    { href: "/admin/notification", icon: IconNotification, label: "Notification" },
    { href: "/admin/revenue", icon: IconPremiumRights, label: "Revenue" },
    { href: "/admin/settings", icon: IconSettings, label: "Settings" },
];

export default navItems;