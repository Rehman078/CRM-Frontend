import React, { useState, useEffect, useMemo } from "react";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MaterialReactTable } from "material-react-table";

import {
  getPiplines,
  addPiplines,
  deletePiplines,
} from "../../services/PiplineApi";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import CustomDeleteDialog from "../../components/CustomDialog";
import CustomModal from "../../components/CustomModel";
import "../../table.css"
import FolderOffIcon from '@mui/icons-material/FolderOff';
function Pipline() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [piplines, setPiplines] = useState([]);
    const [selectedRows, setSelectedRows] = useState({});
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
  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
      size: 5,
      Cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: "Pipeline Name",
      size: 40,
      Cell: ({ row }) => (
        <Link to={`/stage/${row.original._id}`}>
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "created_by",
      header: "Created By",
      size: 40,
      Cell: ({ row }) => (
        <div>{row.original.created_by?.name || "Unknown"}</div>
      ),
    },
    {
      accessorKey: "opporunity",
      header: "Opportunity",
      Cell: ({ row }) => {
        const pipeline = row.original;
        return (
          <div>
            <Link to={`/add/opportunity/${pipeline._id}`}>
              <IconButton color="primary">
                <AddTaskOutlinedIcon sx={{ color: "blue", fontSize: 26 }} />
              </IconButton>
            </Link>

            <Link to={`/opportunity/${pipeline._id}`}>
              <IconButton color="primary">
                {/* <AddTaskOutlinedIcon sx={{ color: "blue", fontSize: 26 }} /> */}
                <VisibilityIcon sx={{ color: "blue", fontSize: 26 }} />
              </IconButton>
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => {
        const pipeline = row.original;
        return (
          <div>
            <IconButton onClick={() => handleDialogOpen(pipeline._id)}>
              <DeleteOutlineOutlinedIcon
                sx={{ color: "red", fontSize: "25px" }}
              />
            </IconButton>
          </div>
        );
      },
    },
  ], []);


  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Pipline", isLast: true },
  ];
  return (
    <Box sx={{ width: "90%", marginLeft: 9, marginTop: 9 }}>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
     <ToastContainer position="top-right" autoClose={2000} />
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
      <MaterialReactTable
            columns={columns}
            data={piplines}
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
                  No Pipeline Available
                </Typography>
              </Box>
            )}
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
