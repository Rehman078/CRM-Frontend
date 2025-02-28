import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import CustomModal from "../../components/CustomModel";
import {
  Box,
  Link,
  Breadcrumbs,
  Typography,
  Grid,
  Card,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { ToastContainer, toast } from "react-toastify";
import { getStageByPiplineId, addStage, deleteStage } from "../../services/StageAPi";
import CustomDeleteDialog from "../../components/CustomDialog";
function Stage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [stages, setStages] = useState([]);
  const [open, setOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [stageToDelete, setStageToDelete] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      stage: "",
      pipline_id: id,
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePipline = async (data) => {
    try {
      await addStage(data);
      toast.success("Stage is added successfully");
      fetchStages();
      handleClose();
      reset();
    } catch (error) {
      console.error("Error fetching stages:", error.message);
    }
  };

  //delete stage
  const handleDelete = async (stageToDelete) => {
    try {
      console.log(stageToDelete);
      await deleteStage(stageToDelete);
      setStages((prevStage) =>
        prevStage.filter((stage) => stage._id !== stageToDelete)
      );
      setDialogOpen(false);
      setStageToDelete(null);
      toast.success("Stage deleted successfully.");
    } catch (error) {
      toast.error("Error deleting stage.");
    }
  };
  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDialogOpen = (stageId) => {
    setStageToDelete(stageId);
    setDialogOpen(true);
  };

  // Fetch stages
  const fetchStages = async () => {
    try {
      const response = await getStageByPiplineId(id);
      setStages(response.data);
    } catch (error) {
      console.error("Error fetching stages:", error.message);
    }
  };

  useEffect(() => {
    fetchStages();
  }, [id]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Stages", isLast: true },
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
      </Box>

      {/* Pipeline Name (Displayed Once) */}
      {stages.length > 0 && stages[0]?.pipline_id?.name && (
        <Typography
          variant="h6"
          sx={{ paddingBottom: 2, paddingLeft: 2, fontWeight: "bold" }}
        >
          Pipeline Name: {stages[0]?.pipline_id?.name}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "end", marginBottom: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#a5bae5" }}
          onClick={handleOpen}
        >
          Add Stage
        </Button>
      </Box>

      {/* Stages Grid */}
      <Card sx={{ marginLeft: 8 }}>
        {stages.length > 0 ? (
          <Grid container spacing={3} sx={{ padding: 2 }}>
            {stages.map((stage, index) => (
              <Grid item xs={12} sm={4} md={3} key={index}>
                <Box
                  sx={{
                    boxShadow: 1,
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "#a5bae5",
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "20px",
                      padding: 3,
                      borderRadius: 2,
                    }}
                  >
                    {stage.stage}
                  </Typography>
                  <Box>
                    <IconButton
                      sx={{ marginTop: "6px", marginRight: "5px" }}
                      onClick={() => handleDialogOpen(stage._id)}
                    >
                      <DeleteOutlineOutlinedIcon
                        sx={{ color: "red", fontSize: "23px" }}
                      />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ padding: 2, color: "gray", textAlign: "center" }}>
            No stages available for this pipeline.
          </Typography>
        )}
      </Card>

      {/* Add Stage Modal */}
      <CustomModal
        open={open}
        handleClose={handleClose}
        title="Add Stage"
        btnName="Add Stage"
        onSubmit={handleSubmit(handlePipline)}
      >
        <TextField
          label="Stage Name"
          fullWidth
          margin="normal"
          variant="outlined"
          {...register("stage", { required: "Stage Name is required" })}
          error={!!errors.stage}
          helperText={errors.stage?.message}
        />
      </CustomModal>

      {/* Delete Dialog */}
      <CustomDeleteDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        title="Confirm Action"
        content="Are you sure you want to delete this stage?"
        onConfirm={() => handleDelete(stageToDelete)}
        btn="Delete"
      />
    </Box>
  );
}

export default Stage;
