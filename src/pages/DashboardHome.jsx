import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContaxt";
import { Box, Typography } from "@mui/material";
import AppBarComponent from "../components/AppBar";
import DrawerComponent from "../components/SideBar";

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    // toast.success("Successfully logged out!");
    navigate("/");
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
        <Typography
          variant="h6"
          sx={{ backgroundColor: "#f4f4f4", marginTop: 8 }}
        >
          Dashboard
        </Typography>
      </Box>
    </Box>
  );
}
