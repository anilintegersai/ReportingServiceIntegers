import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center bg-light" style={{ minHeight: '100vh' }}>
      <div className="card shadow-sm border-0" style={{ width: 380 }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i className="bi bi-bar-chart-fill display-4 text-primary"></i>
            <h4 className="mt-2 fw-bold">Insight Hub</h4>
            <p className="text-muted small mb-0">Sign in to access your reports</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              <i className="bi bi-exclamation-circle me-1"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                : 'Sign in'
              }
            </button>
          </form>

          <hr className="my-3" />
          <div className="text-center text-muted" style={{ fontSize: '0.75rem' }}>
            <strong>Demo accounts</strong><br />
            alice / alice123 &nbsp;·&nbsp; bob / bob123 (Acme — HR)<br />
            charlie / charlie123 &nbsp;·&nbsp; diana / diana123 (Globex — Finance)
          </div>
        </div>
      </div>
    </div>
  )
}
