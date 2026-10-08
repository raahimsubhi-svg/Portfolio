import { useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { useMagnetic } from "../lib/useMagnetic";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
];

export default function Header({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false);
  const contactRef = useRef<HTMLAnchorElement>(null);
  useMagnetic(contactRef);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-page relative flex h-16 items-center justify-between gap-4">
        <a
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
          aria-label="Raahim home"
        >
          <img src="/favicon.svg" alt="" width="28" height="28" className="h-7 w-7" />
          Raahim
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
          {links.map((l) => {
            const active =
              l.href === "/" ? currentPath === "/" : currentPath.startsWith(l.href);
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  active ? "bg-wash text-ink" : "text-ink-soft hover:bg-wash"
                }`}
              >
                {l.label}
              </a>
            );
          })}
          </span>
          <a
            ref={contactRef}
            href="/contact"
            className="btn-primary ml-3 !min-h-10 !px-5 !text-sm"
          >
            Contact
          </a>
        </nav>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="menu-drop border-t border-line bg-paper px-4 py-3 md:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 font-medium hover:bg-wash"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 w-full"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
