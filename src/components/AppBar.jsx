import React from "react";
import { useAuth } from "../context/AuthContaxt";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Button } from "@mui/material";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  marginLeft: 10,
  width: `calc(100% - 73px)`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

export default function AppBarComponent({ handleLogout }) {
  const { user } = useAuth();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#a5bae5", color: "#fff" }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Welcome, {user?.name}
        </Typography>
        <Button
          color="inherit"
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
