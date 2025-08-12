import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault(); // prevent form reload

  try {
    const requestBody = {
      email: email,
      password: password
    };

    const res = await fetch(
      'https://prod-00.centralindia.logic.azure.com:443/workflows/60ce2a724ce8481cba8ddaa23bfc1a33/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=x5CRRAqciRQvMJdPtIjaJuY78V_unHRqenFTLkIOV2g',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      alert('Login failed: ' + errorText);
      return;
    }

    const result = await res.text(); // Power Automate sends 1 or 0 as plain text

    if (result.trim() === "1") {
      alert('Login successful!');
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/home'); // change to your home page path
    } else {
      alert('Invalid email or password.');
    }

  } catch (err) {
    console.error('Login error:', err);
    alert('An error occurred during login.');
  }
};



/*
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

*/

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
