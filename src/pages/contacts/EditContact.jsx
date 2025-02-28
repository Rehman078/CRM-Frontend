import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link,
  FormControl,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { getcontactsById, updateContact } from "../../services/ContactApi";

function EditContact() {
  const {
    register,
    handleSubmit,
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

  // State for Tags
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fetch Contact Data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await getcontactsById(id);
        const contact = response.data[0];
        Object.keys(contact).forEach((key) => setValue(key, contact[key]));
        if (contact.tags) setTags(contact.tags);
      } catch (error) {
        console.error("Error fetching contact:", error.message);
      }
    };

    fetchContactData();
  }, [id, setValue]);

  // Handle Form Submission
  const handleContact = async (data) => {
    try {
      await updateContact(id, { ...data, tags });
      toast.success("Contact updated successfully!", {
        onClose: () => navigate("/contacts"), 
      });
    } catch (error) {
      console.error("Error updating contact", error);
    }
  };

  // Handle Adding Tags
  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Handle Deleting Tags
  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Box>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
            <ToastContainer position="top-right" autoClose={2000} />
      {/* Breadcrumb Navigation */}
      <Box sx={{ marginTop: 10, marginLeft: 10 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#d1c4e9" }}>
          <Link underline="hover" sx={{ color: "#a5bae5" }} href="/">
            Dashboard
          </Link>
          <Typography sx={{ color: "#1F283E" }}>Edit Lead</Typography>
        </Breadcrumbs>
      </Box>

      {/* Form Card */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Card    sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: 900,
            padding: 3,
            margin: "auto",
            mt: 5,
          }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Edit Contact
            </Typography>

            <form onSubmit={handleSubmit(handleContact)}>
              <Grid container spacing={6}>
                {/* Name Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    fullWidth
                    variant="standard"
                    {...register("name", { required: "Name is required" })}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                {/* Email Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    variant="standard"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email format",
                      },
                    })}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>

                {/* Phone Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    fullWidth
                    variant="standard"
                    {...register("phone", { required: "Phone is required" })}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Grid>

                {/* Address Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address"
                    fullWidth
                    variant="standard"
                    {...register("address", { required: "Address is required" })}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>

                {/* Company Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company"
                    fullWidth
                    variant="standard"
                    {...register("company", { required: "Company is required" })}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.company}
                    helperText={errors.company?.message}
                  />
                </Grid>

                {/* Tags Input */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Tags"
                      variant="standard"
                      fullWidth
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleAddTag}>
                            <AddIcon sx={{ color: "#a5bae5", fontSize:"27px", marginBottom:1 }} />
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

                {/* Submit Button */}
                <Box sx={{ marginTop: 3, display: "flex", justifyContent: "center", width: "100%" }}>
                  <Button type="submit" sx={{ backgroundColor: "#a5bae5", color: "#1f283e", padding: "8px 16px" }}>
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
