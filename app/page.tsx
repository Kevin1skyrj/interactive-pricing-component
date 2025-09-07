"use client";

import { useState } from "react";
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
  return (
    <div className="relative w-full h-2 mb-10">
      {/* Slider track */}
      <div className="absolute inset-0 rounded-full overflow-hidden" style={{ backgroundColor: 'hsl(224, 65%, 95%)' }}>
        {/* Progress fill */}
        <div 
          className="h-full rounded-full transition-all duration-200"
          style={{ 
            width: `${(value / 4) * 100}%`,
            backgroundColor: 'hsl(174, 77%, 80%)'
          }}
        />
      </div>
      
      {/* Slider thumb */}
      <div 
        className="absolute top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
        style={{ 
          left: `${(value / 4) * 100}%`,
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'hsl(174, 86%, 45%)',
          boxShadow: '0 15px 30px rgba(0, 255, 231, 0.6)'
        }}
        onMouseDown={(e) => {
          const slider = e.currentTarget.parentElement;
          if (!slider) return;
          
          const handleMouseMove = (event: MouseEvent) => {
            const rect = slider.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
            onChange(Math.round(percentage * 4));
          };
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        <Image
          src="/images/icon-slider.svg"
          alt="Slider"
          width={22}
          height={13}
          className="pointer-events-none"
        />
      </div>
      
      {/* Hidden input for accessibility */}
      <input
        type="range"
        min="0"
        max="4"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}

// Custom Toggle Component
function BillingToggle({ isYearly, onChange }: { isYearly: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative w-11 h-5 rounded-full transition-colors duration-200 focus:outline-none"
      style={{ backgroundColor: isYearly ? 'hsl(174, 86%, 45%)' : 'hsl(223, 50%, 87%)' }}
    >
      <div
        className="absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200"
        style={{
          transform: isYearly ? 'translateX(24px)' : 'translateX(4px)'
        }}
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
    <div 
      className="min-h-screen relative overflow-hidden font-manrope"
      style={{ backgroundColor: 'hsl(230, 100%, 99%)' }}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full">
        <Image
          src="/images/bg-pattern.svg"
          alt="Background pattern"
          width={1440}
          height={449}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* Pattern Circles - positioned in top right */}
      <div className="absolute top-12 right-12 w-36 h-36 opacity-50">
        <Image
          src="/images/pattern-circles.svg"
          alt="Pattern circles"
          width={146}
          height={145}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center pt-20 pb-20 px-6">
        {/* Header */}
        <div className="text-center mb-16 max-w-md">
          <h1 
            className="text-xl md:text-2xl font-extrabold mb-3 leading-tight"
            style={{ color: 'hsl(227, 35%, 25%)' }}
          >
            Simple, traffic-based pricing
          </h1>
          <div 
            className="text-sm leading-relaxed"
            style={{ color: 'hsl(225, 20%, 60%)' }}
          >
            <p>Sign-up for our 30-day trial.</p>
            <p>No credit card required.</p>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
          {/* Top Section with Pageviews, Slider, and Price */}
          <div className="px-6 md:px-12 pt-8 md:pt-12 pb-8">
            {/* Mobile Layout - Stacked */}
            <div className="block md:hidden">
              {/* Pageviews */}
              <div className="text-center mb-8">
                <span 
                  className="text-xs font-extrabold tracking-widest uppercase"
                  style={{ color: 'hsl(225, 20%, 60%)' }}
                >
                  {currentPricing.pageviews} Pageviews
                </span>
              </div>
              
              {/* Slider */}
              <PricingSlider value={sliderValue} onChange={setSliderValue} />
              
              {/* Price */}
              <div className="text-center mb-8">
                <span 
                  className="text-4xl font-extrabold"
                  style={{ color: 'hsl(227, 35%, 25%)' }}
                >
                  ${displayPrice}
                </span>
                <span 
                  className="text-sm ml-2"
                  style={{ color: 'hsl(225, 20%, 60%)' }}
                >
                  / {isYearly ? "year" : "month"}
                </span>
              </div>
            </div>

            {/* Desktop Layout - Side by side */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-12">
                <span 
                  className="text-sm font-extrabold tracking-widest uppercase"
                  style={{ color: 'hsl(225, 20%, 60%)' }}
                >
                  {currentPricing.pageviews} Pageviews
                </span>
                <div className="text-right">
                  <span 
                    className="text-4xl font-extrabold"
                    style={{ color: 'hsl(227, 35%, 25%)' }}
                  >
                    ${displayPrice}
                  </span>
                  <span 
                    className="text-sm ml-2"
                    style={{ color: 'hsl(225, 20%, 60%)' }}
                  >
                    / {isYearly ? "year" : "month"}
                  </span>
                </div>
              </div>
              
              {/* Slider */}
              <PricingSlider value={sliderValue} onChange={setSliderValue} />
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center md:justify-end gap-3 text-xs">
              <span style={{ color: 'hsl(225, 20%, 60%)' }}>Monthly Billing</span>
              <BillingToggle isYearly={isYearly} onChange={() => setIsYearly(!isYearly)} />
              <span style={{ color: 'hsl(225, 20%, 60%)' }}>Yearly Billing</span>
              <span 
                className="px-2 py-1 rounded-full text-xs font-extrabold ml-2"
                style={{ 
                  backgroundColor: 'hsl(14, 92%, 95%)', 
                  color: 'hsl(15, 100%, 70%)' 
                }}
              >
                25% discount
              </span>
            </div>
          </div>

          {/* Divider */}
          <hr style={{ borderColor: 'hsl(224, 65%, 95%)' }} />

          {/* Bottom Section with Features and CTA */}
          <div className="px-6 md:px-12 py-8 md:py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Features */}
              <ul className="space-y-3 text-center md:text-left">
                <li className="flex items-center justify-center md:justify-start text-xs" style={{ color: 'hsl(225, 20%, 60%)' }}>
                  <Image
                    src="/images/icon-check.svg"
                    alt="Check"
                    width={9}
                    height={8}
                    className="mr-4 flex-shrink-0"
                  />
                  Unlimited websites
                </li>
                <li className="flex items-center justify-center md:justify-start text-xs" style={{ color: 'hsl(225, 20%, 60%)' }}>
                  <Image
                    src="/images/icon-check.svg"
                    alt="Check"
                    width={9}
                    height={8}
                    className="mr-4 flex-shrink-0"
                  />
                  100% data ownership
                </li>
                <li className="flex items-center justify-center md:justify-start text-xs" style={{ color: 'hsl(225, 20%, 60%)' }}>
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
                className="px-12 py-3 rounded-full text-xs font-extrabold hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
                style={{ 
                  backgroundColor: 'hsl(227, 35%, 25%)', 
                  color: 'hsl(226, 100%, 87%)' 
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
