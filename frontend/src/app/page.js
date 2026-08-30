"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleScanAgreement = () => {
    if (user) {
      router.push("/scan");
    } else {
      router.push("/onboarding");
    }
  };

  return (
    <div className="about-page">
      <div className="container">
        <div className="about-hero">
          <div className="about-label">HOME</div>
          <h1>How Agreement Risk Scanner Works</h1>
          <p>
            Agreement Risk Scanner helps people quickly understand potentially
            risky clauses in Terms of Service and similar agreements, so they
            know what deserves a closer review.
          </p>
        </div>

        <div className="about-section">
          <h2>How It Works</h2>
          <p className="section-sub">
            A transparent path from text to review priorities.
          </p>
          <div className="about-steps">
            <div className="about-step">
              <span className="step-num">01</span>
              <h3>Extract</h3>
              <p>
                Your agreement is divided into individual clauses for analysis.
              </p>
            </div>
            <div className="about-step">
              <span className="step-num">02</span>
              <h3>Analyze</h3>
              <p>
                The model evaluates each clause for contractual risk patterns.
              </p>
            </div>
            <div className="about-step">
              <span className="step-num">03</span>
              <h3>Prioritize</h3>
              <p>
                Potentially important findings are assigned review priorities.
              </p>
            </div>
            <div className="about-step">
              <span className="step-num">04</span>
              <h3>Understand</h3>
              <p>
                Plain-English explanations help you understand why a clause was
                flagged.
              </p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>What you get</h2>
          <p className="section-sub">
            A clear, focused summary of what needs your attention.
          </p>
          <div className="about-features">
            <div className="about-feature">
              <div className="feature-icon">⚡</div>
              <h3>Instant Analysis</h3>
              <p>Get results in seconds.</p>
            </div>
            <div className="about-feature">
              <div className="feature-icon">🔍</div>
              <h3>5 Risk Categories</h3>
              <p>Find what matters.</p>
            </div>
            <div className="about-feature">
              <div className="feature-icon">💡</div>
              <h3>Plain English</h3>
              <p>Understand quickly.</p>
            </div>
          </div>
        </div>

        <div className="about-important">
          <h3>Important to know</h3>
          <p>
            The tool&apos;s outputs are informational only. They identify
            clauses for further review and are not a substitute for professional
            legal advice.
          </p>
        </div>

        <div className="about-section about-faq">
          <h2>Frequently asked questions</h2>
          <p className="section-sub">
            A few answers about using Agreement Risk Scanner.
          </p>
          <details>
            <summary>Is my data stored?</summary>
            <p>
              Your scans are saved to your private history. You can delete them
              anytime.
            </p>
          </details>
          <details>
            <summary>What file types are supported?</summary>
            <p>
              You can paste text directly or upload .txt files. More formats
              coming soon.
            </p>
          </details>
          <details>
            <summary>How does the scanner work?</summary>
            <p>
              The tool reads your agreement and highlights specific clauses that
              might be risky or unfair, so you know exactly what to look at.
            </p>
          </details>
          <details>
            <summary>Is this legal advice?</summary>
            <p>
              No. It&apos;s a review tool to help you understand potential
              issues, not a substitute for a lawyer.
            </p>
          </details>
        </div>

        <div className="about-cta">
          <div className="about-cta-inner">
            <p>Ready to take a closer look at an agreement?</p>
            <button
              className="btn btn-primary about-cta-button"
              onClick={handleScanAgreement}
            >
              Scan Agreement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
