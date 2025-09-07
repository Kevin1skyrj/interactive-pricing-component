"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const PRICING_DATA = [
  { pageviews: "10K", price: 8 },
  { pageviews: "50K", price: 12 },
  { pageviews: "100K", price: 16 },
  { pageviews: "500K", price: 24 },
  { pageviews: "1M", price: 36 },
];

// Custom Slider Component
function PricingSlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const percent = useMemo(() => (value / 4) * 100, [value]);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onChange(Math.round(p * 4));
    },
    [onChange]
  );

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) setFromClientX(e.touches[0].clientX);
    };
    const handleMouseMove = (e: MouseEvent) => setFromClientX(e.clientX);
    const handleUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleUp);
    };
    const handleDown = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleUp);
      } else {
        document.addEventListener("touchmove", handleTouchMove, { passive: true });
        document.addEventListener("touchend", handleUp);
      }
    };
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("mousedown", (e) => handleDown(e));
    el.addEventListener("touchstart", (e) => handleDown(e), { passive: true });
    return () => {
      el?.removeEventListener("mousedown", (e) => handleDown(e as unknown as MouseEvent));
      el?.removeEventListener("touchstart", (e) => handleDown(e as unknown as TouchEvent));
      handleUp();
    };
  }, [setFromClientX]);

  return (
  <div className="relative w-full mb-8 md:mb-10 select-none">
      {/* Track */}
      <div
        ref={trackRef}
  className="relative h-2 rounded-full bg-[hsl(224,65%,95%)] cursor-pointer"
        onClick={(e) => setFromClientX((e as React.MouseEvent).clientX)}
      >
        {/* Fill */}
        <div
          className="h-2 rounded-full bg-[hsl(174,77%,80%)] transition-[width] duration-200"
          style={{ width: `${percent}%` }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full grid place-items-center shadow-[0_15px_30px_rgba(0,255,231,0.6)] bg-[hsl(174,86%,45%)] hover:bg-[hsl(174,86%,40%)] active:scale-95 transition-all"
          style={{ left: `${percent}%` }}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={value}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") onChange(Math.max(0, value - 1));
            if (e.key === "ArrowRight") onChange(Math.min(4, value + 1));
          }}
        >
          <Image src="/images/icon-slider.svg" alt="Slider" width={22} height={13} />
        </div>
      </div>
    </div>
  );
}

