import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard/:appName" element={<DashboardPage />} />
              </Routes>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}
