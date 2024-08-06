"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navList = [
  { name: "jh-devlog", href: "/blog" },
  { name: "about", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <nav className="bg-[#121212] border-blue-950 px-3 py-3">
      <section className="flex gap-2">
        {navList.map((navItem) => (
          <Link
            href={navItem.href}
            key={navItem.name}
            className={cn(
              "rounded-full px-4 py-1 text-center text-sm transition-colors hover:text-primary",
              pathname?.startsWith(navItem.href) ? "bg-muted font-medium text-primary" : "text-muted-foreground"
            )}
          >
            {navItem.name}
          </Link>
        ))}
      </section>
    </nav>
  );
}
