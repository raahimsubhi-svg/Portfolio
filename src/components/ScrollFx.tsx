import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Site-wide scroll motion. Drives the existing data-animate
// attributes, gentle parallax on data-parallax bands, and draw-in
// on data-draw rules.
//
// Fail-visible by construction:
// - from-tweens use immediateRender: false, so nothing hides
//   before its trigger fires.
// - if a trigger never fires, the element simply stays as
//   rendered (visible). There is no stuck-hidden state.
export default function ScrollFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
        // Sibling position gives free stagger: cards in the same
        // row enter as a cascade instead of one block.
        const siblings = Array.from(el.parentElement?.children ?? []).filter(
          (sib): sib is HTMLElement =>
            sib instanceof HTMLElement && sib.hasAttribute("data-animate")
        );
        const cascade = (siblings.indexOf(el) % 4) * 0.07;
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          delay: cascade,
          ease: "power3.out",
          clearProps: "all",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
      });

      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28 },
          {
            y: -28,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });

      document.querySelectorAll<HTMLElement>("[data-draw]").forEach((el) => {
        // Same sibling cascade as data-animate so multi-line
        // groups (e.g. contact bubble typing lines) draw in
        // sequence instead of all at once.
        const siblings = Array.from(el.parentElement?.children ?? []).filter(
          (sib) => sib instanceof Element && sib.hasAttribute("data-draw")
        );
        const cascade = (siblings.indexOf(el) % 4) * 0.07;
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          delay: cascade,
          ease: "power3.out",
          clearProps: "transform",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
      });
    });

    // No timeout rescue needed: with immediateRender: false,
// a trigger that never fires leaves its element exactly as
// rendered (visible). There is no stuck-hidden state.
    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
