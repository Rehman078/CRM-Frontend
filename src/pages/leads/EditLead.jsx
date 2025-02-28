import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { getLeadsById, updateLead } from "../../services/LeadApi";

function EditLead() {
  const { logout } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      contactinfo: "",
      leadsource: "",
      status: "",
    },
  });

  // Watch status field to track changes
  const selectedStatus = watch("status");

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await getLeadsById(id);
        const lead = response.data[0];
        Object.keys(lead).forEach((key) => setValue(key, lead[key]));
      } catch (error) {
        console.error("Failed to fetch lead.");
      }
    };
    fetchLead();
  }, [id, setValue]);

  const handleLead = async (data) => {
    try {
      await updateLead(id, data);
      toast.success("Lead updated successfully!", {
        onClose: () => navigate("/leads"), 
      });
    } catch (error) {
      toast.error("Failed to update lead.");
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Edit Lead", href: "", isLast: true },
  ];

  return (
    <Box>
      <AppBarComponent handleLogout={logout} />
      <DrawerComponent />
      <ToastContainer position="top-right" autoClose={2000} />
      <Box
        sx={{
          marginTop: 10,
          marginLeft: 10,
        }}
      >
        {/* Breadcrum */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#d1c4e9" }}>
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
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Card sx={{ marginTop: 8, maxWidth: 900, padding: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Update Lead
            </Typography>
            <form onSubmit={handleSubmit(handleLead)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Lead Name"
                    fullWidth
                    margin="normal"
                      variant="standard"
                    {...register("name", { required: "Lead Name is required" })}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact No."
                    fullWidth
                    margin="normal"
                      variant="standard"
                    {...register("contactinfo", {
                      required: "Contact No. is required",
                    })}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.contactinfo}
                    helperText={errors.contactinfo?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Lead Source"
                    fullWidth
                    margin="normal"
                      variant="standard"
                    {...register("leadsource", {
                      required: "Lead Source is required",
                    })}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.leadsource}
                    helperText={errors.leadsource?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    margin="normal"
                      variant="standard"
                    
                    error={!!errors.status}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedStatus || ""}
                      {...register("status", {
                        required: "Status is required",
                      })}
                      onChange={(e) => setValue("status", e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Contacted">Contacted</MenuItem>
                      <MenuItem value="Qualified">Qualified</MenuItem>
                      <MenuItem value="Lost">Lost</MenuItem>
                    </Select>

                    {errors.status && (
                      <FormHelperText>{errors.status.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Box
                  sx={{
                    marginTop: 3,
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Button
                    type="submit"
                    sx={{
                      backgroundColor: "#a5bae5",
                      color: "#1f283e",
                      paddingInline: 2,
                      paddingBlock: 1,
                    }}
                  >
                    Update Lead
                  </Button>
                </Box>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default EditLead;
