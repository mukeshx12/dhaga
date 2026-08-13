"use client";

import Link from "next/link";
import {
  ChevronRight,
  House,
  PackageCheck,
  Ruler,
  Scissors,
  Shirt,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type WheelService = {
  en: string;
  hi: string;
  query: string;
  icon: LucideIcon;
};

const wheelServices: WheelService[] = [
  { en: "Blouse Stitching", hi: "ब्लाउज़ सिलाई", query: "Blouse", icon: Shirt },
  { en: "Suit Stitching", hi: "सूट सिलाई", query: "Suit", icon: Sparkles },
  { en: "Alteration", hi: "अल्टरेशन", query: "Alteration", icon: Scissors },
  { en: "Home Measurement", hi: "घर पर माप", query: "Home", icon: House },
  { en: "Pickup & Delivery", hi: "पिकअप और डिलीवरी", query: "Pickup", icon: PackageCheck },
  { en: "Custom Tailoring", hi: "कस्टम सिलाई", query: "Custom", icon: Ruler },
];

const sectionAngle = 360 / wheelServices.length;

export default function AnimatedServicesWheel() {
  const { language } = useLanguage();
  const hi = language === "hi";
  const timerRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spinDuration, setSpinDuration] = useState(3600);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const exploreServices = () => {
    if (spinning) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nextIndex = (selectedIndex + 1 + Math.floor(Math.random() * (wheelServices.length - 1))) % wheelServices.length;
    const currentAngle = ((rotation % 360) + 360) % 360;
    const destinationAngle = (360 - nextIndex * sectionAngle) % 360;
    const alignment = (destinationAngle - currentAngle + 360) % 360;
    const duration = reducedMotion ? 0 : 3600;

    setSpinDuration(duration);
    setSpinning(true);
    setRotation((current) => current + alignment + (reducedMotion ? 0 : 360 * 4));

    timerRef.current = window.setTimeout(() => {
      setSelectedIndex(nextIndex);
      setSpinning(false);
    }, reducedMotion ? 20 : duration);
  };

  const selectedService = wheelServices[selectedIndex];

  return (
    <div className="services-wheel-stage" aria-label={hi ? "धागा सेवाओं का इंटरैक्टिव चयन" : "Interactive Dhaga services selector"}>
      <div className="services-wheel-glow" aria-hidden="true" />
      <span className="services-wheel-thread services-wheel-thread-one" aria-hidden="true" />
      <span className="services-wheel-thread services-wheel-thread-two" aria-hidden="true" />
      <span className="services-wheel-button services-wheel-button-one" aria-hidden="true" />
      <span className="services-wheel-button services-wheel-button-two" aria-hidden="true" />

      <div className="services-wheel-frame">
        <div className="services-wheel-marker" aria-hidden="true">
          <span />
        </div>

        <div
          className="services-wheel-orbit"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: `${spinDuration}ms`,
          }}
        >
          {wheelServices.map((service, index) => {
            const Icon = service.icon;
            const angle = index * sectionAngle;
            const selected = !spinning && index === selectedIndex;

            return (
              <div
                key={service.en}
                className="services-wheel-position"
                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--wheel-radius) * -1))` }}
              >
                <div
                  className={`services-wheel-service ${selected ? "is-selected" : ""}`}
                  style={{
                    transform: `rotate(${-angle - rotation}deg)`,
                    transitionDuration: `${spinDuration}ms`,
                  }}
                >
                  <span className="services-wheel-icon"><Icon aria-hidden="true" size={22} strokeWidth={1.8} /></span>
                  <span>{hi ? service.hi : service.en}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`services-wheel-result ${spinning ? "is-spinning" : ""}`} aria-live="polite">
          <span className="services-wheel-result-kicker">
            {spinning ? (hi ? "सेवा चुनी जा रही है" : "Finding your service") : (hi ? "आपके लिए चुना गया" : "Selected for you")}
          </span>
          <strong>{spinning ? "•••" : (hi ? selectedService.hi : selectedService.en)}</strong>
          {!spinning && (
            <Link href={`/tailors?service=${encodeURIComponent(selectedService.query)}`}>
              {hi ? "दर्जी खोजें" : "Find tailors"} <ChevronRight aria-hidden="true" size={14} />
            </Link>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={exploreServices}
        disabled={spinning}
        className="services-wheel-cta"
      >
        <Sparkles aria-hidden="true" size={18} />
        {spinning ? (hi ? "सेवाएं देखी जा रही हैं…" : "Exploring services…") : (hi ? "सेवाएं एक्सप्लोर करें" : "Explore Services")}
      </button>
      <p className="services-wheel-hint">
        {hi ? "अपनी अगली सिलाई सेवा खोजने के लिए दबाएं" : "Press to discover your next tailoring service"}
      </p>
    </div>
  );
}
