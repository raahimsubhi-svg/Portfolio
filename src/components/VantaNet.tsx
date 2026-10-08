import { useEffect, useRef } from "react";

// Vanta.js NET behind the services and work heroes: a sparse network
// of drifting nodes and connecting lines. Deliberately different from
// the home hero's fog — structural and crisp instead of soft and misty.
//
// Same fail-visible contract as VantaHero: reduced motion or no JS
// simply leaves the hero's CSS wash + dot-grid visible. Pointer and
// gyro controls stay off (they only add listeners for no effect on
// NET), and init waits for an idle moment so first paint never
// competes with WebGL startup.
export default function VantaNet() {
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
      const NET = (await import("vanta/dist/vanta.net.min.js")).default;
      if (!live) return;
      effect = NET({
        el,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        backgroundColor: 0xfcfcf9,
        color: 0x1584ab,
        points: 11,
        maxDistance: 20,
        spacing: 24,
        showDots: true,
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
