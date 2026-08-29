"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, ClipboardCheck, LayoutDashboard, ShieldCheck } from "lucide-react";

const items = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/#universe", label: "Company explorer", icon: BarChart3 },
  { href: "/readiness", label: "Readiness review", icon: ClipboardCheck },
  { href: "/methodology", label: "How it works", icon: BookOpen },
];

export function AppSidebar() {
  const pathname = usePathname();
  return <aside className="fixed inset-y-0 left-0 z-40 hidden w-[72px] flex-col items-center border-r border-white/10 bg-zinc-950/70 py-5 backdrop-blur-2xl md:flex" aria-label="Primary navigation">
    <Link href="/" className="mb-8 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2.5 text-emerald-300 transition hover:border-emerald-300/50 hover:bg-emerald-400/20" aria-label="GovernIQ overview"><ShieldCheck className="h-5 w-5" /></Link>
    <nav className="flex flex-1 flex-col items-center gap-3">{items.map(({ href, label, icon: Icon }) => { const active = pathname === href || (href === "/" && pathname === "/"); return <Link key={href} href={href} aria-label={label} title={label} className={`group relative rounded-xl p-3 transition-all duration-200 ${active ? "bg-emerald-400/15 text-emerald-300 shadow-[0_0_22px_rgba(52,211,153,0.12)]" : "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"}`}><Icon className="h-4 w-4" />{active && <span className="absolute -right-[1px] top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-emerald-300" />}</Link>; })}</nav>
  </aside>;
}
