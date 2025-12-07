import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateUser.css";

function CreateUser() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [existingUserId, setExistingUserId] = useState(null);

  // Redirect if user already exists
  useEffect(() => {
    const existingUsername = localStorage.getItem("username");
    const existingCharacterId = localStorage.getItem("character_id");

    // If user has both username and character, redirect to levels
    if (existingUsername && existingCharacterId) {
      navigate("/levels");
    }
    // If user has username but no character, redirect to character select
    else if (existingUsername && !existingCharacterId) {
      navigate("/character-select");
    }
  }, [navigate]);

  // Create user in DB
  const createUser = async (username) => {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (response.status === 409) {
      const data = await response.json();
      throw { type: "USERNAME_EXISTS", existing_user_id: data.existing_user_id };
    }

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return response.json(); // returns { id, username }
  };

  // Start session in DB
  const startSession = async (user_id) => {
    const response = await fetch("http://localhost:5000/api/sessions/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      throw new Error("Failed to start session");
    }

    return response.json(); // { session_id }
  };

  // Fetch user data to check if character exists
  const getUserData = async (user_id) => {
    const response = await fetch(`http://localhost:5000/api/users/${user_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return response.json(); // returns user object with character_id
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate empty username
    if (!username.trim()) {
      setError("Please enter a username.");
      setMessage("");
      setExistingUserId(null);
      return;
    }

    setError("");
    setMessage("");
    setExistingUserId(null);
    setLoading(true);

    try {
      let newUser = await createUser(username);
      let userId = newUser.id;

      localStorage.setItem("username", newUser.username);
      localStorage.setItem("user_id", newUser.id);

      // Start session
      const session = await startSession(userId);
      localStorage.setItem("session_id", String(session.session_id));

      navigate("/character-select");
    } catch (error) {
      if (error.type === "USERNAME_EXISTS") {
        setError("This username already exists.");
        setMessage("Click above to continue as this user.");
        setExistingUserId(error.existing_user_id); // store ID in state
        setLoading(false);
        return;
      }

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueExisting = async () => {
    if (!existingUserId) return;

    try {
      setLoading(true);

      // Store basic user info
      localStorage.setItem("username", username);
      localStorage.setItem("user_id", existingUserId);

      // Start session
      const session = await startSession(existingUserId);
      localStorage.setItem("session_id", session.session_id);

      // Fetch user data to check if they have a character
      const userData = await getUserData(existingUserId);

      // If user has a character, go to levels, otherwise go to character select
      if (userData.character_id) {
        localStorage.setItem("character_id", userData.character_id);
        navigate("/levels");
      } else {
        navigate("/character-select");
      }
    } catch (err) {
      console.error("Error continuing as existing user:", err);
      setError("Failed to continue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="levels-page position-relative">
      {/* Reuse global animated blobs so it matches Levels/Simulator */}
      <div className="background-blob blob-1" />
      <div className="background-blob blob-2" />

      <div className="custom-form-wrapper">
        {/* Glassy card styled like levels-content-box */}
        <div className="levels-content-box username-card">
          <div className="levels-header text-center mb-3">
            <h1 className="hud-value levels-main-title">
              Choose Your Codename
            </h1>
            <p className="levels-description">
              This will be your identity across all ShadowStack missions.
              Use letters and numbers only.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="custom-form">
            {error && <div className="custom-error-box">{error}</div>}

            <div className="mb-3">
              <label htmlFor="username" className="custom-form-label">
                Username
              </label>

              <input
                type="text"
                id="username"
                className="custom-form-control"
                aria-describedby="usernameHelp"
                value={username}
                onChange={(e) => {
                  const value = e.target.value;
                  const lettersAndNumbers = value.replace(/[^A-Za-z0-9]/g, "");
                  setUsername(lettersAndNumbers);

                  // any time the name changes, clear previous duplicate state
                  if (error || message || existingUserId) {
                    setError("");
                    setMessage("");
                    setExistingUserId(null);
                  }
                }}
              />

              {message && existingUserId && (
                <button
                  type="button"
                  className="custom-btn btn btn-secondary mt-2"
                  onClick={handleContinueExisting}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Continue as Existing User"}
                </button>
              )}

              {message && (
                <div className="custom-success-box">{message}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn custom-submit-btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Enter the Simulation"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CreateUser;
