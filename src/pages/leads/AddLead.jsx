import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { addleads } from "../../services/LeadApi";

function AddLead() {
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    contactinfo: "",
    leadsource: "",
    status: "New",
  });

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  if (!formData.name || !formData.contactinfo || !formData.leadsource || !formData.status) {
       toast.error("Name, Contact Info, Lead Source and Status are required.");
       return;
     }
     try{
      await addleads(formData);
      toast.success("Lead added successfully.");
     }catch(error){
        toast.error("Failed to add lead.");
      }
  };

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
        <Toaster position="top-right" reverseOrder={false} />
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

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Lead Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact No."
                    name="contactinfo"
                    value={formData.contactinfo}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                   required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Lead Source"
                    name="leadsource"
                    value={formData.leadsource}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Contacted">Contacted</MenuItem>
                      <MenuItem value="Qualified">Qualified</MenuItem>
                      <MenuItem value="Lost">Lost</MenuItem>
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
