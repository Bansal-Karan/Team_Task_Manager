import { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2 } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formError, setFormError] = useState('');
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({ 
    title: '', description: '', project: '', assignedTo: '', status: 'To Do', dueDate: '' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const taskRes = await API.get('/tasks');
      setTasks(taskRes.data);
      
      if (user.role === 'Admin') {
        const projRes = await API.get('/projects');
        setProjects(projRes.data);
        const userRes = await API.get('/users');
        setUsers(userRes.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isValidDueDate = (dateStr) => {
    if (!dateStr) return true;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;

    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return false;
    if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) return false;

    return year >= 1900 && year <= 2100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidDueDate(formData.dueDate)) {
      setFormError('Please enter a valid due date between 1900 and 2100.');
      return;
    }

    try {
      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, formData);
      } else {
        await API.post('/tasks', formData);
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        project: task.project?._id || '',
        assignedTo: task.assignedTo?._id || '',
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', project: '', assignedTo: '', status: 'To Do', dueDate: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Tasks</h1>
        {user.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> New Task
          </button>
        )}
      </div>

      <div className="card">
        {tasks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No tasks found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id}>
                    <td>
                      <div><strong>{task.title}</strong></div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{task.description}</div>
                    </td>
                    <td>{task.project?.name}</td>
                    <td>{task.assignedTo?.name}</td>
                    <td>
                      <select 
                        value={task.status} 
                        onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                        style={{ background: 'var(--bg-color)', color: 'var(--text-main)', padding: '0.25rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </td>
                    <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {user.role === 'Admin' && (
                        <button className="btn" style={{ background: 'transparent', color: 'var(--primary)' }} onClick={() => openModal(task)}>
                          <Edit2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="card modal">
            <div className="modal-header">
              <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} disabled={user.role !== 'Admin'} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} disabled={user.role !== 'Admin'}></textarea>
              </div>
              {user.role === 'Admin' && (
                <>
                  <div className="input-group">
                    <label>Project</label>
                    <select required value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})}>
                      <option value="">Select Project</option>
                      {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Assign To</label>
                    <select value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                      <option value="">Unassigned</option>
                      {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      max="2100-12-31"
                      value={formData.dueDate}
                      onChange={e => {
                        setFormData({...formData, dueDate: e.target.value});
                        setFormError('');
                      }}
                    />
                  </div>
                </>
              )}
              {formError && (
                <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{formError}</div>
              )}
              <div className="input-group">
                <label>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
