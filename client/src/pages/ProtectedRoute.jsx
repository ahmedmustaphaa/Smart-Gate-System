import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // لو مفيش توكن، ابعته لصفحة اللوجن
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // لو فيه توكن، اعرض الصفحة المطلوبة
  return children;
};

export default ProtectedRoute;