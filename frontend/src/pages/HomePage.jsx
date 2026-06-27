import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const { authFetch, user } = useAuth()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    authFetch('/api/manifests')
      .then(r => r.json())
      .then(data => setApps(data))
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <i className="bi bi-bar-chart-fill display-3 text-primary"></i>
        <h1 className="mt-3 fw-bold">Insight Hub</h1>
        <p className="text-muted fs-5">
          Welcome, <strong>{user?.displayName}</strong> — select an application to view your reports
        </p>
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!error && apps.length === 0 && (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          No reports have been assigned to your account yet. Contact your administrator.
        </div>
      )}

      <div className="row g-4 justify-content-center">
        {apps.map(app => {
          const slug = app.appName.toLowerCase().replace(/\s+/g, '-')
          const reportCount = app.categories.reduce((n, c) => n + c.reports.length, 0)
          return (
            <div key={slug} className="col-md-4 col-sm-6">
              <Link to={`/dashboard/${slug}`} className="card h-100 shadow-sm border-0 app-card">
                <div className="card-body text-center py-4">
                  <i className={`bi ${app.appIcon} display-5 text-primary mb-3 d-block`}></i>
                  <h5 className="card-title fw-semibold">{app.appName}</h5>
                  <p className="text-muted small mb-0">{reportCount} report{reportCount !== 1 ? 's' : ''} available</p>
                </div>
                <div className="card-footer bg-transparent text-center border-0 pb-3">
                  <span className="badge bg-primary-subtle text-primary">Open</span>
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      <hr className="my-5" />
      <div className="text-center text-muted small">
        <p><strong>Adding a new application?</strong></p>
        <p>Create a manifest file at <code>backend/manifests/your-app-name.json</code> and assign users in <code>backend/users/users.json</code>.</p>
      </div>
    </div>
  )
}
