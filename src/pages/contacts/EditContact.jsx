import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { getContactsById, updateContact } from "../../services/ContactApi";
import { Toaster, toast } from "react-hot-toast";

function EditContact() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    tags: [],
  });
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Handle drawer opening and closing
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  //get contact data by id
  useEffect(() => {
    const fetchContactsData = async () => {
      try {
        const contacts = await getContactsById();

        const contact = contacts.find((contact) => contact._id === id);
        if (contact) {
          setFormData(contact);
        } else {
          console.error("Contact not found for ID:", id);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error.message);
      }
    };

    fetchContactsData();
  }, [id]);

  // Handle form submission for contact update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateContact(id, formData);
      toast.success("Contact updated successfully!");
    } catch (error) {
      console.error("Error updating contact", error);
    }
  };

     // Breadcrumb name
     const breadcrumbItems = [
      { label: "Dashboard", Link: "/", href: "" },
      { label: "Edit Lead", href: "", isLast: true },
    ];
  return (
    <Box sx={{ display: "flex" }}>
      <AppBarComponent
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleLogout={handleLogout}
      />
      <DrawerComponent open={open} handleDrawerClose={handleDrawerClose} />
      <Toaster position="top-right" reverseOrder={false} />
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

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Tags</InputLabel>
                    <Select
                      multiple
                      name="tags"
                      value={formData.tags || []} // Ensure it's always an array
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
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
                    Save Changes
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
