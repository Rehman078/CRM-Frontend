import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  Box,
  Button,
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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import {
  getContacts,
  deleteContacts,
  assignContact,
} from "../../services/ContactApi";
import { getUsers } from "../../services/AuthApi";

function Contact() {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const [openModel, setOpenModel] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null); // Store the current contact ID for assignment

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminOrManager = user?.role === "Admin" || user?.role === "Manager";

  const handleOpen = (contactId) => {
    setCurrentContactId(contactId); // Set the contact ID when opening the modal
    setOpenModel(true);
  };

  const handleClose = () => {
    setOpenModel(false);
    setCurrentContactId(null); // Reset the contact ID when closing the modal
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchContactsData = async () => {
      try {
        const response = await getContacts();
        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching contacts: " + error.message);
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

    fetchContactsData();
    fetchUsersData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteContacts(id);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact._id !== id)
      );
      toast.success("Contact deleted successfully.");
    } catch (error) {
      toast.error("Error deleting contact.");
    }
  };

  const handleAssignContact = async () => {
    console.log("Assigned Users:", assignedUsers); // Log the users being assigned
    try {
      const response = await assignContact(currentContactId, assignedUsers);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === currentContactId
            ? {
                ...contact,
                assigned_to: assignedUsers.map((userId) => ({ _id: userId })),
              }
            : contact
        )
      );
      toast.success("Contact assigned successfully.");
      handleClose();
    } catch (error) {
      console.error("Error assigning contact:", error.message);
      toast.error("Error assigning contact.");
    }
  };

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
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Link to="/addcontact">
            <Button variant="contained">Add Contact</Button>
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

        {/* Contacts Table */}
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Assigned</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No contacts available
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact, index) => (
                  <TableRow key={contact._id}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      {contact.assigned_to
                        ? contact.assigned_to.name
                        : "Not Assigned"}
                    </TableCell>
                    <TableCell>{contact.created_by.name}</TableCell>
                    <TableCell>
                      {isAdminOrManager && (
                        <IconButton
                          sx={{
                            border: "2px solid #00796b",
                            borderRadius: "5px",
                            padding: "4px",
                            color: "#00796b",
                          }}
                          onClick={() => handleOpen(contact._id)}
                        >
                          <AssignmentIcon />
                        </IconButton>
                      )}
                      <Link to={`/editcontact/${contact._id}`}>
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
                      {(contact.created_by.role === "SalesRep" &&
                        user?.role === "SalesRep") ||
                      ["Admin", "Manager"].includes(user?.role) ? (
                        <IconButton
                          color="secondary"
                          sx={{
                            border: "2px solid red",
                            borderRadius: "5px",
                            padding: "4px",
                          }}
                          onClick={() => handleDelete(contact._id)}
                        >
                          <Delete />
                        </IconButton>
                      ) : null}
                    </TableCell>
                  </TableRow>
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
              Assign Contact
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

export default Contact;
