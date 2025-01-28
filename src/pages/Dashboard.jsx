import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContaxt";
import { toast } from 'react-toastify'; 
import { ToastContainer } from 'react-toastify';   
import 'react-toastify/dist/ReactToastify.css';    
function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  toast.success("Successfully logged out!");
  const handleLogout = () => {
    logout();  
    navigate('/'); 
  };

  return (
    <div className="home-container">
      <ToastContainer />
      <h1>Welcome, {user?.name}</h1>
      <p>Your role: {user?.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
