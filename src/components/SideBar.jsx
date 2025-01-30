import React from "react";
import { Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import ContactsIcon from "@mui/icons-material/Contacts";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Divider from "@mui/material/Divider";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

const drawerWidth = 240;
const closedWidth = 70;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  width: closedWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  maxidth: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    backgroundColor: "#3f51b5",
    ...(open ? openedMixin(theme) : closedMixin(theme)),
  },
}));

export default function DrawerComponent({ open, handleDrawerClose }) {
  const theme = useTheme();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Link to={"/"}>
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton sx={{ minHeight: 48, px: 2.5 }}>
              <ListItemIcon
                sx={{ minWidth: 0, justifyContent: "center", color: "white" }}
              >
                <InboxIcon />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                sx={{
                  paddingLeft: open ? 2 : 4,
                  color: "white",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Link>
      <Divider />
      <Link to={"/contacts"}>
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton sx={{ minHeight: 48, px: 2.5 }}>
              <ListItemIcon
                sx={{ minWidth: 0, justifyContent: "center", color: "white" }}
              >
                <ContactsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Contact"
                sx={{
                  paddingLeft: open ? 2 : 4,
                  color: "white",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Link>
      <Divider />
      <Link to={"/file"}>
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton sx={{ minHeight: 48, px: 2.5 }}>
              <ListItemIcon
                sx={{ minWidth: 0, justifyContent: "center", color: "white" }}
              >
                <TextSnippetIcon />
              </ListItemIcon>
              <ListItemText
                primary="File"
                sx={{
                  paddingLeft: open ? 2 : 4,
                  color: "white",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Link>
      <Divider />
      <Link to={"/lead"}>
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton sx={{ minHeight: 48, px: 2.5 }}>
              <ListItemIcon
                sx={{ minWidth: 0, justifyContent: "center", color: "white" }}
              >
                <TextSnippetIcon />
              </ListItemIcon>
              <ListItemText
                primary="Lead"
                sx={{
                  paddingLeft: open ? 2 : 4,
                  color: "white",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Link>
      <Divider />
    </Drawer>
  );
}
