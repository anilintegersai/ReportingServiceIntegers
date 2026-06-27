import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3" style={{ flexShrink: 0 }}>
      <Link className="navbar-brand fw-bold" to="/">
        <i className="bi bi-bar-chart-fill me-2 text-primary"></i>Insight Hub
      </Link>
      <div className="ms-auto d-flex align-items-center gap-3">
        {user && (
          <>
            <span className="text-secondary small">
              <i className="bi bi-building me-1"></i>{user.tenant}
            </span>
            <span className="text-white small">
              <i className="bi bi-person-circle me-1"></i>{user.displayName}
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={logout}
              title="Sign out"
            >
              <i className="bi bi-box-arrow-right me-1"></i>Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
