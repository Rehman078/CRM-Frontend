import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import {
  Box,
  Button,
  Breadcrumbs,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import BreadLink from "@mui/material/Link";
import { Link } from "react-router-dom";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MUIDataTable from "mui-datatables";
import {
  getPiplines,
  addPiplines,
  deletePiplines,
} from "../../services/PiplineApi";
import { Toaster, toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import CustomDeleteDialog from "../../components/CustomDialog";
import CustomModal from "../../components/CustomModel";

function Pipline() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [piplines, setPiplines] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [piplineToDelete, setPiplineToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { name: "" },
  });

  // Open Add Pipline Modal
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => {
    setOpenModel(false);
    reset();
  };

  // Open Delete Confirmation Dialog
  const handleDialogOpen = (piplineId) => {
    setPiplineToDelete(piplineId);
    setDialogOpen(true);
  };

  // Logout Function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Add Pipline
  const handlePipline = async (data) => {
    try {
      await addPiplines(data);
      handleClose();
      fetchPipline();
      toast.success("Pipline added successfully");
    } catch (error) {
      toast.error("Error adding pipline: " + error.message);
    }
  };

  // Delete Pipline
  const handleDelete = async () => {
    try {
      await deletePiplines(piplineToDelete);
      setPiplines((prevPiplines) =>
        prevPiplines.filter((pipline) => pipline._id !== piplineToDelete)
      );
      setDialogOpen(false);
      setPiplineToDelete(null);
      toast.success("Pipline deleted successfully.");
    } catch (error) {
      toast.error("Error deleting pipline.");
    }
  };

  // Fetch Piplines
  const fetchPipline = async () => {
    try {
      const response = await getPiplines();
      setPiplines(response.data);
    } catch (error) {
      console.error("Error fetching pipline: " + error.message);
    }
  };

  useEffect(() => {
    fetchPipline();
  }, []);

  // Table Columns
  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        customBodyRenderLite: (dataIndex) => <div>{dataIndex + 1}</div>,
      },
    },
    {
      name: "name",
      label: "Pipline Name",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const pipline = piplines[dataIndex];
          return <Link to={`/stage/${pipline._id}`}>{pipline.name}</Link>;
        },
      },
    },
    {
      name: "created",
      label: "Created By",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const pipline = piplines[dataIndex];
          return <div>{pipline.created_by.name}</div>;
        },
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const pipline = piplines[dataIndex];
          return (
          <>
            <IconButton onClick={() => handleDialogOpen(pipline._id)}>
              <DeleteOutlineOutlinedIcon
                sx={{ color: "red", fontSize: "30px" }}
              />
            </IconButton>
            <Link to={`/add/opportunity/${pipline._id}`}>
        <IconButton color="primary">
          <AddTaskOutlinedIcon sx={{ color: "blue", fontSize: 26 }} />
        </IconButton>
      </Link>
          </>
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
    { label: "Dashboard", href: "/" },
    { label: "Pipline", isLast: true },
  ];
  return (
    <Box sx={{ width: "90%", marginLeft: 9, marginTop: 9 }}>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
      <Toaster position="top-right" reverseOrder={false} />
      {/* Breadcrumbs */}
      <Box sx={{ paddingBottom: 2, paddingLeft: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
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
      </Box>
      <Box sx={{ display: "flex", justifyContent: "end", paddingBottom: 2 }}>
        <Button
          sx={{
            backgroundColor: "#a5bae5",
            color: "#1f283e",
            paddingInline: 2,
          }}
          onClick={handleOpen}
        >
          Add Pipline
        </Button>
      </Box>

      {/* Piplines Table */}
      <Box sx={{ marginLeft: 8 }}>
        <MUIDataTable
          title="Pipline List"
          data={piplines}
          columns={columns}
          options={options}
        />
      </Box>

      {/* Add Pipline Modal */}
      <CustomModal
        open={openModel}
        handleClose={handleClose}
        title="Add Pipline"
        btnName="Add Pipline"
        onSubmit={handleSubmit(handlePipline)}
      >
        <TextField
          label="Pipline Name"
          fullWidth
          margin="normal"
          variant="outlined"
          {...register("name", { required: "Pipline Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </CustomModal>

      {/* Delete Confirmation Dialog */}
      <CustomDeleteDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        title="Confirm Action"
        content="Are you sure you want to delete this pipline?"
        onConfirm={handleDelete}
        btn="Delete"
      />
    </Box>
  );
}

export default Pipline;
