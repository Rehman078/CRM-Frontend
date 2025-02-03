import React, { useState } from "react";
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
  Input,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { addContacts } from "../../services/ContactApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";

function AddContact() {
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    tags: [],
  });
  //logout function
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setFormData({
        ...formData,
        tags: typeof value === "string" ? value.split(",") : value,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle contact form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Name, Email, and Phone are required.");
      return;
    }

    try {
      const response = await addContacts(formData);
      toast.success("Contact added successfully!");
    } catch (error) {
      toast.error("Failed to add contact. Please try again.");
    }
  };

   // Breadcrumb name
   const breadcrumbItems = [
    { label: "Dashboard", Link: "/", href: "" },
    { label: "Add Contact", href: "", isLast: true },
  ];  
  return (
    <Box sx={{ display: "flex" }}>
      <AppBarComponent
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleLogout={handleLogout}
      />
      <DrawerComponent open={open} handleDrawerClose={handleDrawerClose} />
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
          }}
        >
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#d1c4e9" }}>
            {breadcrumbItems.map((item, index) =>
              item.isLast ? (
                <Typography key={index} sx={{ color: "white" }}>
                  {item.label}
                </Typography>
              ) : (
                <Link
                  key={index}
                  underline="hover"
                  sx={{ color: "#d1c4e9" }}
                  href={item.href}
                >
                  {item.label}
                </Link>
              )
            )}
          </Breadcrumbs>
        </Box>
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

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  {/* form */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Tags</InputLabel>
                    <Select
                      multiple
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      input={<Input />}
                      renderValue={(selected) => (
                        <div>
                          {selected.map((tag) => (
                            <Chip key={tag} label={tag} sx={{ margin: 0.5 }} />
                          ))}
                        </div>
                      )}
                    >
                      <MenuItem value="T1">T1</MenuItem>
                      <MenuItem value="T2">T2</MenuItem>
                      <MenuItem value="T3">T3</MenuItem>
                      {/* Add more tags as needed */}
                    </Select>
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
                  <Button type="submit" variant="contained">
                    Add Contact
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

export default AddContact;
