import React, { useState, useEffect } from "react";
import CustomDialog from "../../components/CustomDialog";
import {
  Box,
  Button,
  Breadcrumbs,
  Typography,
  CircularProgress,
  IconButton,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import BreadLink from "@mui/material/Link";
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { getUsers } from "../../services/AuthApi";
import { getLeads, deleteLead, assignLead } from "../../services/LeadApi";

function Lead() {
  const [leads, setLeads] = React.useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // For delete button
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminOrManager = user?.role === "Admin" || user?.role === "Manager";

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  //assignmetn model
  const handleOpen = (leadId) => {
    setCurrentLeadId(leadId);
    setOpenModel(true);
  };
  const handleClose = () => {
    setOpenModel(false);
    setCurrentLeadId(null);
  };

  //dialog
  const handleDialogOpen = (leadId) => {
    setLeadToDelete(leadId);
    setDialogOpen(true);
  };

  // Delete lead
  const handleDelete = async (leadToDelete) => {
    try {
      await deleteLead(leadToDelete);
      setLeads((prevLeads) =>
        prevLeads.filter((lead) => lead._id !== leadToDelete)
      );
      setDialogOpen(false);
      setLeadToDelete(null);
      toast.success("Lead deleted successfully.");
    } catch (error) {
      toast.error("Error deleting lead.");
    }
  };

  // Assign contact to users
  const handleAssignLead = async () => {
    try {
      await assignLead(currentLeadId, assignedUsers);
      toast.success("Lead assigned successfully.");
      setOpenModel(false);
      setCurrentLeadId(null);
    } catch (error) {
      toast.error("Lead is already Assigned to SaleRep.");
    }
  };

  // Get leads and users
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeads();
        setLeads(response.data);
      } catch (error) {
        console.error("not fetching leads");
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

  // Breadcrumb name
  const breadcrumbItems = [
    { label: "Dashboard", Link: "/", href: "" },
    { label: "Leads", href: "", isLast: true },
  ];

  // table data get
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
      label: "Lead Name",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const lead = leads[dataIndex];
          return (
            <div>
              <Link
                to={`/leaddetail/${lead._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {lead.name}
              </Link>
            </div>
          );
        },
      },
    },
    {
      name: "contactinfo",
      label: "Lead Contact",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const lead = leads[dataIndex];
          return <div style={{ textAlign: "center" }}>{lead.contactinfo}</div>;
        },
      },
    },
    {
      name: "leadsource",
      label: "Lead Source",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const lead = leads[dataIndex];
          return <div style={{ textAlign: "center" }}>{lead.leadsource}</div>;
        },
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const lead = leads[dataIndex];
          return <div style={{ textAlign: "center" }}>{lead.status}</div>;
        },
      },
    },
    {
      name: "created_by",
      label: "Created",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const lead = leads[dataIndex];
          return <div style={{ textAlign: "center" }}>{lead.created_by?.name}</div>;
        },
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const lead = leads[dataIndex];
          return (
            <div>
              {isAdminOrManager && (
                <IconButton
                  sx={{ paddingRight: "14px" }}
                  onClick={() => handleOpen(lead._id)}
                >
                  <AssignmentIcon sx={{ color: "#1f283e", fontSize: "27px" }} />
                </IconButton>
              )}
              <Link to={`/editlead/${lead._id}`}>
                <IconButton color="primary">
                  <BorderColorOutlinedIcon
                    sx={{ color: "blue", fontSize: 26 }}
                  />
                </IconButton>
              </Link>
              {lead.created_by.id === user?.id ||
              ["Admin", "Manager"].includes(user?.role) ? (
                <IconButton
                  color="secondary"
                  onClick={() => handleDialogOpen(lead._id)}
                >
                  <DeleteOutlineOutlinedIcon
                    sx={{ color: "red", fontSize: 30 }}
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
    rowsPerPage: 4,
    rowsPerPageOptions: [4, 10, 25, 50],
    search: true,
    download: false,
    print: false,
    viewColumns: true,
    pagination: true,
    sort: true,
  };

  return (
    <Box sx={{ width: "90%", marginLeft: 9, marginTop: 9 }}>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
      <Box>
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
            <Link to="/addlead">
              <Button
                sx={{
                  backgroundColor: "#a5bae5",
                  color: "#1f283e",
                  paddingInline: 2,
                }}
              >
                Add Lead
              </Button>
            </Link>
          </Box>
        </Box>

        {/* Table Container */}
        <Box sx={{ marginLeft: 10, marginTop: 3 }}>
          <MUIDataTable
            title="Lead List"
            data={leads}
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
                onClick={handleAssignLead}
              >
                Assign
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Delete Dialog */}
        <CustomDialog
          open={dialogOpen}
          handleClose={() => setDialogOpen(false)}
          title="Confirm Action"
          content="Are you sure you want to delete this lead?"
          onConfirm={() => handleDelete(leadToDelete)}
          btn="Delete"
        />
      </Box>
    </Box>
  );
}

export default Lead;
