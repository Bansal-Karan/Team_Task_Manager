import { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2 } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({ name: '', description: '', members: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projRes = await API.get('/projects');
      setProjects(projRes.data);
      if (user.role === 'Admin') {
        const userRes = await API.get('/users');
        setUsers(userRes.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await API.put(`/projects/${editingProject._id}`, formData);
      } else {
        await API.post('/projects', formData);
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        members: project.members?.map(m => m._id) || []
      });
    } else {
      setEditingProject(null);
      setFormData({ name: '', description: '', members: [] });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleMemberChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, members: selectedOptions });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        {user.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="card">
        {projects.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No projects found.</p>
        ) : (
          <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {projects.map(project => (
              <div key={project._id} className="card" style={{ background: 'var(--bg-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3>{project.name}</h3>
                  {user.role === 'Admin' && (
                    <button className="btn" style={{ background: 'transparent', color: 'var(--primary)', padding: '0.25rem' }} onClick={() => openModal(project)}>
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>{project.description}</p>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <strong>Created By:</strong> {project.createdBy?.name} <br />
                  <strong>Members:</strong> {project.members?.map(m => m.name).join(', ') || 'None'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="card modal">
            <div className="modal-header">
              <h2>{editingProject ? 'Edit Project' : 'Create Project'}</h2>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Project Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
              </div>
              <div className="input-group">
                <label>Assign Members</label>
                <select multiple value={formData.members} onChange={handleMemberChange} style={{ height: '100px' }}>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                <small style={{ color: 'var(--text-muted)' }}>Hold Ctrl/Cmd to select multiple</small>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
