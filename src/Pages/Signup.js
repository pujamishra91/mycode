import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // ✅ prevent page reload

    try {
      const requestBody = {
        name: 'Ashish',
        email: email,
        password: password
      };

      const res = await fetch(
        'https://prod-10.centralindia.logic.azure.com:443/workflows/4fed68b1ef154d94a4f39afa3ca3fb5d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6VLTpK4DpOm5YpGKBeOvQZ9vaL91gZKgzzFBhkzMLpE',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        alert('Signup failed: ' + errorText);
        return;
      }

      const msg = (await res.text()).trim();

      if (msg.toLowerCase() === 'success') {
        alert('Signup successful!');
        navigate('/'); // ✅ redirect to main page
      } else {
        alert(`Signup failed: ${msg}`);
      }

    } catch (err) {
      console.error('Signup error:', err);
      alert('An error occurred during signup.');
    }
  };

  const handlelogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-form">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
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
        <button type="submit">Create Account</button>
      </form>

      <p>Have an account?</p>
      <button onClick={handlelogin}>Login</button>
    </div>
  );
};

export default Signup;