// Custom Toggle Component
function BillingToggle({ isYearly, onChange }: { isYearly: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
        isYearly ? "bg-[hsl(174,86%,45%)]" : "bg-[hsl(223,50%,87%)]"
      }`}
      aria-pressed={isYearly}
      aria-label="Toggle yearly billing"
    >
      <div
        className={`absolute top-1 size-3 bg-white rounded-full transition-transform duration-200 ${
          isYearly ? "translate-x-[24px]" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function Home() {
  const [sliderValue, setSliderValue] = useState(2); // Start at 100K pageviews
  const [isYearly, setIsYearly] = useState(false);

  const currentPricing = PRICING_DATA[sliderValue];
  const displayPrice = isYearly 
    ? (currentPricing.price * 0.75).toFixed(2) // 25% discount for yearly
    : currentPricing.price.toFixed(2);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern (responsive, exact look for mobile/desktop) */}
      <div
        className="absolute inset-x-0 top-0 bg-[url('/images/bg-pattern.svg')] bg-no-repeat bg-top bg-[length:140%_auto] h-[70vw] min-h-[320px] md:bg-[length:100%_auto] md:h-[31.2vw] md:min-h-[220px]"
        aria-hidden
      />

  {/* Pattern circles will be rendered inside the header to align center behind text */}

      {/* Main Content */}
  <div className="relative z-10 flex flex-col items-center pt-16 md:pt-24 pb-20 px-5 md:px-6">
        {/* Header */}
        <div className="relative text-center mb-12 md:mb-16 max-w-md">
          {/* Centered pattern circles behind the title (mobile + desktop) */}
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-4 md:-top-6 -z-10 w-36 h-36 md:w-36 md:h-36 lg:w-40 lg:h-40 opacity-60">
            <Image
              src="/images/pattern-circles.svg"
              alt=""
              aria-hidden
              width={146}
              height={145}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 
            className="text-[26px] md:text-[28px] lg:text-[32px] font-extrabold mb-2 md:mb-3 leading-tight text-[hsl(227,35%,25%)]"
          >
            Simple, traffic-based pricing
          </h1>
          <div 
            className="text-[13.5px] md:text-[15px] leading-relaxed text-[hsl(225,20%,60%)]"
          >
            <p>Sign-up for our 30-day trial.</p>
            <p>No credit card required.</p>
          </div>
        </div>

        {/* Pricing Card */}
  <div className="bg-white rounded-[14px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] w-full max-w-[560px] md:max-w-[700px] overflow-hidden">
          {/* Top Section with Pageviews, Slider, and Price */}
          <div className="px-6 md:px-10 lg:px-12 pt-8 md:pt-10 pb-8 md:pb-10">
            {/* Mobile Layout - Stacked */}
            <div className="block md:hidden">
              {/* Pageviews */}
              <div className="text-center mb-10">
                <span className="text-xs font-extrabold tracking-[0.2em] uppercase text-[hsl(225,20%,60%)]">
                  {currentPricing.pageviews} Pageviews
                </span>
              </div>
              
              {/* Slider */}
              <PricingSlider value={sliderValue} onChange={setSliderValue} />
              
              {/* Price */}
              <div className="text-center mb-10">
                <span className="text-[44px] leading-none font-extrabold text-[hsl(227,35%,25%)]">
                  ${displayPrice}
                </span>
                <span className="text-sm ml-2 text-[hsl(225,20%,60%)]">
                  / {isYearly ? "year" : "month"}
                </span>
              </div>
            </div>

            {/* Desktop Layout - Side by side */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-12 lg:mb-16">
                <span className="text-sm font-extrabold tracking-[0.2em] uppercase text-[hsl(225,20%,60%)]">
                  {currentPricing.pageviews} Pageviews
                </span>
                <div className="text-right">
                  <span className="text-4xl lg:text-5xl font-extrabold text-[hsl(227,35%,25%)]">
                    ${displayPrice}
                  </span>
                  <span className="text-sm ml-2 text-[hsl(225,20%,60%)]">
                    / {isYearly ? "year" : "month"}
                  </span>
                </div>
              </div>
              
              {/* Slider */}
              <PricingSlider value={sliderValue} onChange={setSliderValue} />
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center md:justify-end gap-3 text-xs md:text-sm">
              <span className="text-[hsl(225,20%,60%)]">Monthly Billing</span>
              <BillingToggle isYearly={isYearly} onChange={() => setIsYearly(!isYearly)} />
              <span className="text-[hsl(225,20%,60%)]">Yearly Billing</span>
              <span className="px-2 py-1 rounded-full text-xs font-extrabold ml-2 bg-[hsl(14,92%,95%)] text-[hsl(15,100%,70%)]">
                -25%
              </span>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-[hsl(224,65%,95%)]" />

          {/* Bottom Section with Features and CTA */}
          <div className="px-6 md:px-10 lg:px-12 py-8 md:py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Features */}
              <ul className="space-y-3 text-left">
                <li className="flex items-center text-xs md:text-sm text-[hsl(225,20%,60%)]">
                  <Image
                    src="/images/icon-check.svg"
                    alt="Check"
                    width={9}
                    height={8}
                    className="mr-4 flex-shrink-0"
                  />
                  Unlimited websites
                </li>
                <li className="flex items-center text-xs md:text-sm text-[hsl(225,20%,60%)]">
                  <Image
                    src="/images/icon-check.svg"
                    alt="Check"
                    width={9}
                    height={8}
                    className="mr-4 flex-shrink-0"
                  />
                  100% data ownership
                </li>
                <li className="flex items-center text-xs md:text-sm text-[hsl(225,20%,60%)]">
                  <Image
                    src="/images/icon-check.svg"
                    alt="Check"
                    width={9}
                    height={8}
                    className="mr-4 flex-shrink-0"
                  />
                  Email reports
                </li>
              </ul>

              {/* CTA Button */}
              <button 
                className="w-[80%] md:w-auto px-8 md:px-12 py-4 md:py-3 rounded-full text-sm font-extrabold hover:opacity-90 transition-opacity duration-200 whitespace-nowrap bg-[hsl(227,35%,25%)] text-[hsl(226,100%,87%)] mx-auto md:mx-0"
              >
                Start my trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
