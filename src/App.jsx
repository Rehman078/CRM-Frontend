import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utilities/ProtectedRoute";
import { AuthProvider } from "./context/AuthContaxt";
import Login from "./pages/Login";
import DashboardHome from "./pages/DashboardHome";
import Contact from "./pages/contacts/Contact";
import AddContact from "./pages/contacts/AddContact";
import EditContact from "./pages/contacts/EditContact";
import SingleContact from "./pages/contacts/SingleContact";
import Lead from "./pages/leads/Lead";
import AddLead from "./pages/leads/AddLead";
import EditLead from "./pages/leads/EditLead";
import SingleLead from "./pages/leads/SingleLead";
import Pipline from "./pages/pipline/Pipline";
import Stage from "./pages/stages/Stage"
import Opportunity from "./pages/opportunity/Opportunity";
import AddOppotunity from "./pages/opportunity/AddOpportunity";
import NewOpportunity from "./pages/opportunity/OpportunityByPipeline";
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
          <Route
            path="/addcontact"
            element={
              <ProtectedRoute>
                <AddContact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editcontact/:id"
            element={
              <ProtectedRoute>
                <EditContact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contactdetail/:id"
            element={
              <ProtectedRoute>
                <SingleContact />
              </ProtectedRoute>
            }
          />

          {/* Lead Route */}
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <Lead />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addlead"
            element={
              <ProtectedRoute>
                <AddLead />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editlead/:id"
            element={
              <ProtectedRoute>
                <EditLead />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/leaddetail/:id"
            element={
              <ProtectedRoute>
                <SingleLead />
              </ProtectedRoute>
            }
          ></Route>

          {/* Pipline */}
          <Route
            path="/pipline"
            element={
              <ProtectedRoute>
                <Pipline />
              </ProtectedRoute>
            }
          ></Route>
           {/*Stage */}
           <Route
            path="/stage/:id"
            element={
              <ProtectedRoute>
                <Stage />
              </ProtectedRoute>
            }
          ></Route>
          {/* opportunity */}
          <Route
            path="/opportunity"
            element={
              <ProtectedRoute>
                <Opportunity />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/opportunity/:id"
            element={
              <ProtectedRoute>
                <NewOpportunity />
              </ProtectedRoute>
            }
          ></Route>
           <Route
            path="/add/opportunity/:id"
            element={
              <ProtectedRoute>
                <AddOppotunity />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
