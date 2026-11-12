// src/components/ProtectedRoute.jsx

import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Assuming your context has a loading state
  const location = useLocation();

  if (loading) {
    // Show a loading spinner or component while auth state is being determined
    return <div>Loading...</div>;
  }

  if (!user) {
    // User is not logged in, redirect them to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.emailVerified) {
    // User is logged in but their email is not verified, redirect to verify page
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }
  
  // If user is logged in and verified, render the child component
  return children;
};

export default ProtectedRoute;