import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
  const res = await fetch('http://localhost:5000/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Ashish',
      email: email,
      password: password
    })
  });
  const msg = await res.text();
  alert(msg);
};
  const handlelogin = () => {
    navigate('/login'); // make sure you have a route defined for /signup
  };

  return (
    <div className="auth-form">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Create Account</button>
        
      </form>
       <p>Have an account?</p>
      <button onClick={handlelogin}>Login</button>
    </div>
  );
};

export default Signup;
