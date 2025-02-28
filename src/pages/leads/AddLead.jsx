import React from "react";
import { ToastContainer, toast } from "react-toastify";
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
  Breadcrumbs,
  Link,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { addleads } from "../../services/LeadApi";

function AddLead() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      contactinfo: "",
      leadsource: "",
      status: "",
    },
  });
  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLead = async (data) => {
    try {
      await addleads(data);
      toast.success("Lead added successfully.", {
        onClose: () => navigate("/leads"), 
      });

    } catch (error) {
      toast.error("Failed to add lead.");
    }
  };

  // Breadcrumb name
  const breadcrumbItems = [
    { label: "Dashboard", Link: "/", href: "" },
    { label: "Add Lead", href: "", isLast: true },
  ];

  return (
    <Box>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
      <ToastContainer position="top-right" autoClose={2000} />
      <Box sx={{ marginTop: 10, marginLeft: 10 }}>
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
      <Box x={{ display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            margin: "auto",
            marginTop: 10,
            maxWidth: 900,
            paddingBlock: 3,
            paddingInline: 2,
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Add New Lead
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
                      {...register("status", {
                        required: "Status is required",
                      })}
                      defaultValue=""
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Contacted">Contacted</MenuItem>
                      <MenuItem value="Qualified">Qualified</MenuItem>
                      <MenuItem value="Lost">Lost</MenuItem>
                    </Select>
                    {errors.status && (
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.status.message}
                      </FormHelperText>
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
                    Add Lead
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

export default AddLead;
