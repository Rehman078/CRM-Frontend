import React from "react";
import {
  Box,
  Button,
  Breadcrumbs,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
    Paper,

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";

function File() {
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  //logout function
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Files", href: "", isLast: true },
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
        {/* <Toaster position="top-right" reverseOrder={false} /> */}

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
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

          <Link to="/addcontact">
            <Button variant="contained">Add File</Button>
          </Link>
        </Box>

        {/* Table Container */}
        {/* Contacts Table */}
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Assigned</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {contacts.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No contacts available
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact, index) => ( */}
              <TableRow >
                {/* <TableCell sx={{ fontWeight: "bold" }}>{index + 1}</TableCell> */}
                <TableCell>ALi</TableCell>
              </TableRow>
              {/* ))
           )} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default File;
