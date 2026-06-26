import { useEffect, useRef, useState } from 'react'
import * as pbi from 'powerbi-client'

const powerbi = new pbi.service.Service(
  pbi.factories.hpmFactory,
  pbi.factories.wpmpFactory,
  pbi.factories.routerFactory
)

export default function ReportViewer({ appName, report }) {
  const containerRef = useRef(null)
  const embedRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [pages, setPages] = useState([])
  const [activePage, setActivePage] = useState(null)

  useEffect(() => {
    if (!report) return
    loadReport()
    return () => {
      if (containerRef.current) powerbi.reset(containerRef.current)
      embedRef.current = null
    }
  }, [report?.id])

  async function loadReport() {
    setStatus('loading')
    setPages([])
    setActivePage(null)
    try {
      const resp = await fetch(`/api/embed/token/${appName}/${report.id}`)
      if (!resp.ok) {
        const err = await resp.json()
        throw new Error(err.detail || 'Token request failed')
      }
      const config = await resp.json()
      renderReport(config)
    } catch (e) {
      setStatus('error')
      setErrorMsg(e.message)
    }
  }

  function renderReport(config) {
    if (!containerRef.current) return
    if (embedRef.current) powerbi.reset(containerRef.current)

    embedRef.current = powerbi.embed(containerRef.current, {
      type: 'report',
      id: config.reportId,
      embedUrl: config.embedUrl,
      accessToken: config.embedToken,
      tokenType: pbi.models.TokenType.Embed,
      settings: {
        navContentPaneEnabled: false,
        filterPaneEnabled: true,
        background: pbi.models.BackgroundType.Default,
      },
    })

    embedRef.current.on('loaded', async () => {
      setStatus('ready')
      try {
        const reportPages = await embedRef.current.getPages()
        const visible = reportPages.filter(p => p.visibility === 0)
        setPages(visible)
        const active = reportPages.find(p => p.isActive)
        setActivePage(active?.name ?? visible[0]?.name ?? null)
      } catch (_) {
        // page nav unavailable — silently skip
      }
    })

    embedRef.current.on('pageChanged', (e) => {
      setActivePage(e.detail?.newPage?.name ?? null)
    })

    embedRef.current.on('error', (e) => {
      setStatus('error')
      setErrorMsg(e.detail?.message || 'Unknown error')
    })
  }

  async function goToPage(pageName) {
    if (!embedRef.current) return
    try {
      const reportPages = await embedRef.current.getPages()
      const page = reportPages.find(p => p.name === pageName)
      if (page) {
        await page.setActive()
        setActivePage(pageName)
      }
    } catch (_) {}
  }

  return (
    <div className="d-flex flex-column w-100 h-100">
      {/* Page tab strip */}
      {pages.length > 1 && (
        <div className="d-flex align-items-center bg-white border-bottom px-3 overflow-auto" style={{ flexShrink: 0, gap: '2px' }}>
          {pages.map(page => (
            <button
              key={page.name}
              onClick={() => goToPage(page.name)}
              className={`btn btn-sm px-3 py-2 rounded-0 border-0 border-bottom border-3 ${
                activePage === page.name
                  ? 'border-primary text-primary fw-semibold'
                  : 'border-transparent text-secondary'
              }`}
              style={{ whiteSpace: 'nowrap', background: 'none' }}
            >
              {page.displayName}
            </button>
          ))}
        </div>
      )}

      {/* Report area */}
      <div className="position-relative flex-grow-1">
        {status === 'loading' && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light" style={{ zIndex: 10 }}>
            <div className="text-center text-muted">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="mb-0">Loading report...</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 10 }}>
            <div className="text-center p-4">
              <i className="bi bi-exclamation-triangle display-4 text-warning"></i>
              <p className="mt-3 text-muted">{errorMsg}</p>
              <button className="btn btn-outline-primary btn-sm" onClick={loadReport}>Retry</button>
            </div>
          </div>
        )}

        <div id="report-container" ref={containerRef} className="w-100 h-100" />
      </div>
    </div>
  )
}
