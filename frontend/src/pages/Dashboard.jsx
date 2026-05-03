import { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, FolderKanban } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const taskRes = await API.get('/tasks');
      setTasks(taskRes.data);
      const projRes = await API.get('/projects');
      setProjects(projRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <FolderKanban size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Projects</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{projects.length}</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-muted)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>To Do Tasks</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{todoTasks.length}</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>In Progress</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{inProgressTasks.length}</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Completed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{doneTasks.length}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recent Tasks</h2>
        {tasks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No tasks found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map(task => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{task.project?.name}</td>
                    <td>
                      <span className={`badge ${task.status === 'To Do' ? 'badge-todo' : task.status === 'In Progress' ? 'badge-progress' : 'badge-done'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
