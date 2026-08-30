"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { getScan } from "../../../lib/scans";

export default function AnalysisPage() {
  return (
    <ProtectedRoute>
      <AnalysisWorkspace />
    </ProtectedRoute>
  );
}

function AnalysisWorkspace() {
  const params = useParams();
  const router = useRouter();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadScan() {
      try {
        const data = await getScan(params.id);
        setScan(data);
      } catch (error) {
        setError(error.response?.data?.detail || "Unable to load scan.");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      loadScan();
    }
  }, [params.id]);

  if (loading) {
    return <Loading message="Loading analysis..." />;
  }
  if (error) {
    return (
      <div className="container" style={{ padding: "var(--space-12) 0" }}>
        <ErrorMessage message={error} />
        <button
          onClick={() => router.push("/scan")}
          className="btn btn-primary"
          style={{ marginTop: "var(--space-4)" }}
        >
          New Scan
        </button>
      </div>
    );
  }
  if (!scan) return null;

  return (
    <div className="results-page">
      <div className="container">
        <div className="results-header">
          <div className="results-header-left">
            <h1>{scan.title}</h1>
            <span className="status-badge">✓ {scan.status}</span>
          </div>
          <Link href="/scan" className="btn btn-primary">
            + New Scan
          </Link>
        </div>

        <div className="results-stats">
          <div className="stat-card">
            <div className="stat-label">CLAUSES ANALYZED</div>
            <div className="stat-value">{scan.stats.total_clauses}</div>
          </div>
          <div className="stat-card highlight-danger">
            <div className="stat-label">FLAGGED</div>
            <div className="stat-value">{scan.stats.flagged_count}</div>
          </div>
          <div className="stat-card highlight-danger">
            <div className="stat-label">HIGH PRIORITY</div>
            <div className="stat-value">{scan.stats.high_priority}</div>
          </div>
          <div className="stat-card highlight-warning">
            <div className="stat-label">MEDIUM PRIORITY</div>
            <div className="stat-value">{scan.stats.medium_priority}</div>
          </div>
        </div>

        <section>
          <h2>Findings</h2>
          {scan.findings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </section>
      </div>
    </div>
  );
}
