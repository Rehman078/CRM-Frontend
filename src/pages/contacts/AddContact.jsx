import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  Chip,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link,
  FormHelperText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { useAuth } from "../../context/AuthContaxt";
import { addContacts } from "../../services/ContactApi";

function AddContact() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

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

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle contact form submit
  const handleContact = async (data) => {
    data.tags = tags; // Assign tags array to form data
    try {
      await addContacts(data);
      toast.success("Contact added successfully!", {
        onClose: () => navigate("/contacts"), 
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add contact. Please try again."
      );
    }
  };

  // Handle adding tags
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setValue("tags", [...tags, tagInput.trim()]); // Update react-hook-form state
      setTagInput(""); // Clear input field
    }
  };

  // Handle removing tags
  const handleDeleteTag = (tagToDelete) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(newTags);
    setValue("tags", newTags); // Update react-hook-form state
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
      <Box sx={{ marginTop: 10, marginLeft: 10 }}>
        {/* Breadcrumb */}
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
        <ToastContainer position="top-right" autoClose={2000} />
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: 900,
            padding: 3,
            margin: "auto",
            mt: 5,
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
                    variant="standard"
                    {...register("name", { required: "Name is required" })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    variant="standard"
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
                    variant="standard"
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
                    variant="standard"
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
                    variant="standard"
                    {...register("company", {
                      required: "Company is required",
                    })}
                    error={!!errors.company}
                    helperText={errors.company?.message}
                  />
                </Grid>

                {/* Tags Input Field */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Tags"
                      variant="standard"
                      fullWidth
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleAddTag}>
                              <AddIcon sx={{ color: "#a5bae5" }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {tags.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          padding: 1,
                          maxHeight: 70,
                          overflowY: "auto",
                        }}
                      >
                        {tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            onDelete={() => handleDeleteTag(tag)}
                            sx={{ height: 24 }}
                          />
                        ))}
                      </Box>
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
