import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // We will use standard CSS for layout

function App() {
  // State for Auth
  const [user, setUser] = useState(null); // Stores user ID if logged in
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // State for Tasks
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // State for Timer
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(true); // true = 25min, false = 5min break

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert(isStudyMode ? "Study session done! Take a break." : "Break over! Back to work.");
      // Toggle mode automatically
      setIsStudyMode(!isStudyMode);
      setTimeLeft(isStudyMode ? 5 * 60 : 25 * 60); // Swap times
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isStudyMode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isStudyMode ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- API CALLS ---
  const handleAuth = async () => {
    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
    try {
      const res = await axios.post(endpoint, { email, password });
      if (authMode === 'register') {
        alert("Registered! Now please log in.");
        setAuthMode('login');
      } else {
        setUser(res.data.user_id);
        fetchTasks(res.data.user_id);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  const fetchTasks = async (userId) => {
    const res = await axios.get(`/api/tasks/${userId}`);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!newTask) return;
    await axios.post('/api/tasks', { content: newTask, user_id: user });
    setNewTask('');
    fetchTasks(user);
  };

  const deleteTask = async (taskId) => {
    await axios.delete(`/api/tasks/${taskId}`);
    fetchTasks(user);
  };

  // --- RENDER ---
  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>FocusTask Final</h1>
        <div className="card">
          <h2>{authMode === 'login' ? 'Login' : 'Register'}</h2>
          <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button onClick={handleAuth}>{authMode === 'login' ? 'Enter' : 'Sign Up'}</button>
          <p onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} style={{cursor:'pointer', color:'blue'}}>
            {authMode === 'login' ? "Need an account? Register" : "Have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout" style={{ display: 'flex', height: '100vh' }}>
      {/* Left Side: Timer */}
      <div className="timer-section" style={{ flex: 1, backgroundColor: isStudyMode ? '#ff6b6b' : '#4ecdc4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <h2>{isStudyMode ? "Study Time" : "Break Time"}</h2>
        <h1 style={{ fontSize: '100px', margin: '20px' }}>{formatTime(timeLeft)}</h1>
        <div>
          <button onClick={toggleTimer} style={{ fontSize: '20px', padding: '10px 30px' }}>{isActive ? 'Pause' : 'Start'}</button>
          <button onClick={resetTimer} style={{ fontSize: '20px', padding: '10px 30px', marginLeft: '10px' }}>Reset</button>
        </div>
      </div>

      {/* Right Side: Task List */}
      <div className="task-section" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <h2>My Tasks</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            value={newTask} 
            onChange={e => setNewTask(e.target.value)} 
            placeholder="What needs to be done?" 
            style={{ flex: 1, padding: '10px' }}
          />
          <button onClick={addTask} style={{ padding: '10px 20px' }}>Add</button>
        </div>
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(task => (
            <li key={task.id} style={{ background: '#f0f0f0', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', borderRadius: '5px' }}>
              <span>{task.content}</span>
              <button onClick={() => deleteTask(task.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>✖</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;