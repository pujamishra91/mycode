import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent form reload

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert('Login failed: ' + errorText);
        return;
      }

      const data = await res.json();
      alert(data.message);

      // ✅ Navigate to home page on success
      if (data.redirectTo) {
        localStorage.setItem('isLoggedIn', 'true'); // ✅ set login flag
        navigate(data.redirectTo);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred during login.');
    }
  };
  const handleSignupRedirect = () => {
    navigate('/signup'); // make sure you have a route defined for /signup
  };
  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
       <p>Don't have an account?</p>
      <button onClick={handleSignupRedirect}>Signup</button>
    </div>
  );
};

export default Login;
