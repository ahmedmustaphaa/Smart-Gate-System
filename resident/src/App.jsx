import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './conponeent/Login'
import ResidentDashboard from './conponeent/ResidentDashboard'
import CreateInvitation from './conponeent/CreateInvitation'
import Scanner from './conponeent/Scanner'

function App() {
  
  // دالة حماية المسارات: لو مفيش توكن في الـ LocalStorage يرجعه للوجين فوراً
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('residentToken');
    if (!token) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      {/* مكون الإشعارات التلقائي (Hot Toast) عشان يظهر رسائل النجاح أو الأخطاء */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        {/* 1. صفحة تسجيل الدخول (الصفحة الرئيسية للأبليكيشن) */}
        <Route path="/" element={<Login />} />
        
        {/* 2. لوحة تحكم المالك (محمية) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <ResidentDashboard />
          </ProtectedRoute>
        } />
        
        {/* 3. شاشة دعوة زائر (محمية) */}
        <Route path="/invite" element={
          <ProtectedRoute>
            <CreateInvitation />
          </ProtectedRoute>
        } />

        {/* لو الساكن كتب أي مسار غلط أو مش موجود، يرجعه لصفحة اللوجين */}
        <Route path="*" element={<Navigate to="/" replace />} />
        // في ملف الـ Router بتاعك:
<Route path="/security-scanner" element={<Scanner/>} />
      </Routes>
    </Router>
  )
}

export default App