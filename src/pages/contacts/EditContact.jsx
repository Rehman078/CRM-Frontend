import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { getcontactsById, updateContact } from "../../services/ContactApi";
import { Toaster, toast } from "react-hot-toast";

function EditContact() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
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

  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleContact = async (data) => {
    try {
      await updateContact(id, data);
      toast.success("Contact updated successfully!");
    } catch (error) {
      console.error("Error updating contact", error);
    }
  };

  //get contact data by id
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await getcontactsById(id);
        const contact = response.data[0];
        Object.keys(contact).forEach((key) => setValue(key, contact[key]));
      } catch (error) {
        console.error("Error fetching contact:", error.message);
      }
    };

    fetchContactData();
  }, [id, setValue]);

  // Breadcrumb name
  const breadcrumbItems = [
    { label: "Dashboard", Link: "/", href: "" },
    { label: "Edit Lead", href: "", isLast: true },
  ];
  return (
    <Box>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
      <Toaster position="top-right" reverseOrder={false} />
      <Box
        sx={{
          marginTop: 10,
          marginLeft: 10,
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
      <Box sx={{ display: "flex", justifyContent: "center" }}>
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
              Edit Contact
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
                    helperText={errors.name?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
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
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    {...register("phone", { required: "Phone is required" })}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company"
                    {...register("company", {
                      required: "Company is required",
                    })}
                    error={!!errors.company}
                    helperText={errors.company?.message}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Tags</InputLabel>
                    <Controller
                      name="tags"
                      control={control}
                      rules={{ required: "At least one tag is required" }}
                      render={({ field }) => (
                        <Select
                          multiple
                          {...field}
                          onChange={(e) => setValue("tags", e.target.value)}
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
                    Update Contact
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

export default EditContact;
