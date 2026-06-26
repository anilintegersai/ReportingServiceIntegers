import { Link } from 'react-router-dom'

export default function Sidebar({ manifest, selectedReportId, onSelectReport }) {
  const appSlug = manifest.appName.toLowerCase().replace(/\s+/g, '-')

  return (
    <nav
      className="bg-dark text-white d-flex flex-column"
      style={{ width: 260, minWidth: 260, overflowY: 'auto' }}
    >
      <div className="px-3 py-3 border-bottom border-secondary">
        <Link to="/" className="text-decoration-none text-secondary small">
          <i className="bi bi-arrow-left me-1"></i>All Apps
        </Link>
        <h6 className="mt-2 mb-0 fw-bold text-white">
          <i className={`bi ${manifest.appIcon} me-2`}></i>
          {manifest.appName}
        </h6>
      </div>

      <div className="flex-grow-1 py-2">
        {manifest.categories.map((cat) => (
          <div key={cat.name}>
            <div className="px-3 pt-3 pb-1">
              <span className="text-uppercase text-secondary" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                <i className={`bi ${cat.icon} me-1`}></i>{cat.name}
              </span>
            </div>
            {cat.reports.map((report) => (
              <div
                key={report.id}
                className={`sidebar-link${selectedReportId === report.id ? ' active' : ''}`}
                onClick={() => onSelectReport(report)}
                title={report.description}
              >
                <i className="bi bi-file-bar-graph me-2"></i>
                <span className="small">{report.title}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="px-3 py-2 border-top border-secondary">
        <small className="text-secondary">Insight Hub v1.0</small>
      </div>
    </nav>
  )
}
