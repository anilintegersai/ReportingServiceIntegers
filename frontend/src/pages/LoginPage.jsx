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
          <div className="text-muted" style={{ fontSize: '0.72rem' }}>
            <div className="fw-semibold mb-1 text-center">Demo accounts</div>
            <table className="w-100" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                  <th className="pb-1" style={{ fontWeight: 600 }}>User</th>
                  <th className="pb-1" style={{ fontWeight: 600 }}>Password</th>
                  <th className="pb-1" style={{ fontWeight: 600 }}>Tenant</th>
                  <th className="pb-1" style={{ fontWeight: 600 }}>Access</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['admin',   'admin123',   'System Admin', 'All reports'],
                  ['alice',   'alice123',   'Acme Corp',    'HR — full'],
                  ['bob',     'bob123',     'Acme Corp',    'HR — limited'],
                  ['charlie', 'charlie123', 'Globex',       'Finance — limited'],
                  ['diana',   'diana123',   'Globex',       'Finance — full'],
                  ['eve',     'eve123',     'Contoso',      'AdventureWorks + Revenue'],
                  ['frank',   'frank123',   'Contoso',      'Sales + Revenue'],
                  ['grace',   'grace123',   'TechCorp',     'AI Analytics — full'],
                  ['henry',   'henry123',   'TechCorp',     'Performance only'],
                  ['ivan',    'ivan123',    'MedHealth',    'Covid + Life Exp'],
                  ['julia',   'julia123',   'MedHealth',    'Public Health — full'],
                ].map(([u, p, t, a]) => (
                  <tr key={u} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td className="py-1 pe-2">
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-none"
                        style={{ fontSize: '0.72rem', color: '#0d6efd' }}
                        onClick={() => { setUsername(u); setPassword(p) }}
                      >{u}</button>
                    </td>
                    <td className="py-1 pe-2 text-muted">{p}</td>
                    <td className="py-1 pe-2 text-muted">{t}</td>
                    <td className="py-1 text-muted">{a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-1 mb-0 text-center" style={{ fontSize: '0.68rem' }}>
              Click a username to auto-fill credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
