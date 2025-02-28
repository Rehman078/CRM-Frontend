import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { deepOrange } from "@mui/material/colors";
import { DataGrid } from "@mui/x-data-grid";
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
  Breadcrumbs,
  Link,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { useAuth } from "../../context/AuthContaxt";
import { getLeadsById } from "../../services/LeadApi";
import { addNote, getNotesByLeadId } from "../../services/NoteApi";
import { getOpportuntyByLeadId } from "../../services/OpporunityApi";
import InfoModal from "../../components/InfoModal";
import {
  addFiles,
  getFilesByLeadId,
  deleteFileById,
} from "../../services/FileApi";

function SingleLead() {
  const user = JSON.parse(localStorage.getItem("user"));

  //for dashboard
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  //opporunity model
  const [open, setOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  //tab value
  const [value, setValue] = useState("1");

  //for add note
  const [note, setNote] = useState({
    note: "",
    note_type: "Lead",
    note_to: id,
  });

  //for add file
  const [fileData, setFileData] = useState({
    files: [],
    source: "Lead",
    source_id: id,
  });

  //for file geting
  const [files, setFiles] = useState([]);

  //opporunity model
  const handleOpen = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedOpportunity(null);
  };
  //change tab value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
      fetchNote();
      toast.success("Note added successfully.");
      setNote({ ...note, note: "" });
    } catch (error) {
      toast.error("Failed to add note.");
    }
  };

  const fetchNote = async () => {
    try {
      const response = await getNotesByLeadId(id);
      console.log(response.data);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  };

  // Handle file selection
  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFileData({ ...fileData, files: selectedFiles });
  };

  //for add files
  const handleFilesSubmit = async (e) => {
    e.preventDefault();
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
      fetchFile();
      toast.success("Files uploaded successfully!");
      setFileData({ ...fileData, files: [] });
    } catch (error) {
      toast.error("Failed to upload files.");
    }
  };

  //fetch file
  const fetchFile = async () => {
    try {
      const response = await getFilesByLeadId(id);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  //fetch opporuniity
  const fetchOpportunity = async () => {
    try {
      const response = await getOpportuntyByLeadId(id);
      setOpportunities(response.data);
    } catch (error) {
      console.error("Error fetching opportunity:", error);
    }
  };
  //file delete
  const handleFileDelete = async (fileId) => {
    try {
      await deleteFileById(fileId);
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
      fetchFile();
      toast.success("File deleted successfully.");
    } catch (error) {
      toast.error("Error deleting File.");
    }
  };
  // Fetch contact data using getcontactsById
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const data = await getLeadsById(id);
        setLead(data.data[0]);
      } catch (error) {
        console.error("Error fetching lead:", error);
      }
    };
    fetchLead();
    fetchNote();
    fetchFile();
    fetchOpportunity();
  }, [id]);

  const columns = [
    { field: "original_name", headerName: "Original Name", width: 200 },
    {
      field: "link",
      headerName: "File Preview",
      width: 100,
      renderCell: (params) => {
        const fileUrl = params.value;
        const isPdf = fileUrl.endsWith(".pdf");

        const handleDownload = (url) => {
          const link = document.createElement("a");
          link.href = url;
          link.download = url.split("/").pop();
          link.click();
        };

        return (
          <IconButton
            onClick={() => handleDownload(fileUrl)}
            style={{ cursor: "pointer" }}
          >
            {isPdf ? (
              <PictureAsPdfOutlinedIcon style={{ fontSize: 40 }} />
            ) : (
              <ImageOutlinedIcon style={{ fontSize: 40 }} />
            )}
          </IconButton>
        );
      },
    },
    {
      field: "uploaded_by",
      headerName: "Uploaded By",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 85,
      renderCell: (params) => {
        return (params.row.uploaded_by_role === "SalesRep" &&
          user?.role === "SalesRep") ||
          ["Admin", "Manager"].includes(user?.role) ? (
          <IconButton
            onClick={() => handleFileDelete(params.row.fileId)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        ) : null;
      },
    },
  ];

  const rows = files.map((file, index) => ({
    fileId: file._id,
    id: index,
    original_name: file.original_name,
    link: file.link,
    uploaded_by: file.uploaded_by.name,
    uploaded_by_role: file.uploaded_by.role,
    createdAt: new Date(file.createdAt).toLocaleDateString(),
  }));

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Single Lead", href: "", isLast: true },
  ];
  return (
    <Box>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
      <ToastContainer position="top-right" autoClose={2000} />
      <Box
        sx={{
          marginTop: 10,
          marginLeft: 10,
        }}
      >
        {/* Breadcrum */}
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
        <Paper
          elevation={5}
          sx={{
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            minHeight: "76vh",
            width: "85%",
            paddingTop: 6,
            paddingInline: 8,
            marginTop: 2,
            marginLeft: 8,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={5}>
              {lead ? (
                <>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Lead Details
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Name:</strong> {lead.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Contact Info:</strong> {lead.contactinfo}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Lead Source:</strong> {lead.leadsource}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Status:</strong> {lead.status}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Created By:</strong> {lead.created_by.name}
                  </Typography>

                  {/* Displaying multiple assigned people */}
                  {lead.assigned_to && lead.assigned_to.length > 0 ? (
                    <>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Assigned To:</strong>
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {lead.assigned_to.map((person, index) => (
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

                  {/* Displaying opportunity details */}
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ marginTop: 2 }}
                    gutterBottom
                  >
                    Opportunity Details
                  </Typography>

                  {opportunities && opportunities.length > 0 ? (
                    opportunities.map((opportunity) => (
                      <Typography
                        key={opportunity._id}
                        variant="body1"
                        sx={{ mb: 1 }}
                        onClick={() => handleOpen(opportunity)}
                        style={{
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                      >
                        <strong>Opportunity Name: </strong> {opportunity?.name}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body1" color="gray">
                      No opportunity available.
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
            <Grid item xs={7}>
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
                    {notes && notes.length > 0 ? (
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: 600,
                          height: "220px",
                          overflowY: "auto",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          p: 2,
                          backgroundColor: "#f5f5f5",
                          borderRadius: 2,
                        }}
                      >
                        {notes.map((note) => (
                          <Box key={note._id} sx={{ display: "flex" }}>
                            <Tooltip title={note.created_by.name} arrow>
                              <Avatar
                                sx={{
                                  bgcolor: "#1976d2",
                                  width: 32,
                                  height: 32,
                                  marginRight: 2,
                                  marginTop: 1,
                                }}
                              >
                                {note.created_by.name.charAt(0)}
                              </Avatar>
                            </Tooltip>
                            <Box
                              sx={{
                                color: "#000",
                                borderRadius: "20px",
                                padding: "8px 12px",
                                maxWidth: "80%",
                                display: "inline-block",
                                textAlign: "left",
                                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                              }}
                            >
                              <Typography variant="body1">
                                {note.note}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  opacity: 0.7,
                                  display: "block",
                                  textAlign: "end",
                                  paddingTop: "2px",
                                  fontSize: "10px",
                                  paddingLeft: 10,
                                }}
                              >
                                {new Date(note.createdAt).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      >
                        No notes available for this lead.
                      </Box>
                    )}
                    <Box
                      sx={{
                        marginTop: 4,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "end",
                      }}
                    >
                      <form onSubmit={handleNoteSubmit}>
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
                      {rows.length === 0 ? (
                        <Box sx={{ textAlign: "center", marginTop: 5 }}>
                          No files available for this lead.
                        </Box>
                      ) : (
                        <Box
                          sx={{ width: "100%", height: "300px", marginTop: 4 }}
                        >
                          <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            pagination
                          />
                        </Box>
                      )}
                    </Box>
                  </TabPanel>
                </TabContext>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      {/* Opportunity Model */}
      <InfoModal
        open={open}
        handleClose={handleClose}
        title="Opportunity Details"
      >
        {selectedOpportunity && (
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Opportunity Name:</strong>
                  </TableCell>
                  <TableCell>{selectedOpportunity.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Expected Revenue:</strong>
                  </TableCell>
                  <TableCell>{selectedOpportunity.expected_revenue}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Close Date:</strong>
                  </TableCell>
                  <TableCell>
                    {new Date(
                      selectedOpportunity.close_date
                    ).toLocaleDateString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Pipeline:</strong>
                  </TableCell>
                  <TableCell>
                    {selectedOpportunity.pipelineDetails?.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Stage:</strong>
                  </TableCell>
                  <TableCell>
                  {selectedOpportunity.stageName?.stage}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </InfoModal>
    </Box>
  );
}

export default SingleLead;
