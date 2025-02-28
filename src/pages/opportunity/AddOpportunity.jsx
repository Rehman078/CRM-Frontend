import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { getContacts } from "../../services/ContactApi";
import { getLeads } from "../../services/LeadApi";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import { AddOpportunites } from "../../services/OpporunityApi";
import { getStageByPiplineId } from "../../services/StageAPi";
import { toast, ToastContainer } from "react-toastify";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Breadcrumbs,
  Typography,
  Grid,
} from "@mui/material";

function AddOpportunity() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Pipeline ID

  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [type, setType] = useState("Contact");
  const [stageName, setStageName] = useState(""); // Store stage name

  // Fetch contacts, leads, and stage name from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        setLeads(data.data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    const fetchStage = async () => {
      try {
        const response = await getStageByPiplineId(id); // Fetch stage by pipeline ID

        setStageName(response.data); // Set stage name
      } catch (error) {
        console.error("Error fetching stage:", error);
      }
    };

    fetchContacts();
    fetchLeads();
    fetchStage();
  }, [id]);

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      name: "",
      expected_revenue: "",
      close_date: "",
      pipelineId: id,
      type: "",
    },
  });

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setValue("assignedTo", "");
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await AddOpportunites(data);
      toast.success("Opportunity added successfully",
        {
          onClose: () => navigate("/opportunity"),
        }
      );
    } catch (error) {
      toast.error("Failed to add Opportunity", error.message);
    }
  };

  return (
    <Box>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
      <Box sx={{ marginTop: 10, marginLeft: 10 }}>
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#d1c4e9" }}>
          <Link to="/" style={{ color: "#a5bae5" }}>
            Dashboard
          </Link>
          <Typography sx={{ color: "#1F283E" }}>Add Opportunity</Typography>
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
          padding: 3,
          maxWidth: 900,
          margin: "auto",
          mt: 7,
        }}
        >
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              sx={{ paddingTop: 2}}
            >
              Add New Opportunity
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4} >
                {/* Opportunity Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={{ marginBottom: 1 }}
                    label="Opportunity Name"
                    fullWidth
                    variant="standard"
                    {...register("name", {
                      required: "Opportunity Name is required",
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                {/* Expected Revenue */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={{ marginBottom: 1 }}
                    label="Expected Revenue"
                    fullWidth
                    variant="standard"
                    type="number"
                    {...register("expected_revenue", {
                      required: "Expected Revenue is required",
                    })}
                    error={!!errors.expected_revenue}
                    helperText={errors.expected_revenue?.message}
                  />
                </Grid>
                {/* Close Date - FIXED */}
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="close_date"
                      control={control}
                      rules={{ required: "Close Date is required" }}
                      render={({ field }) => (
                        <DatePicker
                          label="Close Date"
                          value={
                            field.value
                              ? dayjs(field.value, "DD-MM-YYYY")
                              : null
                          }
                          onChange={(date) =>
                            field.onChange(
                              date ? date.format("DD-MM-YYYY") : null
                            )
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.close_date,
                              helperText: errors.close_date?.message,
                              variant: "standard",
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                {/* Stages Name */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel>Stages Name</InputLabel>
                    <Controller
                      name="stageId"
                      control={control}
                      render={({ field }) => (
                        <Select {...field}>
                          {Array.isArray(stageName) &&
                            stageName.map((item) => (
                              <MenuItem key={item._id} value={item._id}>
                                {item.stage}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Type Selector */}
                <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel>Type</InputLabel>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTypeChange(e);
                          }}
                        >
                          <MenuItem value="Contact">Contact</MenuItem>
                          <MenuItem value="Lead">Lead</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Conditional Dropdown for Contact or Lead */}
                <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel>{type} Name</InputLabel>
                    <Controller
                      name="assignedTo"
                      control={control}
                      render={({ field }) => (
                        <Select {...field}>
                          {(type === "Contact" ? contacts : leads).map(
                            (item) => (
                              <MenuItem key={item._id} value={item._id}>
                                {item.name}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 1 }}
                  >
                    <Button
                      type="submit"
                      sx={{
                        backgroundColor: "#a5bae5",
                        color: "#1f283e",
                        paddingInline: 2,
                      }}
                    >
                      Add Opportunity
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

export default AddOpportunity;
