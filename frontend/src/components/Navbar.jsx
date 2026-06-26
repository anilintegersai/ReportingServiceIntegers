import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3" style={{ flexShrink: 0 }}>
      <Link className="navbar-brand fw-bold" to="/">
        <i className="bi bi-bar-chart-fill me-2 text-primary"></i>Insight Hub
      </Link>
      <div className="ms-auto d-flex align-items-center gap-3">
        <span className="text-secondary small">Powered by Power BI Embedded</span>
      </div>
    </nav>
  )
}
