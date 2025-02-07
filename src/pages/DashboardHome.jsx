import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContaxt";
import { Box, Grid } from "@mui/material";
import AppBarComponent from "../components/AppBar";
import DrawerComponent from "../components/SideBar";
import CardComponent from "../components/CardComponent";
export default function MiniDrawer() {
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cardData = [
    { title: "User", content: "Manage CRM users." },
    { title: "Contact", content: "Manage your contacts." },
    { title: "Lead", content: "Track potential customers." },
    { title: "Opportunity", content: "Identify new business deals." },
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
        <Grid
          container
          spacing={5}
          justifyContent="center"
          sx={{ marginTop: 6 }}
        >
          {cardData.map((card, index) => (
            <Grid item key={index}>
              <CardComponent title={card.title} content={card.content} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
