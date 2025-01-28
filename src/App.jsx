import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utilities/ProtectedRoute"; 
import { AuthProvider } from "./context/AuthContaxt";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
