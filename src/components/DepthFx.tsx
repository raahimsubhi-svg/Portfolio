import { useEffect } from "react";
import gsap from "gsap";

interface Setter {
  fn: (v: number) => void;
  depth: number;
}

// A1: pointer parallax inside hero graphics. Elements tagged
// data-depth move a few pixels opposite/with the cursor for a
// layered depth illusion. Fine pointers only, transform-only,
// capped at 12px, reduced motion disabled, layers return to
// rest on pointer leave.
export default function DepthFx() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const roots = Array.from(
      document.querySelectorAll<HTMLElement>("[data-depth-root]")
    );
    if (!roots.length) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      roots.forEach((root) => {
        const layers = Array.from(
          root.querySelectorAll<SVGElement>("[data-depth]")
        );
        if (!layers.length) return;

        const setters: Setter[] = layers.map((l) => {
          const depth = parseFloat(l.getAttribute("data-depth") || "0");
          return {
            depth,
            fn: gsap.quickTo(l, "x", { duration: 0.5, ease: "power2.out" }),
          };
        });
        const settersY: Setter[] = layers.map((l) => {
          const depth = parseFloat(l.getAttribute("data-depth") || "0");
          return {
            depth,
            fn: gsap.quickTo(l, "y", { duration: 0.5, ease: "power2.out" }),
          };
        });

        const onMove = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
          const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
          setters.forEach((s, i) => {
            s.fn(nx * 12 * s.depth);
            settersY[i].fn(ny * 12 * s.depth);
          });
        };
        const onLeave = () => {
          setters.forEach((s) => s.fn(0));
          settersY.forEach((s) => s.fn(0));
        };

        root.addEventListener("pointermove", onMove, { passive: true });
        root.addEventListener("pointerleave", onLeave, { passive: true });
        cleanups.push(() => {
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
        });
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return null;
}
