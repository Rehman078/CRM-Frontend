import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { getLeadsById, updateLead } from "../../services/LeadApi";
function EditLead() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [formData, setFormData] = useState({
    name: "",
    contactinfo: "",
    leadsource: "",
    status: "New",
  });

  useEffect(() => {

    const fetchLead = async () => {
      try {
        const response = await getLeadsById(id);
        setFormData(response.data);
      } catch (error) {
        toast.error("Failed to fetch lead.");
      }
    };
    fetchLead();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.contactinfo ||
      !formData.leadsource ||
      !formData.status
    ) {
      toast.error("All fields are required.");
      return;
    }
    try {
      await updateLead(id, formData);
      toast.success("Lead updated successfully.");
      navigate("/lead");
    } catch (error) {
      toast.error("Failed to update lead.");
    }
  };

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
        <Toaster position="top-right" reverseOrder={false} />
        <Card sx={{ margin: "auto", marginTop: 10, maxWidth: 900, padding: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Update Lead
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
