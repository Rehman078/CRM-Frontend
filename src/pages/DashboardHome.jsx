import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContaxt";
import { Box, Grid } from "@mui/material";
import AppBarComponent from "../components/AppBar";
import DrawerComponent from "../components/SideBar";
import CardComponent from "../components/CardComponent";
import { getUsers } from "../services/AuthApi";
import { getContacts } from "../services/ContactApi";
import { getLeads } from "../services/LeadApi";
import { getOpportunities } from "../services/OpporunityApi";
export default function MiniDrawer() {
  const [userCount, setUserCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [leadCount, setLeadCount] = useState(0);
  const [opportunityCount, setOpportunityCount] = useState(0);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminOrManager = user?.role === "Admin" || user?.role === "Manager";

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  //fetch user count
  const fetchUserCount = async () => {
    try {
      const users = await getUsers();
      setUserCount(users.data.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  //fetch contact count
  const fetchContactCount = async () => {
    try {
      const contacts = await getContacts();
      setContactCount(contacts.data.length);
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  };

  //fetch lead count
  const fetchLeadCount = async () => {
    try {
      const leads = await getLeads();
      setLeadCount(leads.data.length);
    } catch (error) {
      console.error("Error fetching lead:", error);
    }
  };

  
  //fetch lead count
  const fetchOpporunityCount = async () => {
    try {
      const opportunites = await getOpportunities();
      setOpportunityCount(opportunites.data.length);
    } catch (error) {
      console.error("Error fetching opportunity:", error);
    }
  };
  useEffect(() => {
    fetchUserCount();
    fetchContactCount();
    fetchLeadCount();
    fetchOpporunityCount();
  }, []);

  const cardData = [
    ...(isAdminOrManager
      ? [{ title: "User", count: `${userCount}`, content: "Manage CRM users." }]
      : []),
    {
      title: "Contact",
      count: `${contactCount}`,
      content: "Manage your contacts.",
    },
    {
      title: "Lead",
      count: `${leadCount}`,
      content: "Track potential customers.",
    },
    {
      title: "Opportunity",
      count: `${opportunityCount}`,
      content: "Identify new business deals.",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: "73px",
          marginTop: "64px",
          width: "calc(100% - 73px)",
        }}
      >
        <Grid
          container
          spacing={3}
          justifyContent="center"
        >
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <CardComponent
                title={card.title}
                count={card.count}
                content={card.content}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
