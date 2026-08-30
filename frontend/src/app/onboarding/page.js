"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    title: "Decode the fine print",
    subtitle: "Understand what you're agreeing to in Terms of Services.",
    features: ["Simple Language", "Instant Analysis", "Visual Reports"],
    color: "slide-orange",
    shape: "shape-doc",
  },
  {
    title: "Find hidden risks instantly",
    subtitle: "Visualize the danger zones without reading long documents.",
    features: ["5 Risk Categories", "High Priority Flags", "Smart Filtering"],
    color: "slide-teal",
    shape: "shape-shield",
  },
  {
    title: "Review smarter, not harder",
    subtitle: "Your safety net for ToS. We're here for you!",
    features: ["Save Scans", "Track History", "Expert Guidance"],
    color: "slide-purple",
    shape: "shape-search",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const slide = slides[currentStep];
  const isLast = currentStep === slides.length - 1;

  useEffect(() => {
    if (isLast) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentStep, isLast]);

  const nextSlide = () => {
    if (isLast) return;
    setCurrentStep((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentStep === 0) return;
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div key={currentStep} className={`onboarding-container ${slide.color}`}>
      <div className="onboarding-arc onboarding-arc-one"></div>
      <div className="onboarding-arc onboarding-arc-two"></div>

      <div className="onboarding-center-group">
        <div className="onboarding-shape">
          {slide.shape === "shape-doc" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          )}
          {slide.shape === "shape-shield" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          )}
          {slide.shape === "shape-search" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </div>

        <div className="onboarding-text">
          <h1>{slide.title}</h1>
          <p>{slide.subtitle}</p>
          <div className="feature-list">
            {slide.features.map((feature, index) => (
              <span className="feature-pill" key={index}>
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="onboarding-controls">
        {currentStep > 0 ? (
          <button className="onboarding-nav-btn" onClick={prevSlide}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>{" "}
            Back
          </button>
        ) : (
          <span className="onboarding-control-spacer"></span>
        )}

        <div className="onboarding-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`onboarding-dot ${currentStep === index ? "active" : ""}`}
              onClick={() => setCurrentStep(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {!isLast ? (
          <button className="onboarding-nav-btn" onClick={nextSlide}>
            Next{" "}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ) : (
          <Link href="/signup" className="onboarding-nav-btn">
            Get Started{" "}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
