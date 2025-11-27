import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateUser.css";

function CreateUser() {
    const navigate = useNavigate();

     const handleSubmit = (e) => {  
        e.preventDefault();      // stop page refresh
        navigate("/character-select");      // route to /levels
  };

  return (
    <form onSubmit= {handleSubmit}>
      <div className="mb-3">
        <label htmlFor="username" className="custom-form-label">
          Username
        </label>
        <input
          type="username"
          className="custom-form-control"
          id="username"
          aria-describedby="usernameHelp"
        />
        </div>

      <button type="submit" className="custom-btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default CreateUser;
