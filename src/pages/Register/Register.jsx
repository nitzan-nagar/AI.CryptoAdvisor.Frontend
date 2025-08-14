import React, { useState } from "react";
import axios from "axios";
import { useNavigate  } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";

const apiUrl = process.env.REACT_APP_API_URL;


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const register = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(`${apiUrl}/api/auth/register`, { name, email, password, confirmPassword });
      localStorage.setItem("token", res.data.token);
      setError(null);
      navigate("/onboarding"); 
    } catch (err) {
      if (typeof err.response?.data === "string") {
        setError(err.response.data);
      } else {
        setError(Object.values(err.response.data.errors)[0][0]);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-box">
          <h2>Register</h2>
          <input
            className="auth-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        <button className="auth-button" onClick={register}>Register</button>
        {error && <p className="auth-error">{error}</p>}
        <p className="auth-footer-text">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
    </>
  );
}

export default Register;
