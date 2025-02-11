import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link,
  FormHelperText,
} from "@mui/material";
import { addContacts } from "../../services/ContactApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";

function AddContact() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      company: "",
      tags: [],
    },
  });

  //logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle contact form submit
  const handleContact = async (data) => {
    try {
      await addContacts(data);
      toast.success("Contact added successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add contact. Please try again."
      );
    }
  };

  // Breadcrumb name
  const breadcrumbItems = [
    { label: "Dashboard", Link: "/", href: "" },
    { label: "Add Contact", href: "", isLast: true },
  ];

  return (
    <Box>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
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
        <Toaster position="top-right" reverseOrder={false} />
        <Card
          sx={{
            margin: "auto",
            marginTop: 6,
            maxWidth: 900,
            paddingBlock: 3,
            paddingInline: 2,
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Add New Contact
            </Typography>
            <form onSubmit={handleSubmit(handleContact)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    name="name"
                    variant="outlined"
                    {...register("name", { required: "Name is required" })}
                    error={!!errors.name}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    name="email"
                    variant="outlined"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email format",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    fullWidth
                    margin="normal"
                    name="phone"
                    variant="outlined"
                    {...register("phone", { required: "Phone is required" })}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address"
                    fullWidth
                    margin="normal"
                    name="address"
                    variant="outlined"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company"
                    fullWidth
                    margin="normal"
                    name="company"
                    variant="outlined"
                    {...register("company", {
                      required: "Company is required",
                    })}
                    error={!!errors.company}
                    helperText={errors.company?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Tags</InputLabel>
                    <Controller
                      name="tags"
                      control={control}
                      rules={{ required: "One tag is required" }}
                      render={({ field }) => (
                        <Select
                          multiple
                          {...field}
                          error={!!errors.tags}
                          renderValue={(selected) => (
                            <div>
                              {selected.map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  sx={{ margin: 0.5 }}
                                />
                              ))}
                            </div>
                          )}
                        >
                          <MenuItem value="T1">T1</MenuItem>
                          <MenuItem value="T2">T2</MenuItem>
                          <MenuItem value="T3">T3</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.tags && (
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.tags.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      mt: 3,
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
                      Add Contact
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default AddContact;
