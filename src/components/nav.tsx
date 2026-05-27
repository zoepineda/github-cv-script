"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Pull Requests" },
  { href: "/analytics", label: "Analytics" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[var(--color-border-muted)]">
      <div className="mx-auto flex max-w-[960px] items-center gap-6 px-6">
        <Link
          href="/"
          className="py-3 text-sm font-semibold text-[var(--color-fg-default)] no-underline"
        >
          Career OS
        </Link>
        <div className="flex gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-3 text-sm no-underline transition-colors ${
                  active
                    ? "text-[var(--color-fg-default)]"
                    : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-[var(--color-accent-fg)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
