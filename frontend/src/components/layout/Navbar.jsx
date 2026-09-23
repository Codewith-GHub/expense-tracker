import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">Expense Tracker</Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <span className="navbar-user">{user?.name}</span>
            <button onClick={handleLogout} className="navbar-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;