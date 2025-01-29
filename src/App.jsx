import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utilities/ProtectedRoute";
import { AuthProvider } from "./context/AuthContaxt";
import Login from "./pages/Login";
import DashboardHome from "./pages/DashboardHome";
import Contact from "./pages/contacts/Contact";
import AddContact from "./pages/contacts/AddContact";
import EditContact from "./pages/contacts/EditContact";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          {/* Dashboard Route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardHome />
              </ProtectedRoute>
            }
          />
          {/* Contacts Route */}
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route path="/addcontact" element={
            <ProtectedRoute>
              <AddContact />
          </ProtectedRoute>
          } />
          <Route
            path="/editcontact/:id"
            element={
              <ProtectedRoute>
                <EditContact />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
