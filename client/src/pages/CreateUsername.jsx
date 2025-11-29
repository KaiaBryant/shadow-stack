import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateUser.css";

function CreateUser() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const createUser = async (username) => {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return response.json(); // returns { id, username }
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page refresh
    setLoading(true);

    try {
      const newUser = await createUser(username); // store user in db

      localStorage.setItem("username", newUser.username); // saves username
      localStorage.setItem("user_id", newUser.id); // saves users id

      navigate("/character-select");
    } catch (error) {
      console.error("Cannot create user:", error);
      alert("Failed saving username.");
    } finally {
      setLoading(false);
    }
  };
  //   navigate("/character-select", { state: { username } }); // pass username if needed
  // };

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
              const onlyLetters = value.replace(/[^A-Za-z]/g, "");
              setUsername(onlyLetters);
            }}
          />
        </div>

        <button type="submit" className="custom-btn btn-primary">
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default CreateUser;
