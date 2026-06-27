import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('insight_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(u => setUser(u))
      .catch(() => { localStorage.removeItem('insight_token'); setToken(null) })
      .finally(() => setLoading(false))
  }, [token])

  async function login(username, password) {
    const resp = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!resp.ok) {
      const err = await resp.json()
      throw new Error(err.detail || 'Login failed')
    }
    const { access_token } = await resp.json()
    localStorage.setItem('insight_token', access_token)
    setToken(access_token)
    const me = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(r => r.json())
    setUser(me)
  }

  function logout() {
    localStorage.removeItem('insight_token')
    setToken(null)
    setUser(null)
  }

  // Authenticated fetch — automatically attaches the Bearer token
  function authFetch(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    })
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
