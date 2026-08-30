"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../../../components/ProtectedRoute";
import FindingCard from "../../../components/FindingCard";
import { getScan } from "../../../lib/scans";

const formatTitle = (str) => {
  if (!str) return "Agreement Analysis";

  const cleaned = str
    .replace(/[_-]+/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );

  const words = cleaned.split(" ");
  if (words.length > 6) {
    return `${words.slice(0, 6).join(" ")}...`;
  }
  return cleaned;
};

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const scanId = params?.scanId;

  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    async function loadScan() {
      if (!scanId) return;
      try {
        setLoading(true);
        setError("");
        const data = await getScan(scanId);
        setScan(data);
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Unable to load this scan.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadScan();
  }, [scanId]);

  const findings = scan?.findings || [];
  const stats = scan?.stats || {};

  const filteredFindings = useMemo(() => {
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, REVIEW: 3, FAIR: 4 };

    return findings
      .filter((finding) => {
        if (!finding.is_flagged) return false;
        if (priorityFilter === "ALL") return true;
        return finding.priority?.toUpperCase() === priorityFilter;
      })
      .sort((a, b) => {
        const aP = priorityOrder[a.priority?.toUpperCase()] ?? 9;
        const bP = priorityOrder[b.priority?.toUpperCase()] ?? 9;
        return aP - bP;
      });
  }, [findings, priorityFilter]);

  const highCount = stats.high_priority || 0;
  const mediumCount = stats.medium_priority || 0;
  const flaggedCount = stats.flagged_count || 0;
  const totalClauses = stats.total_clauses || 0;
  const flaggedPercentage = Number(stats.flagged_percentage || 0);

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="results-page">
          <div className="results-loading">
            <div className="loading-spinner" />
            <p>Loading agreement analysis...</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <main className="results-page">
          <div className="results-error">
            <span className="results-error-icon">!</span>
            <h1>Unable to load analysis</h1>
            <p>{error}</p>
            <button
              type="button"
              className="results-secondary-button"
              onClick={() => router.push("/history")}
            >
              Back to history
            </button>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (!scan) {
    return (
      <ProtectedRoute>
        <main className="results-page">
          <div className="results-error">
            <span className="results-error-icon">!</span>
            <h1>Analysis not found</h1>
            <p>The agreement analysis could not be found.</p>
            <button
              type="button"
              className="results-secondary-button"
              onClick={() => router.push("/history")}
            >
              Back to history
            </button>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="results-page">
        <div className="results-container">
          <section className="results-heading">
            <div>
              <span className="results-eyebrow">Agreement review</span>
              <h1>{formatTitle(scan?.title)}</h1>
              <p>
                {totalClauses} clauses analyzed. Review the clauses that may
                deserve closer attention.
              </p>
            </div>
          </section>

          <section className="results-stats">
            <div className="results-stat-card">
              <span className="results-stat-label">Clauses analyzed</span>
              <strong>{totalClauses}</strong>
              <span className="results-stat-description">
                Total clauses reviewed
              </span>
            </div>

            <div className="results-stat-card flagged-stat">
              <span className="results-stat-label">Flagged</span>
              <strong>{flaggedCount}</strong>
              <span className="results-stat-description">
                {stats.flagged_percentage || 0}% of clauses
              </span>
            </div>

            <div className="results-stat-card priority-stat high-stat">
              <span className="results-stat-label">High priority</span>
              <strong>{highCount}</strong>
              <span className="results-stat-description">
                Requires closer review
              </span>
            </div>

            <div className="results-stat-card priority-stat medium-stat">
              <span className="results-stat-label">Medium priority</span>
              <strong>{mediumCount}</strong>
              <span className="results-stat-description">Worth reviewing</span>
            </div>
          </section>

          <section className="priority-highlight">
            <div className="priority-highlight-copy">
              <span className="priority-highlight-label">Review priority</span>
              <h2>Start with the highest-priority findings.</h2>
              <p>
                These clauses were identified as the most important patterns for
                closer review.
              </p>
            </div>

            <div className="priority-highlight-values">
              <div className="priority-highlight-item high">
                <span>High</span>
                <strong>{highCount}</strong>
              </div>

              <div className="priority-highlight-divider" />

              <div className="priority-highlight-item medium">
                <span>Medium</span>
                <strong>{mediumCount}</strong>
              </div>
            </div>
          </section>

          <section className="results-main-grid">
            <div className="results-main-column">
              <div className="results-section-header">
                <div>
                  <span className="results-section-eyebrow">Findings</span>
                  <h2>Clauses requiring review</h2>
                </div>

                <div className="finding-filter">
                  <label htmlFor="priority-filter">Priority</label>

                  <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(event) => setPriorityFilter(event.target.value)}
                  >
                    <option value="ALL">All priorities</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="REVIEW">Fair / Review</option>
                  </select>
                </div>
              </div>

              <div className="findings-summary">
                <span>{filteredFindings.length} findings</span>
                <span>{highCount} high</span>
                <span>{mediumCount} medium</span>
              </div>

              <div className="findings-list">
                {filteredFindings.length > 0 ? (
                  filteredFindings.map((finding) => (
                    <FindingCard key={finding.id} finding={finding} />
                  ))
                ) : (
                  <div className="no-findings">
                    <div className="no-findings-icon">✓</div>
                    <h3>No findings in this category</h3>
                    <p>
                      Try selecting another priority to see more review items.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="results-sidebar-clean">
              <div className="sidebar-card risk-overview-card">
                <div className="sidebar-card-header">
                  <span className="results-section-eyebrow">Overview</span>
                  <h2>Agreement risk overview</h2>
                  <p>How much of this agreement needs attention.</p>
                </div>

                <div className="risk-ring-wrapper">
                  <div
                    className="risk-ring"
                    style={{
                      "--risk-percent": `${Math.min(flaggedPercentage, 100)}%`,
                    }}
                  >
                    <div className="risk-ring-inner">
                      <strong>{stats.flagged_percentage || 0}%</strong>
                      <span>flagged</span>
                    </div>
                  </div>
                </div>

                <div className="risk-overview-text">
                  <strong>
                    {Math.max(totalClauses - flaggedCount, 0)} clauses not
                    flagged
                  </strong>

                  <span>
                    These clauses did not match the selected risk patterns.
                  </span>
                </div>
              </div>

              <div className="sidebar-card methodology-card">
                <div className="sidebar-card-header">
                  <span className="results-section-eyebrow">Methodology</span>
                  <h2>About this analysis</h2>
                </div>

                <div className="methodology-list">
                  <div className="methodology-row">
                    <span>Powered by</span>
                    <strong>Advanced AI</strong>
                  </div>

                  <div className="methodology-row">
                    <span>Goal</span>
                    <strong>Simple explanations</strong>
                  </div>

                  <div className="methodology-row">
                    <span>Focus</span>
                    <strong>5 common risk patterns</strong>
                  </div>
                </div>

                <div className="methodology-disclaimer">
                  Our AI scans agreements to identify clauses for your review.
                  It is designed to support you, not replace a professional
                  legal advisor.
                </div>
              </div>
            </div>
          </section>

          <section
            className="results-cta"
            style={{
              marginTop: "var(--space-20)",
              padding: "var(--space-16) 0",
              borderTop: "1px solid var(--color-border)",
              textAlign: "center",
            }}
          >
            <div
              className="results-cta-content"
              style={{
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <h2
                style={{
                  fontSize: "var(--text-3xl)",
                  color: "var(--color-primary-dark)",
                  marginBottom: "var(--space-4)",
                }}
              >
                Ready to analyze another agreement?
              </h2>
              <p
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--color-text-secondary)",
                  marginBottom: "var(--space-8)",
                }}
              >
                Don&apos;t let hidden risks slip through.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href="/history"
                  className="results-cta-button"
                  style={{
                    display: "inline-block",
                    backgroundColor: "transparent",
                    color: "var(--color-primary)",
                    padding: "16px 32px",
                    borderRadius: "50px",
                    fontSize: "18px",
                    fontWeight: "600",
                    textDecoration: "none",
                    border: "2px solid var(--color-primary)",
                  }}
                >
                  Save &amp; View History
                </Link>

                <Link
                  href="/scan"
                  className="results-cta-button"
                  style={{
                    display: "inline-block",
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    padding: "16px 32px",
                    borderRadius: "50px",
                    fontSize: "18px",
                    fontWeight: "600",
                    textDecoration: "none",
                    boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
                  }}
                >
                  Scan another agreement
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
