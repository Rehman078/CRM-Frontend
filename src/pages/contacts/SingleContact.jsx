import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { deepOrange } from "@mui/material/colors";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Grid,
  Tab,
  Avatar,
  Stack,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { useAuth } from "../../context/AuthContaxt";
import { getcontactsById } from "../../services/ContactApi";
import { addNote } from "../../services/NoteApi";
import { addFiles } from "../../services/FileApi";

function SingleContact() {
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [contact, setContact] = useState(null);

  //tab value
  const [value, setValue] = useState("1");

  //for add note
  const [note, setNote] = useState({
    note: "",
    note_type: "Contact",
    note_to: id,
  });

  //for add file
  const [fileData, setFileData] = useState({
    files: [],
    source: "Contact",
    source_id: id,
  });

  //change tab value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Fetch contact data using getcontactsById
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const data = await getcontactsById(id);
        setContact(data.data[0]);
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    };

    fetchContact();
  }, [id]);

  // Handle note change
  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

  // Handle note form submission
  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!note.note) {
      toast.error("Please enter a note");
      return;
    }
    try {
      await addNote(note);
      toast.success("Note added successfully.");
      setNote({ ...note, note: "" });
    } catch (error) {
      toast.error("Failed to add note.");
    }
  };

  // Handle file selection
  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFileData({ ...fileData, files: selectedFiles });
  };

  //for add files
  const handleFilesSubmit = async (event) => {
    event.preventDefault();
    if (fileData.files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    try {
      const formData = new FormData();
      // Append files
      fileData.files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("source", fileData.source);
      formData.append("source_id", fileData.source_id);

      await addFiles(formData);

      toast.success("Files uploaded successfully!");
      setFileData({ ...fileData, files: [] });
    } catch (error) {
      toast.error("Failed to upload files.");
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
      <Toaster position="top-right" reverseOrder={false} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          textAlign: "left",
          marginLeft: open ? 30 : 9,
          transition: "margin 0.3s ease",
          marginTop: 8,
        }}
      >
        <Paper
          elevation={5}
          sx={{
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            minHeight: "83vh",
            paddingTop: 6,
            paddingInline: 8,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {contact ? (
                <>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Contact Details
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Name:</strong> {contact.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Email:</strong> {contact.email}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Contact No:</strong> {contact.phone}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Address:</strong> {contact.address}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Company Name:</strong> {contact.company}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Created By:</strong> {contact.created_by.name}
                  </Typography>

                  {/* Displaying multiple assigned people */}
                  {contact.assigned_to && contact.assigned_to.length > 0 ? (
                    <>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Assigned To:</strong>
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {contact.assigned_to.map((person, index) => (
                          <Tooltip key={index} title={person.name} arrow>
                            <Avatar sx={{ bgcolor: deepOrange[500] }}>
                              {person.name.split("")[0]}{" "}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </Stack>
                    </>
                  ) : (
                    <Typography variant="body1" color="gray">
                      No one assigned yet.
                    </Typography>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70vh",
                    width: "100%",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Grid>
            {/* tab section 2 */}
            <Grid item xs={6}>
              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Note" value="1" />
                      <Tab label="File" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <Box
                      sx={{
                        marginTop: 4,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "end",
                      }}
                    >
                      <form onSubmit={handleNoteSubmit}>
                        {/* Note textarea */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            position: "relative",
                            paddingBottom: "20px",
                          }}
                        >
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Write a note"
                            variant="outlined"
                            name="note"
                            value={note.note}
                            onChange={handleNoteChange}
                            sx={{
                              borderRadius: "30px",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "30px",
                              },
                            }}
                          />
                          <Button
                            type="submit"
                            color="primary"
                            sx={{
                              position: "absolute",
                              right: 0,
                              bottom: 25,
                              borderRadius: "25px",
                              backgroundColor: "transparent",
                              color: "primary.main",
                              boxShadow: "none",
                              "&:hover": {
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              },
                            }}
                            disabled={!note.note}
                          >
                            <SendIcon />
                          </Button>
                        </Box>
                      </form>
                    </Box>
                  </TabPanel>
                  <TabPanel value="2">
                    <Box sx={{ marginTop: 3 }}>
                      <form onSubmit={handleFilesSubmit}>
                        <input
                          accept="image/*, .pdf, .docx, .txt"
                          style={{ display: "none" }}
                          id="file-upload"
                          type="file"
                          name="files"
                          onChange={handleFileUpload}
                          multiple
                        />
                        <label htmlFor="file-upload">
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                            sx={{
                              borderRadius: 0,
                              width: 80,
                              height: 39,
                              boxShadow: 5,
                            }}
                          >
                            <FilePresentIcon sx={{ fontSize: 30 }} />
                          </IconButton>
                        </label>
                        <Button type="submit" variant="outlined" sx={{ ml: 2 }}>
                          Upload
                        </Button>
                      </form>
                      {fileData.files.length > 0 && (
                        <List sx={{ mt: 1 }}>
                          {fileData.files.map((file, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <InsertDriveFileIcon sx={{ color: "blue" }} />
                              </ListItemIcon>

                              <Alert icon={false} severity="success">
                                {file.name}
                              </Alert>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  </TabPanel>
                </TabContext>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default SingleContact;
