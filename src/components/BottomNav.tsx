"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "首页", icon: HomeIcon },
  { href: "/today", label: "打卡", icon: CheckIcon },
  { href: "/training", label: "规则", icon: ListIcon },
  { href: "/progress", label: "变化", icon: ChartIcon },
  { href: "/calendar", label: "日历", icon: CalendarIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass rounded-none rounded-t-2xl border-t border-white/40">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all min-w-0 ${
                active
                  ? "text-primary scale-110"
                  : "text-dark/35 hover:text-dark/60"
              }`}
            >
              <item.icon active={active} />
              <span className="text-[10px] leading-tight font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe-area spacer */}
      <div className="h-safe-area bg-white/80 backdrop-blur-md" />
    </nav>
  );
}

/* ── Icons ── */
const iconProps = (active: boolean) => ({
  width: 22, height: 22, viewBox: "0 0 24 24" as const,
  fill: "none" as const,
  stroke: active ? "#FF6B35" : "rgba(23,23,23,0.35)",
  strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
});

function HomeIcon({ active }: { active: boolean }) {
  const p = iconProps(active);
  return (
    <svg {...p}>
      <path d="M3 12l9-9 9 9" />
      <path d="M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
    </svg>
  );
}

function CheckIcon({ active }: { active: boolean }) {
  const p = iconProps(active);
  return (
    <svg {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  const p = iconProps(active);
  return (
    <svg {...p}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1.5" fill={active ? "#FF6B35" : "rgba(23,23,23,0.35)"} stroke="none" />
      <circle cx="4" cy="12" r="1.5" fill={active ? "#FF6B35" : "rgba(23,23,23,0.35)"} stroke="none" />
      <circle cx="4" cy="18" r="1.5" fill={active ? "#FF6B35" : "rgba(23,23,23,0.35)"} stroke="none" />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  const p = iconProps(active);
  return (
    <svg {...p}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  const p = iconProps(active);
  return (
    <svg {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
