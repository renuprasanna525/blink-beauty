
import { useState } from "react";
import { API_URL } from "./api";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        throw new Error(data.message || "Unable to sign in.");
      }

      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("adminUser", JSON.stringify(data.admin));

      setSuccess(true);
      setPassword("");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Make sure the backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <a className="admin-login-brand" href="/">
          <span className="admin-brand-b">B</span>
          <span>LINK</span>
        </a>

        <p className="admin-login-eyebrow">SALON MANAGEMENT</p>
        <h1>Welcome back</h1>
        <p className="admin-login-description">
          Sign in to manage your salon website.
        </p>

        {success ? (
          <div className="admin-login-success" role="status">
            <h2>Login successful!</h2>
            <p>
              Welcome, {JSON.parse(
                sessionStorage.getItem("adminUser") || "{}"
              ).username}.
            </p>
            <p>Your admin session is ready.</p>
            <button
              type="button"
              className="admin-login-submit"
              onClick={() => {
                window.location.href = "/admin/dashboard";
              }}
            >
              Continue to dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="Enter your admin email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error && (
              <p className="admin-login-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="admin-login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        <a className="admin-back-link" href="/">
          ← Back to salon website
        </a>
      </section>
    </main>
  );
}

export default AdminLogin;
