"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import { getScans, deleteScan } from "../../lib/scans";

const formatTitle = (str) => {
  if (!str) return "Untitled Agreement";

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

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        setError("");
        const data = await getScans();
        setScans(data?.items || []);
      } catch (err) {
        setError(err?.message || "Unable to load scan history.");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const filteredScans = scans.filter((scan) =>
    scan.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getReviewLevel = (scan) => {
    if (scan.stats.high_priority > 0) return "high";
    if (scan.stats.medium_priority > 0) return "medium";
    return "low";
  };

  const handleDelete = async (scanId) => {
    if (window.confirm("Are you sure you want to delete this scan?")) {
      try {
        await deleteScan(scanId);
        setScans((prev) => prev.filter((s) => s.scan_id !== scanId));
      } catch (err) {
        alert(err.message);
      }
    }
    setOpenMenuId(null);
  };

  return (
    <ProtectedRoute>
      <div className="history-page">
        <div className="container">
          <div className="history-header">
            <div className="history-header-left">
              <div className="history-label">REVIEW ARCHIVE</div>
              <h1>Scan History</h1>
              <p>
                {scans.length} agreements analyzed · Review previous findings
                and reports.
              </p>
            </div>
            <Link href="/scan" className="btn btn-primary">
              + New Scan
            </Link>
          </div>

          <div
            className="history-filters"
            style={{ justifyContent: "flex-start" }}
          >
            <input
              type="text"
              placeholder="🔍 Search agreements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
          </div>

          {loading && <Loading message="Loading history..." />}
          {!loading && error && <ErrorMessage message={error} />}
          {!loading && !error && scans.length === 0 && (
            <EmptyState
              title="No agreements analyzed yet"
              message="Start by scanning an agreement."
              action={
                <Link href="/scan" className="btn btn-primary">
                  Scan an Agreement
                </Link>
              }
            />
          )}

          {!loading && !error && filteredScans.length === 0 && searchTerm && (
            <div className="no-findings" style={{ marginTop: "20px" }}>
              <p>No agreements found matching "{searchTerm}".</p>
            </div>
          )}

          {!loading && !error && filteredScans.length > 0 && (
            <>
              <div className="history-list-header">
                <h2>Recent agreements</h2>
                <span>Showing {filteredScans.length} scans</span>
              </div>
              {filteredScans.map((scan) => {
                const level = getReviewLevel(scan);
                return (
                  <div className="history-item" key={scan.scan_id}>
                    <div className="history-item-left">
                      <div className="item-title">
                        {formatTitle(scan.title)}
                        <span className={`review-badge ${level}`}>
                          {level} review
                        </span>
                      </div>
                    </div>
                    <div className="history-item-right">
                      <Link
                        href={`/results/${encodeURIComponent(scan.scan_id)}`}
                        className="btn btn-primary btn-sm"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ marginRight: "6px" }}
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        View Full Report
                      </Link>

                      <div className="menu-wrapper">
                        <button
                          aria-label="More"
                          className="menu-trigger"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === scan.scan_id ? null : scan.scan_id,
                            )
                          }
                        >
                          ⋮
                        </button>
                        {openMenuId === scan.scan_id && (
                          <div className="dropdown-menu">
                            <button
                              onClick={() => handleDelete(scan.scan_id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
