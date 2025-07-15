import { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await API.get('/task');
      setTasks(res.data);
    } catch {
      alert('Session expired');
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await API.post('/task', form);
    setForm({ title: '', description: '', status: 'pending' });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await API.delete(`/task/${id}`);
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <header className="navbar">
        <h1 className="navbar-title">My Task App</h1>
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
      </header>

      <div className="dashboard-container">
        <h2>🗂️ Task Manager</h2>

        <form className="task-form" onSubmit={handleAdd}>
          <input type="text" placeholder="Task Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Task Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
          <button type="submit">➕ Add Task</button>
        </form>

        <ul className="task-list">
          {tasks.map(task => (
            <li key={task._id} className="task-item">
              <div>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
              <button onClick={() => handleDelete(task._id)}>🗑️ Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
