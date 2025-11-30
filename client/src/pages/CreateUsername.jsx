import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateUser.css";

function CreateUser() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

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
    e.preventDefault(); // stop page refresh
    if (!username.trim()) {
      alert("Please enter a username.");
      return;
    }

    setLoading(true);

    try {
      // Attempt to create user
      let newUser = await createUser(username);
      let userId = newUser.id;

      localStorage.setItem("username", newUser.username); // saves username
      localStorage.setItem("user_id", newUser.id); // saves users id

      // Start session
      const session = await startSession(userId);
      localStorage.setItem("session_id", session.session_id);

      navigate("/character-select");
    } catch (error) {
      // Duplicate username case
      if (error.type === "USERNAME_EXISTS") {
        const continueAsUser = window.confirm(
          "This username already exists. Continue as this user?"
        );

        // If user already exists
        if (continueAsUser) {
          const userId = error.existing_user_id;

          localStorage.setItem("username", username);
          localStorage.setItem("user_id", userId);

          // Start session for return user
          const session = await startSession(userId);
          localStorage.setItem("session_id", session.session_id);

          navigate("/character-select");
        } else {
          alert("Please choose a different username.");
        }
        setLoading(false);
        return;
      }

      alert("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="custom-form-wrapper">
      <form onSubmit={handleSubmit} className="custom-form">
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
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default CreateUser;
