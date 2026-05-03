import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Hexagon } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Hexagon color="#6366f1" size={32} />
        TeamTask
      </div>
      <div className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/projects" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <FolderKanban size={20} />
          Projects
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <CheckSquare size={20} />
          Tasks
        </NavLink>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Logged in as <strong>{user?.name}</strong> ({user?.role})
        </div>
        <button className="btn btn-danger" style={{ width: '100%' }} onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
