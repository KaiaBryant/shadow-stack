import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateUser.css";

function CreateUser() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [existingUserId, setExistingUserId] = useState(null);

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
      localStorage.setItem("session_id", session.session_id);

      navigate("/character-select");
    } catch (error) {
      if (error.type === "USERNAME_EXISTS") {
        setError("This username already exists.");
        setMessage("Click below to continue as this user.");
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

    localStorage.setItem("username", username);
    localStorage.setItem("user_id", existingUserId);

    const session = await startSession(existingUserId);
    localStorage.setItem("session_id", session.session_id);

    navigate("/character-select");
  };

  return (
    <div className="custom-form-wrapper">
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
            >
              Continue as Existing User
            </button>
          )}

          {message && <div className="custom-success-box">{message}</div>}
        </div>

        <button type="submit" className="btn custom-submit-btn btn-primary">
          {loading ? "Saving..." : "Submit"}
        </button>

      </form>
    </div>
  );
}

export default CreateUser;
