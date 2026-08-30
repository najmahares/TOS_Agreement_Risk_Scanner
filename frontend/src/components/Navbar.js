"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path) => pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          <div className="navbar-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <line x1="7" y1="12" x2="17" y2="12" />
            </svg>
          </div>
          <div className="navbar-title-group">
            <span className="navbar-title">Agreement Risk Scanner</span>
            <span className="navbar-subtitle">
              Understand what you're agreeing to.
            </span>
          </div>
        </Link>

        <nav className="navbar-links">
          {!user ? (
            <>
              <Link
                href="/"
                className={`navbar-link ${isActive("/") ? "active" : ""}`}
              >
                Home
              </Link>
              <Link
                href="/signup"
                className={`navbar-link ${isActive("/signup") ? "active" : ""}`}
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/scan"
                className={`navbar-link ${isActive("/scan") ? "active" : ""}`}
              >
                Scan Agreement
              </Link>
              <Link
                href="/history"
                className={`navbar-link ${isActive("/history") ? "active" : ""}`}
              >
                History
              </Link>

              <Link
                href="/profile"
                className={`navbar-user-icon ${isActive("/profile") ? "active" : ""}`}
                aria-label="Profile"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
