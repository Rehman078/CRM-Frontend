import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Parse the user object from localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token;

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/" />;
  }

  // Render the protected route component if authenticated
  return children;
}

export default ProtectedRoute;
