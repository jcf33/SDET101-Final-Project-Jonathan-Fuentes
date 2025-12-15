import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      // Connects to your running Flask server
      await axios.post('http://127.0.0.1:5000/register', { email, password });
      alert('Registration Successful!');
    } catch (error) {
      alert('Error registering: User likely already exists');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { email, password });
      alert('Login Successful! Your User ID is: ' + response.data.user_id);
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1>FocusTask</h1>
      <h3>Login / Register</h3>
      <input 
        placeholder="Email" 
        onChange={(e) => setEmail(e.target.value)} 
        style={{ padding: '10px', marginBottom: '10px' }}
      />
      <br />
      <input 
        type="password" 
        placeholder="Password" 
        onChange={(e) => setPassword(e.target.value)} 
        style={{ padding: '10px', marginBottom: '10px' }}
      />
      <br />
      <button onClick={handleRegister} style={{ padding: '10px 20px', marginRight: '10px' }}>Register</button>
      <button onClick={handleLogin} style={{ padding: '10px 20px' }}>Login</button>
    </div>
  );
}

export default App;