import React, { useEffect, useState, useMemo } from "react";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import "../../table.css"
import { MaterialReactTable } from "material-react-table";
import CustomDeleteDialog from "../../components/CustomDialog";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import { Link } from "react-router-dom";
import BreadLink from "@mui/material/Link";
import { ToastContainer, toast } from "react-toastify";
import {
  getContacts,
  deleteContacts,
  assignContact,
} from "../../services/ContactApi";
import { getUsers } from "../../services/AuthApi";
import FolderOffIcon from '@mui/icons-material/FolderOff';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";

function Contact() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminOrManager = user?.role === "Admin" || user?.role === "Manager";
  
  const [contacts, setContacts] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [openModel, setOpenModel] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);


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
      console.log(contactToDelete);
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
  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
      size: 5,
      Cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 40,
      Cell: ({ row }) => (
        <Link to={`/contactdetail/${row.original._id}`}>
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 30,
      Cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      size: 50,
      Cell: ({ row }) => <div>{row.original.phone}</div>,
    },
    {
      accessorKey: "company",
      header: "Company",
      size: 180,
      Cell: ({ row }) => <div>{row.original.company}</div>,
    },
    {
      accessorKey: "created_by",
      header: "Created",
      size: 40,
      Cell: ({ row }) => (
        <div>{row.original.created_by?.name || "Unknown"}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => {
        const contact = row.original;
        return (
          <div>
            {isAdminOrManager && (
              <IconButton onClick={() => handleOpen(contact._id)}>
                <AssignmentIcon sx={{ color: "#1f283e", fontSize: "25px" }} />
              </IconButton>
            )}
            <Link to={`/editcontact/${contact._id}`}>
              <IconButton color="primary">
                <BorderColorOutlinedIcon sx={{ color: "blue", fontSize: 23 }} />
              </IconButton>
            </Link>
            {(contact.created_by.role === "SalesRep" &&
              user?.role === "SalesRep") ||
            ["Admin", "Manager"].includes(user?.role) ? (
              <IconButton onClick={() => handleDialogOpen(contact._id)}>
                <DeleteOutlineOutlinedIcon
                  sx={{ color: "red", fontSize: "25px" }}
                />
              </IconButton>
            ) : null}
          </div>
        );
      },
    },
  ]);

  const breadcrumbItems = [
    { label: "Dashboard", Link: "/", href: "" },
    { label: "Contacts", href: "", isLast: true },
  ];

  return (
    <>
      <Box sx={{ width: "93%", marginLeft: 9, marginTop: 9 }}>
        <AppBarComponent handleLogout={handleLogout} />
        <DrawerComponent />
        <ToastContainer position="top-right" autoClose={2000} />
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
        <Box sx={{ marginLeft: 6, marginTop: 2 }}>
          <MaterialReactTable
            columns={columns}
            data={contacts}
            getRowId={(row) => row.id}
            enableRowSelection
            enableDensityToggle={false}
            enableExpandAll={false}
            enableColumnFilters={false}
            onRowSelectionChange={setSelectedRows}
            state={{ rowSelection: selectedRows }}
            muiTableBodyRowProps={({ row }) => ({
              sx: (theme) => ({
                backgroundColor: selectedRows?.[row.id] ? "#FFCDD2" : "inherit",
                "&:hover": {
                  backgroundColor: selectedRows?.[row.id]
                    ? "#D32F2F"
                    : "#FCE4EC",
                },
              }),
            })}
            muiTableContainerProps={{ sx: { width: "100%" } }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "#055266",
                color: "white",
                fontSize: "12px",
                padding: "4px 8px",
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                fontSize: "12px",
                padding: "4px 8px",
              },
            }}
            renderEmptyRowsFallback={() => (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="120px"
              >
                 <FolderOffIcon sx={{color:"gray", fontSize:"30px"}} />
                <Typography variant="body1" color="#0d576b" sx={{color:"gray", fontSize:"15px"}}>
                  No Contact Available
                </Typography>
              </Box>
            )}
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
