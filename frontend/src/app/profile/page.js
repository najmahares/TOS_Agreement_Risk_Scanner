"use client";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const email = user?.email || "user@example.com";
  const displayName =
    email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);

  const handleLogout = () => {
    if (
      window.confirm("Are you sure you want to logout? This cannot be undone.")
    ) {
      logout();
      router.push("/");
    }
  };

  return (
    <ProtectedRoute>
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-icon">
            <svg
              width="40"
              height="40"
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
          </div>

          <h1>{displayName}</h1>
          <p className="profile-email">{email}</p>

          <div className="profile-divider"></div>

          <div className="profile-meta">
            <span>Member since</span>
            <strong>Today</strong>
          </div>

          <button className="profile-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
