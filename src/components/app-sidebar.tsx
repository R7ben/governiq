"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, BookOpen, ClipboardCheck, LayoutDashboard, ShieldCheck } from "lucide-react";

const items = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/#universe", label: "Company explorer", icon: BarChart3 },
  { href: "/readiness", label: "Readiness review", icon: ClipboardCheck },
  { href: "/methodology", label: "How it works", icon: BookOpen },
];

export function AppSidebar() {
  const pathname = usePathname();
  return <aside className="fixed left-1/2 top-4 z-40 hidden -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950/70 p-2 shadow-2xl shadow-emerald-950/20 backdrop-blur-2xl md:flex" aria-label="Primary navigation">
    <Link href="/" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2.5 text-emerald-300 transition hover:border-emerald-300/50 hover:bg-emerald-400/20" aria-label="GovernIQ overview"><ShieldCheck className="h-5 w-5" /></Link>
    <nav className="flex items-center gap-1">{items.map(({ href, label, icon: Icon }) => { const active = pathname === href || (href === "/" && pathname === "/"); return <Link key={href} href={href} aria-label={label} title={label} className={`group relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs transition-colors duration-200 ${active ? "text-emerald-300" : "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"}`}>{active && <motion.span layoutId="sidebar-active" className="absolute inset-0 rounded-xl bg-emerald-400/15 shadow-[0_0_22px_rgba(52,211,153,0.12)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}<Icon className="relative h-4 w-4" /><span className="relative hidden lg:inline">{label}</span>{active && <motion.span layoutId="sidebar-active-bar" className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-emerald-300" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}</Link>; })}</nav>
  </aside>;
}
