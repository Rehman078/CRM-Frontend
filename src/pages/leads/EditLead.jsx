import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
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
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const { id } = useParams();

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
      toast.success("Lead updated successfully!");
    } catch (error) {
      toast.error("Failed to update lead.");
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Edit Lead", href: "", isLast: true },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBarComponent
        open={open}
        handleDrawerOpen={() => setOpen(true)}
        handleLogout={logout}
      />
      <DrawerComponent open={open} handleDrawerClose={() => setOpen(false)} />
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
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
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
        <Toaster position="top-right" reverseOrder={false} />
        <Card sx={{ margin: "auto", marginTop: 8, maxWidth: 900, padding: 3 }}>
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
                    {...register("name", { required: "Lead Name is required" })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact No."
                    fullWidth
                    margin="normal"
                    {...register("contactinfo", {
                      required: "Contact No. is required",
                    })}
                    error={!!errors.contactinfo}
                    helperText={errors.contactinfo?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Lead Source"
                    fullWidth
                    margin="normal"
                    {...register("leadsource", {
                      required: "Lead Source is required",
                    })}
                    error={!!errors.leadsource}
                    helperText={errors.leadsource?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal" error={!!errors.status}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedStatus || ""}
                      {...register("status", { required: "Status is required" })}
                      onChange={(e) => setValue("status", e.target.value)}
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
