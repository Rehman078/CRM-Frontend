import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import MUIDataTable from "mui-datatables";
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

function Contact() {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [openModel, setOpenModel] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminOrManager = user?.role === "Admin" || user?.role === "Manager";

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

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
    navigate("/"); // Redirect to login
  };

  //delete contact
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
          return <div>{dataIndex + 1}</div>;
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
            <Link to={`/contactdetail/${contact._id}`}>{contact.name}</Link>
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
          return <div>{contact.email}</div>;
        },
      },
    },
    {
      name: "phone",
      label: "Phone",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const contact = contacts[dataIndex];
          return <div>{contact.phone}</div>;
        },
      },
    },
    {
      name: "company",
      label: "Company",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const contact = contacts[dataIndex];
          return <div>{contact.company}</div>;
        },
      },
    },
    {
      name: "created_by",
      label: "Created",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const contact = contacts[dataIndex];
          return <div>{contact.created_by?.name || "Unknown"}</div>;
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
                <IconButton onClick={() => handleDelete(contact._id)}>
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
    rowsPerPage: 10,
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
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* BreadCrum */}
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ color: "#d1c4e9", paddingBottom: 4 }}
          >
            {breadcrumbItems.map((item, index) =>
              item.isLast ? (
                <Typography key={index} sx={{ color: "#1F283E" }}>
                  {item.label}
                </Typography>
              ) : (
                <Link
                  key={index}
                  underline="hover"
                  sx={{ color: "#a5bae5" }}
                  href={item.href}
                >
                  {item.label}
                </Link>
              )
            )}
          </Breadcrumbs>

          <Link to="/addcontact">
            <Button
              sx={{
                backgroundColor: "#a5bae5",
                color: "#1f283e",
                paddingInline: 2,
                paddingBlock: 1,
              }}
            >
              Add Contact
            </Button>
          </Link>
        </Box>

        {/* Contacts Table */}
        <MUIDataTable
          title="Contacts List"
          data={contacts}
          columns={columns}
          options={options}
        />

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
      </Box>
    </Box>
  );
}

export default Contact;
