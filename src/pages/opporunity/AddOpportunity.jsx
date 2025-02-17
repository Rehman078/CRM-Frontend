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
import { Toaster, toast } from "react-hot-toast";
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
} from "@mui/material";

function AddOpportunity() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [type, setType] = useState("Contact");

  // Fetch contacts and leads from API
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

    fetchContacts();
    fetchLeads();
  }, []);

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Breadcrumb name
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Add Opportunity", href: "", isLast: true },
  ];

  const {
    control,
    handleSubmit,
    setValue,
    setError,
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
      console.log(data);
      await AddOpportunites(data);
      navigate("/opportunity")
      toast.success("Opportunity Add successfully");
    } catch (error) {
      toast.error("failed to add Oppoounity", error.message);
    }
  };

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
        <Toaster position="top-right" reverseOrder={false} />
        <Card
          sx={{
            margin: "auto",
            marginTop: 3,
            marginBottom: 3,
            maxWidth: 700,
            paddingBlock: 1,
            paddingInline: 3,
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Add New Opportunity
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <TextField
                label="Company"
                fullWidth
                margin="normal"
                name="name"
                variant="outlined"
                {...register("name", {
                  required: "Opportunity Name is required",
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              {/* Expected Revenue */}
              <TextField
                label="Expected Revenue"
                fullWidth
                margin="normal"
                name="expected_revenue"
                variant="outlined"
                {...register("expected_revenue", {
                  required: "Expected Revenue is required",
                })}
                error={!!errors.expected_revenue}
                helperText={errors.expected_revenue?.message}
              />

              {/* Close Date */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="close_date"
                  control={control}
                  rules={{ required: "Close Date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Close Date"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) =>
                        field.onChange(date ? date.format("DD-MM-YYYY") : null)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          error={!!errors.close_date}
                          helperText={errors.close_date?.message}
                        />
                      )}
                      // This sx prop forces the DatePicker to take up 100% width
                      sx={{ width: "100%", marginBottom: 2, marginTop: 2 }}
                    />
                  )}
                />
              </LocalizationProvider>

              {/* Type Selector: Contact or Lead */}

              <FormControl fullWidth>
                <InputLabel id="type-label">Type</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="type-label"
                      label="Type"
                      onChange={(event) => {
                        field.onChange(event); // Update form state
                        handleTypeChange(event); // Update local state
                      }}
                    >
                      <MenuItem value="Contact">Contact</MenuItem>
                      <MenuItem value="Lead">Lead</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              {/* Conditional Dropdown for Contact or Lead */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="contact-lead-label">{type} Name</InputLabel>
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="contact-lead-label"
                      label={`${type} Name`}
                    >
                      {(type === "Contact" ? contacts : leads).map((item) => (
                        <MenuItem key={item.id} value={item._id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              {/* Submit Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  mt: 1,
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
                  Add Opportunity
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default AddOpportunity;
