"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function StatsAnimator({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-stat-card]"));
    const values = Array.from(container.querySelectorAll<HTMLElement>("[data-stat-value]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frameIds: number[] = [];
    const timeoutIds: number[] = [];

    if (reduceMotion) {
      container.classList.add("is-visible");
      return;
    }

    container.classList.add("is-ready");
    values.forEach((element) => {
      element.textContent = "0";
    });

    const animateValue = (element: HTMLElement, index: number) => {
      const target = Number(element.dataset.statValue || 0);
      const formatter = new Intl.NumberFormat("en-IN");
      const duration = 1050;

      const timeoutId = window.setTimeout(() => {
        const startedAt = performance.now();

        const update = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = formatter.format(Math.round(target * eased));

          if (progress < 1) frameIds.push(window.requestAnimationFrame(update));
        };

        frameIds.push(window.requestAnimationFrame(update));
      }, 180 + index * 120);

      timeoutIds.push(timeoutId);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        container.classList.add("is-visible");
        cards.forEach((card, index) => {
          card.style.setProperty("--stat-delay", `${index * 110}ms`);
        });
        values.forEach(animateValue);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      timeoutIds.forEach(window.clearTimeout);
      frameIds.forEach(window.cancelAnimationFrame);
    };
  }, []);

  return (
    <div ref={containerRef} className="stats-animate relative">
      {children}
    </div>
  );
}
