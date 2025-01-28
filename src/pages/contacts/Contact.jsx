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
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { getContacts, deleteContacts } from "../../services/ContactApi";

function Contact() {
  const [open, setOpen] = React.useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Fetch contacts from the server
  useEffect(() => {
    const fetchContactsData = async () => {
      try {
        const response = await getContacts();
        setContacts(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContactsData();
  }, []);

  // Delete a contact
  const handleDelete = async (id) => {
    try {
      await deleteContacts(id);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact._id !== id)
      );
      toast.success("Contact deleted successfully.");
    } catch (error) {
      toast.error("Error deleting contact:");
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

        {/* Loading Indicator */}
        {loading && (
          <CircularProgress
            sx={{ display: "block", margin: "auto", marginTop: 3 }}
          />
        )}

        {/* Contacts Table */}
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Assigned</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Display No Contacts Message */}
              {contacts.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No contacts available
                  </TableCell>
                </TableRow>
              ) : (
                // Map over contacts
                contacts.map((contact) => (
                  <TableRow key={contact._id}>
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
                      <IconButton
                        color="primary"
                        sx={{
                          border: "2px solid blue",
                          borderRadius: "5px",
                          padding: "4px",
                          marginRight: "8px",
                        }}
                        // onClick={() => handleEdit(contact._id)} // Uncomment if edit logic is implemented
                      >
                        <Edit />
                      </IconButton>
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Contact;
