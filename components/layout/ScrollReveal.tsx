"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global fade-up-on-scroll, mirroring the static site's `data-reveal`
 * IntersectionObserver. Mounted once in the marketing layout, it targets every
 * <section> inside <main>. Sections already in the viewport on load stay
 * visible (no flash); sections below the fold start hidden and fade in on
 * scroll. Re-runs on route change.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section")
    );
    if (sections.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      sections.forEach((s) => s.classList.add("reveal-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    sections.forEach((section) => {
      section.setAttribute("data-reveal", "");
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        // Already on screen — keep it visible, don't animate/flash.
        section.classList.add("reveal-visible");
      } else {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
