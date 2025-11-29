import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateUser.css";

function CreateUser() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // stop page refresh

    if (!username.trim()) {
    alert("Please enter a username.");
    return; // stop submit
  }
    // later send `username` to backend / DB here
    // await api.createUser({ username });

    navigate("/character-select", { state: { username } }); // pass username when needed
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
        const onlyLetters = value.replace(/[^A-Za-z]/g, "");
        setUsername(onlyLetters);
}}
          />
        </div>

        <button type="submit" className="custom-btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateUser;
