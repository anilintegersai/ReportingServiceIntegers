import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import ReportViewer from '../components/ReportViewer'

export default function DashboardPage() {
  const { appName } = useParams()
  const [manifest, setManifest] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/manifests/${appName}`)
      .then((r) => {
        if (!r.ok) throw new Error(`No manifest found for '${appName}'`)
        return r.json()
      })
      .then((data) => {
        setManifest(data)
        const first = data.categories[0]?.reports[0] ?? null
        setSelectedReport(first)
      })
      .catch((e) => setError(e.message))
  }, [appName])

  function handleFullscreen() {
    document.getElementById('report-container')?.requestFullscreen?.()
  }

  function handleRefresh() {
    setSelectedReport((r) => r ? { ...r } : r)
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="text-center p-4">
          <i className="bi bi-exclamation-triangle display-4 text-warning"></i>
          <p className="mt-3 text-muted">{error}</p>
        </div>
      </div>
    )
  }

  if (!manifest) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  return (
    <div className="d-flex flex-grow-1" style={{ overflow: 'hidden', height: 'calc(100vh - 56px)' }}>
      <Sidebar
        manifest={manifest}
        selectedReportId={selectedReport?.id}
        onSelectReport={setSelectedReport}
      />

      <div className="d-flex flex-column flex-grow-1 bg-light">
        {/* Report header bar */}
        <div className="bg-white border-bottom px-4 py-2 d-flex align-items-center justify-content-between" style={{ flexShrink: 0 }}>
          <div>
            <h5 className="mb-0 fw-semibold">{selectedReport?.title ?? 'Select a report'}</h5>
            <small className="text-muted">{selectedReport?.description}</small>
          </div>
          <div className="d-flex gap-2 align-items-center">
            {selectedReport?.tags?.map((tag) => (
              <span key={tag} className="badge bg-secondary-subtle text-secondary">{tag}</span>
            ))}
            <button className="btn btn-sm btn-outline-secondary" onClick={handleFullscreen} title="Fullscreen">
              <i className="bi bi-fullscreen"></i>
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={handleRefresh} title="Refresh">
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>

        {/* Report embed area */}
        <div className="flex-grow-1 position-relative">
          {selectedReport
            ? <ReportViewer appName={appName} report={selectedReport} />
            : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                <p>Select a report from the sidebar.</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
