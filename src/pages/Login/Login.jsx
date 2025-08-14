import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import '../Auth/Auth.css'

const apiUrl = process.env.REACT_APP_API_URL;


const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const login = async () => {
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      if (res.data.needsOnboarding) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-box">
          <h2>Login</h2>
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
            <button className="auth-button" onClick={login}>Login</button>
            {error && <p className="auth-error">{error}</p>}
            <p className="auth-footer-text">Don't have an account? <a href="/register">Register</a></p>
        </div>
      </div>
    </>
  );
}
export default Login