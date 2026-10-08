import { useEffect, useRef } from "react";

// Vanta.js FOG drift behind the home hero. Soft wash base with a
// pine-tinted highlight, slow and calm. Loads only in the browser,
// stays static under reduced motion or without JS (dot grid CSS
// behind remains the fallback).
//
// Performance notes: the blur pass is the expensive part, so it is
// kept low, mobile renders at reduced scale, and init waits for an
// idle moment so first paint never competes with WebGL startup.
export default function VantaHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let effect: { destroy: () => void } | undefined;
    let live = true;
    let idleId = 0;
    let timerId = 0;
    const start = async () => {
      const THREE = await import("three");
      const FOG = (await import("vanta/dist/vanta.fog.min.js")).default;
      if (!live) return;
      effect = FOG({
        el,
        THREE,
        // FOG ignores the pointer, so mouse and touch tracking stay
        // off: they only add scroll and move listeners for zero effect.
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        // Render resolution is divided by scale. FOG's own defaults
        // (2 desktop, 4 mobile) keep the heavy layered-noise shader
        // cheap. The soft fog hides the lower resolution completely.
        scale: 2.0,
        scaleMobile: 4.0,
        highlightColor: 0x9dc3d5,
        midtoneColor: 0xc9dce7,
        lowlightColor: 0xedf2f6,
        baseColor: 0xfcfcf9,
        blurFactor: 0.3,
        speed: 0.5,
        zoom: 0.7,
      });
    };
    const requestIdle = (
      window as Window & {
        requestIdleCallback?: (cb: () => void) => number;
      }
    ).requestIdleCallback;
    if (requestIdle) {
      idleId = requestIdle(() => {
        void start();
      });
    } else {
      timerId = window.setTimeout(() => {
        void start();
      }, 350);
    }
    return () => {
      live = false;
      if ("cancelIdleCallback" in window && idleId) {
        window.cancelIdleCallback(idleId);
      }
      if (timerId) window.clearTimeout(timerId);
      effect?.destroy();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    />
  );
}
