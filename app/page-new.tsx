"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import ThemeToggle from "./components/theme-toggle";

const PRICING_DATA = [
  { pageviews: "10K", price: 8 },
  { pageviews: "50K", price: 12 },
  { pageviews: "100K", price: 16 },
  { pageviews: "500K", price: 24 },
  { pageviews: "1M", price: 36 },
];

// Custom Slider Component with CSS variables
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

  return (
    <div className="relative w-full mb-8 md:mb-10 select-none">
      <div
        ref={trackRef}
        className="relative h-2 rounded-full cursor-pointer"
        style={{ backgroundColor: 'var(--border-color)' }}
        onClick={(e) => setFromClientX((e as React.MouseEvent).clientX)}
      >
        <div
          className="h-2 rounded-full transition-all duration-200"
          style={{ 
            width: `${percent}%`,
            backgroundColor: 'var(--accent-color)'
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full grid place-items-center shadow-lg cursor-grab active:cursor-grabbing transition-all"
          style={{ 
            left: `${percent}%`,
            backgroundColor: 'var(--accent-color)',
            transform: `translateX(-50%) translateY(-50%)`,
          }}
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
      className="relative w-11 h-5 rounded-full transition-colors duration-200 focus:outline-none"
      style={{
        backgroundColor: isYearly ? 'var(--accent-color)' : 'var(--border-color)'
      }}
      aria-pressed={isYearly}
      aria-label="Toggle yearly billing"
    >
      <div
        className="absolute top-1 size-3 bg-white rounded-full transition-transform duration-200"
        style={{
          transform: isYearly ? 'translateX(24px)' : 'translateX(4px)'
        }}
      />
    </button>
  );
}

export default function Home() {
  const [sliderValue, setSliderValue] = useState(2);
  const [isYearly, setIsYearly] = useState(false);

  const currentPricing = PRICING_DATA[sliderValue];
  const displayPrice = isYearly 
    ? (currentPricing.price * 0.75).toFixed(2)
    : currentPricing.price.toFixed(2);

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      <ThemeToggle />
      
      {/* Background Pattern */}
      <div
        className="absolute inset-x-0 top-0 bg-[url('/images/bg-pattern.svg')] bg-no-repeat bg-[position:10%_0] bg-[length:280%_auto] h-[250px] md:bg-[position:center_0] md:bg-[length:100%_auto] md:h-[31.2vw] md:min-h-[220px]"
        style={{ opacity: 0.4 }}
        aria-hidden
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center pt-16 md:pt-24 pb-20 px-5 md:px-6">
        {/* Header */}
        <div className="relative text-center mb-12 md:mb-16 max-w-md">
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-4 md:-top-6 -z-10 w-36 h-36 opacity-60">
            <Image
              src="/images/pattern-circles.svg"
              alt=""
              width={146}
              height={145}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="text-[26px] md:text-[28px] lg:text-[32px] font-extrabold mb-2 md:mb-3 leading-tight">
            Simple, traffic-based pricing
          </h1>
          <div className="text-[13.5px] md:text-[15px] leading-relaxed" style={{ opacity: 0.7 }}>
            <p>Sign-up for our 30-day trial.</p>
            <p>No credit card required.</p>
          </div>
        </div>

        {/* Pricing Card */}
        <div 
          className="rounded-[14px] shadow-lg w-full max-w-[560px] md:max-w-[700px] overflow-hidden"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          {/* Top Section */}
          <div className="px-6 md:px-10 lg:px-12 pt-8 md:pt-10 pb-8 md:pb-10">
            {/* Mobile Layout */}
            <div className="block md:hidden">
              <div className="text-center mb-10">
                <span className="text-xs font-extrabold tracking-[0.2em] uppercase" style={{ opacity: 0.7 }}>
                  {currentPricing.pageviews} Pageviews
                </span>
              </div>
              <PricingSlider value={sliderValue} onChange={setSliderValue} />
              <div className="text-center mb-8">
                <span className="text-[32px] md:text-[40px] font-extrabold">${displayPrice}</span>
                <span className="text-sm" style={{ opacity: 0.7 }}> / month</span>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex md:items-center md:justify-between mb-10">
              <span className="text-sm font-extrabold tracking-[0.15em] uppercase" style={{ opacity: 0.7 }}>
                {currentPricing.pageviews} Pageviews
              </span>
              <div className="text-right">
                <span className="text-[32px] md:text-[40px] font-extrabold">${displayPrice}</span>
                <span className="text-sm" style={{ opacity: 0.7 }}> / month</span>
              </div>
            </div>

            <div className="hidden md:block mb-10">
              <PricingSlider value={sliderValue} onChange={setSliderValue} />
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <span className="text-xs" style={{ opacity: 0.7 }}>Monthly Billing</span>
              <BillingToggle isYearly={isYearly} onChange={() => setIsYearly(!isYearly)} />
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ opacity: 0.7 }}>Yearly Billing</span>
                <span className="px-2 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-600">
                  -25%
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr style={{ borderColor: 'var(--border-color)' }} />

          {/* Bottom Section */}
          <div className="px-6 md:px-10 lg:px-12 py-8 md:py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Features */}
              <ul className="space-y-3 text-left">
                <li className="flex items-center text-xs md:text-sm" style={{ opacity: 0.7 }}>
                  <Image
                    src="/images/icon-check.svg"
                    alt="Check"
                    width={9}
                    height={8}
                    className="mr-4 flex-shrink-0"
                  />
                  Unlimited websites
                </li>
                <li className="flex items-center text-xs md:text-sm" style={{ opacity: 0.7 }}>
                  <Image
                    src="/images/icon-check.svg"
                    alt="Check"
                    width={9}
                    height={8}
                    className="mr-4 flex-shrink-0"
                  />
                  100% data ownership
                </li>
                <li className="flex items-center text-xs md:text-sm" style={{ opacity: 0.7 }}>
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
                className="w-[80%] md:w-auto px-8 md:px-12 py-4 md:py-3 rounded-full text-sm font-extrabold hover:opacity-90 transition-opacity duration-200 whitespace-nowrap mx-auto md:mx-0"
                style={{
                  backgroundColor: 'var(--text-color)',
                  color: 'var(--bg-color)'
                }}
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
