import React from "react";
import logo from "../assets/crm.png";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Group } from "@mui/icons-material";
import TrackChangesIcon from '@mui/icons-material/TrackChanges';


const drawerWidth = 73;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: "#f0efef",
  },
});

export default function DrawerComponent() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminOrManager = user?.role === "Admin" || user?.role === "Manager";
  return (
    <Drawer variant="permanent">
      <Link to="/">
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{
            width: "90px",
            height: "70px",
          }}
        />
      </Link>
      <Divider />
      <List>
        <Link to="/" style={{ textDecoration: "none" }}>
          <ListItem disablePadding>
            <ListItemButton sx={{ flexDirection: "column" }}>
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <DashboardIcon sx={{ color: "#1f283e", fontSize: 30 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      color: "#1f283e",
                      textAlign: "center",
                    }}
                  >
                    Dashboard
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </Link>
        <Divider />
        <Link to="/contacts" style={{ textDecoration: "none" }}>
          <ListItem disablePadding>
            <ListItemButton sx={{ flexDirection: "column" }}>
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <PersonIcon sx={{ color: "#1f283e", fontSize: 30 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      color: "#1f283e",
                      textAlign: "center",
                    }}
                  >
                    Contacts
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </Link>
        <Divider />
        <Link to="/leads" style={{ textDecoration: "none" }}>
          <ListItem disablePadding>
            <ListItemButton sx={{ flexDirection: "column" }}>
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <TrendingUpIcon sx={{ color: "#1f283e", fontSize: 30 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      color: "#1f283e",
                      textAlign: "center",
                    }}
                  >
                    Leads
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </Link>
        <Divider />
        {isAdminOrManager && (
          <>
            <Link to="/pipline" style={{ textDecoration: "none" }}>
              <ListItem disablePadding>
                <ListItemButton sx={{ flexDirection: "column" }}>
                  <ListItemIcon sx={{ minWidth: "auto" }}>
<TrackChangesIcon sx={{ color: "#1f283e", fontSize: 30 }} /> 
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          color: "#1f283e",
                          textAlign: "center",
                        }}
                      >
                        Pipline
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider />
            <Link to="/opportunity" style={{ textDecoration: "none" }}>
              <ListItem disablePadding>
                <ListItemButton sx={{ flexDirection: "column" }}>
                  <ListItemIcon sx={{ minWidth: "auto" }}>
                    <Group sx={{ color: "#1f283e", fontSize: 30 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          color: "#1f283e",
                          textAlign: "center",
                        }}
                      >
                        Opporunity
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider />
          </>
        )}
      </List>
    </Drawer>
  );
}
