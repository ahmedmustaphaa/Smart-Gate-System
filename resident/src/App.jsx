import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './conponeent/Login'
import ResidentDashboard from './conponeent/ResidentDashboard'
import CreateInvitation from './conponeent/CreateInvitation'
import Scanner from './conponeent/Scanner'

function App() {
  

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('residentToken');
    if (!token) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>

      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>

        <Route path="/" element={<Login />} />
      
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <ResidentDashboard />
          </ProtectedRoute>
        } />
        
      
        <Route path="/invite" element={
          <ProtectedRoute>
            <CreateInvitation />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
    
<Route path="/security-scanner" element={<Scanner/>} />
      </Routes>
    </Router>
  )
}

export default App