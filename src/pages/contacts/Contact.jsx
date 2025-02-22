import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import MUIDataTable from "mui-datatables";
import BreadLink from "@mui/material/Link";

import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import {
  getContacts,
  deleteContacts,
  assignContact,
} from "../../services/ContactApi";
import { getUsers } from "../../services/AuthApi";
import CustomDeleteDialog from "../../components/CustomDialog";

function Contact() {
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [openModel, setOpenModel] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminOrManager = user?.role === "Admin" || user?.role === "Manager";

  //assignment modal open
  const handleOpen = (contactId) => {
    setCurrentContactId(contactId);
    setOpenModel(true);
  };
  const handleClose = () => {
    setOpenModel(false);
    setCurrentContactId(null);
  };

  //handle logout
  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login
  };

  //dialog
  const handleDialogOpen = (contactId) => {
    setContactToDelete(contactId);
    setDialogOpen(true);
  };

  //delete contact
  const handleDelete = async (contactToDelete) => {
    try {
      console.log(contactToDelete)
      await deleteContacts(contactToDelete);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact._id !== contactToDelete)
      );
      setDialogOpen(false);
      setContactToDelete(null);
      toast.success("Contact deleted successfully.");
    } catch (error) {
      toast.error("Error deleting contact.");
    }
  };

  //assign contact
  const handleAssignContact = async () => {
    try {
      const response = await assignContact(currentContactId, assignedUsers);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === currentContactId
            ? {
                ...contact,
                assigned_to: assignedUsers.map((userId) => ({ _id: userId })), // Assign users
              }
            : contact
        )
      );
      toast.success("Contact assigned successfully.");
      handleClose();
    } catch (error) {
      toast.error("Contact is already Assigned to SaleRep.");
    }
  };
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

  //fetch Salereps
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


  useEffect(() => {

    fetchContactsData();
    fetchUsersData();
  }, []);

  //get contact table
  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        customBodyRenderLite: (dataIndex) => {
          return <div style={{ textAlign: "center" }}>{dataIndex + 1}</div>;
        },
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const contact = contacts[dataIndex];
          return (
            <Link to={`/contactdetail/${contact._id}`} style={{ textAlign: "center" }}>{contact.name}</Link>
          );
        },
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const contact = contacts[dataIndex];
          return <div style={{ textAlign: "center" }}>{contact.email}</div>;
        },
      },
    },
    {
      name: "phone",
      label: "Phone",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const contact = contacts[dataIndex];
          return <div style={{ textAlign: "center" }}>{contact.phone}</div>;
        },
      },
    },
    {
      name: "company",
      label: "Company",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const contact = contacts[dataIndex];
          return <div style={{ textAlign: "center" }}>{contact.company}</div>;
        },
      },
    },
    {
      name: "created_by",
      label: "Created",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const contact = contacts[dataIndex];
          return <div style={{ textAlign: "center" }}>{contact.created_by?.name || "Unknown"}</div>;
        },
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const contact = contacts[dataIndex];
          return (
            <div>
              {isAdminOrManager && (
                <IconButton
                  sx={{ paddingRight: "14px" }}
                  onClick={() => handleOpen(contact._id)}
                >
                  <AssignmentIcon sx={{ color: "#1f283e", fontSize: "27px" }} />
                </IconButton>
              )}
              <Link to={`/editcontact/${contact._id}`}>
                <IconButton color="primary">
                  <BorderColorOutlinedIcon
                    sx={{ color: "blue", fontSize: 26 }}
                  />
                </IconButton>
              </Link>
              {(contact.created_by.role === "SalesRep" &&
                user?.role === "SalesRep") ||
              ["Admin", "Manager"].includes(user?.role) ? (
                <IconButton onClick={() => handleDialogOpen(contact._id)}>
                  <DeleteOutlineOutlinedIcon
                    sx={{ color: "red", fontSize: "30px" }}
                  />
                </IconButton>
              ) : null}
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    selectableRows: "none",
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25, 50],
    search: true,
    download: false,
    print: false,
    viewColumns: true,
    pagination: true,
    sort: true,
  };

  const breadcrumbItems = [
    { label: "Dashboard", Link: "/", href: "" },
    { label: "Contacts", href: "", isLast: true },
  ];

  return (
    <>
      <Box sx={{ width: "90%", marginLeft: 9, marginTop: 9 }}>
        <AppBarComponent handleLogout={handleLogout} />
        <DrawerComponent />
        <Toaster position="top-right" reverseOrder={false} />
        <Box>
          {/* BreadCrum */}
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              color: "#d1c4e9",
              paddingBottom: 1,
              paddingLeft: 2,
            }}
          >
            {breadcrumbItems.map((item, index) =>
              item.isLast ? (
                <Typography key={index} sx={{ color: "#1F283E" }}>
                  {item.label}
                </Typography>
              ) : (
                <BreadLink
                  key={index}
                  underline="hover"
                  sx={{ color: "#a5bae5" }}
                  href={item.href}
                >
                  {item.label}
                </BreadLink>
              )
            )}
          </Breadcrumbs>

          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Link to="/addcontact">
              <Button
                sx={{
                  backgroundColor: "#a5bae5",
                  color: "#1f283e",
                  paddingInline: 2,
                }}
              >
                Add Contact
              </Button>
            </Link>
          </Box>
        </Box>

        {/* Contacts Table */}
        <Box sx={{ marginLeft: 10, marginTop: 2 }}>
          <MUIDataTable
            title="Contacts List"
            data={contacts}
            columns={columns}
            options={options}
          />
        </Box>

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
                sx={{ marginRight: 1, color: "#1f283e" }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                sx={{
                  backgroundColor: "#a5bae5",
                  color: "#1f283e",
                  paddingInline: 2,
                  paddingBlock: 1,
                }}
                onClick={handleAssignContact}
              >
                Assign
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Delete Dialog */}
        <CustomDeleteDialog
          open={dialogOpen}
          handleClose={() => setDialogOpen(false)}
          title="Confirm Action"
          content="Are you sure you want to delete this contact?"
          onConfirm={() => handleDelete(contactToDelete)}
          btn="Delete"
        />
      </Box>
    </>
  );
}

export default Contact;
