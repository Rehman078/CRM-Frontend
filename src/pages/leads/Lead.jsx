import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Breadcrumbs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  Edit,
  Delete,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { getUsers } from "../../services/AuthApi";
import { getLeads, deleteLead, assignLead } from "../../services/LeadApi";

function Lead() {
  const [leads, setLeads] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const [loading, setLoading] = useState(true);
  const [openModel, setOpenModel] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // For collapsible table
  const [openRow, setOpenRow] = useState(null);

  // For delete button
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminOrManager = user?.role === "Admin" || user?.role === "Manager";

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get leads and users
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeads();
        setLeads(response.data);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsersData = async () => {
      try {
        const response = await getUsers();
        const filteredUsers = response.data.filter(
          (user) => user.role === "SalesRep"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users: " + error.message);
      }
    };
    fetchUsersData();
    fetchLeads();
  }, []);

  const handleOpen = (leadId) => {
    setCurrentLeadId(leadId);
    setOpenModel(true);
  };

  const handleClose = () => {
    setOpenModel(false);
    setCurrentLeadId(null);
  };

  // Delete lead
  const handleDelete = async (id) => {
    try {
      await deleteLead(id);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));
      toast.success("Lead deleted successfully.");
    } catch (error) {
      toast.error("Error deleting lead.");
    }
  };

  // Assign contact to users
  const handleAssignContact = async () => {
    try {
      await assignLead(currentLeadId, assignedUsers);
      toast.success("Lead assigned successfully.");
      setOpenModel(false);
      setCurrentLeadId(null);
    } catch (error) {
     toast.error("Lead is already Assigned to SaleRep.");
    }
  };

  // Toggle collapsible row
  const handleToggle = (id) => {
    setOpenRow((prevOpenRow) => (prevOpenRow === id ? null : id));
  };

  // Breadcrumb name
  const breadcrumbItems = [
    { label: "Dashboard", Link: "/", href: "" },
    { label: "Leads", href: "", isLast: true },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBarComponent
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleLogout={handleLogout}
      />
      <DrawerComponent open={open} handleDrawerClose={handleDrawerClose} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          textAlign: "left",
          marginLeft: open ? 30 : 9,
          transition: "margin 0.3s ease",
        }}
      >
        <Toaster position="top-right" reverseOrder={false} />

        <Box
          sx={{
            marginTop: 8,
            marginBottom: 2,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#d1c4e9" }}>
            {breadcrumbItems.map((item, index) =>
              item.isLast ? (
                <Typography key={index} sx={{ color: "white" }}>
                  {item.label}
                </Typography>
              ) : (
                <Link
                  key={index}
                  underline="hover"
                  sx={{ color: "#d1c4e9" }}
                  href={item.href}
                >
                  {item.label}
                </Link>
              )
            )}
          </Breadcrumbs>

          <Link to="/addlead">
            <Button variant="contained">Add Lead</Button>
          </Link>
        </Box>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "90vh",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Table Container */}
        <TableContainer
  component={Paper}
>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Lead Name</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Lead Contact</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Lead Source</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
        {["Admin", "Manager"].includes(user?.role) && (
          <TableCell sx={{ fontWeight: "bold" }}>Assignment</TableCell>
        )}
        <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {leads.length === 0 && !loading ? (
        <TableRow>
          <TableCell colSpan={9} align="center">
            No leads available
          </TableCell>
        </TableRow>
      ) : (
        leads.map((lead, index) => (
          <React.Fragment key={lead._id}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>{index + 1}</TableCell>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.contactinfo}</TableCell>
              <TableCell>{lead.leadsource}</TableCell>
              <TableCell>{lead.status}</TableCell>
              <TableCell>{lead.created_by.name}</TableCell>
              {["Admin", "Manager"].includes(user?.role) && (
                <TableCell>
                  <IconButton onClick={() => handleToggle(lead._id)}>
                    {openRow === lead._id ? (
                      <KeyboardArrowUp />
                    ) : (
                      <KeyboardArrowDown />
                    )}
                  </IconButton>
                </TableCell>
              )}
              <TableCell>
                {isAdminOrManager && (
                  <IconButton
                    sx={{
                      border: "2px solid #00796b",
                      borderRadius: "5px",
                      padding: "4px",
                      color: "#00796b",
                    }}
                    onClick={() => handleOpen(lead._id)}
                  >
                    <AssignmentIcon />
                  </IconButton>
                )}
                <Link to={`/editlead/${lead._id}`}>
                  <IconButton
                    color="primary"
                    sx={{
                      border: "2px solid #1976d2",
                      borderRadius: "5px",
                      padding: "4px",
                      marginInline: 1,
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Link>

                {(lead.created_by.role === "SalesRep" &&
                  user?.role === "SalesRep") ||
                ["Admin", "Manager"].includes(user?.role) ? (
                  <IconButton
                    color="secondary"
                    sx={{
                      border: "2px solid red",
                      borderRadius: "5px",
                      padding: "4px",
                    }}
                    onClick={() => handleDelete(lead._id)}
                  >
                    <Delete />
                  </IconButton>
                ) : null}
              </TableCell>
              
            </TableRow>
            {/* Collapsible Table Row */}
            <TableRow>
              <TableCell colSpan={8}  style={{ padding: 0 }}>
                <Collapse
                  in={openRow === lead._id}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{marginInline: 15}}>
                  <Table
                    size="small"
                    style={{  marginBlock: "20px" }}
                  >
                    <TableHead sx={{ backgroundColor: "#9ab6ba" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lead.assigned_to && lead.assigned_to.length > 0 ? (
                        lead.assigned_to.map((user, index) => (
                          <TableRow key={user.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            style={{
                              textAlign: "center",
                            }}
                          >
                            Not Assigned Lead
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))
      )}
    </TableBody>
  </Table>
</TableContainer>


        {/* Assignment Modal */}
        <Modal
          open={openModel}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              paddingTop: 3,
              paddingBottom: 3,
              px: 4,
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ textAlign: "center" }}
            >
              Assign Lead
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Assign to Users</InputLabel>
                <Select
                  label="Assign to Users"
                  multiple
                  value={assignedUsers}
                  onChange={(e) => setAssignedUsers(e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Typography>
            <Box sx={{ textAlign: "end", marginTop: 2 }}>
              <Button
                variant="outlined"
                sx={{ marginRight: 1 }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAssignContact}>
                Assign
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default Lead;
