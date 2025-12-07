import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Call backend to verify admin credentials + MFA
  const loginAdmin = async (username, password, mfaCode) => {
    const response = await fetch("https://shadow-stack.onrender.com/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, pin_code: mfaCode }),
    });

    if (!response.ok) {
      throw new Error("Invalid admin credentials or MFA code");
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // basic front-end validation
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    if (mfaCode.length !== 6) {
      setError("Please enter 6-digit MFA code.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginAdmin(username, password, mfaCode);

      localStorage.setItem("admin_username", username);
      if (data.admin_id) {
        localStorage.setItem("admin_id", data.admin_id);
      }
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
      }

      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Login failed. Check your username, password, and MFA code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-wrapper">
      <form onSubmit={handleSubmit} className="admin-form">
        <h2 className="admin-form-title">Admin Login</h2>

        {error && <div className="admin-error">{error}</div>}

        <div className="mb-3">
          <label htmlFor="username" className="admin-form-label">
            Admin Username
          </label>
          <input
            type="text"
            id="username"
            className="admin-form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="admin-form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="admin-form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mfa" className="admin-form-label">
            Pin
          </label>
          <input
            type="password"
            inputMode="numeric"
            id="mfa"
            className="admin-form-control"
            value={mfaCode}
            maxLength={6}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, "");
              setMfaCode(digitsOnly.slice(0, 6));
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
