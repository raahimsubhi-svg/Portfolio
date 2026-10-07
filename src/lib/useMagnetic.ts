import { useEffect, type RefObject } from "react";
import gsap from "gsap";

// A7: magnetic hover. The element leans toward the cursor (max
// ~10px), springs back on leave. Fine pointers only, reduced
// motion disabled, transform-only via gsap.quickTo.
export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  strength = 0.25
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    // Center is measured once per entry so the moving element
    // never chases its own shifted position.
    let cx = 0;
    let cy = 0;

    const onEnter = () => {
      gsap.set(el, { x: 0, y: 0 });
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    };
    const onMove = (e: PointerEvent) => {
      const dx = Math.max(-10, Math.min(10, (e.clientX - cx) * strength));
      const dy = Math.max(-8, Math.min(8, (e.clientY - cy) * strength));
      xTo(dx);
      yTo(dy);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, strength]);
}
