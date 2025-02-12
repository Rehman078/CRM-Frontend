import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { AccountCircle, Group, Person, TrendingUp } from "@mui/icons-material";

const iconMap = {
  Contact: <Person sx={{ fontSize: 40, color: "blue" }} />,
  Lead: <TrendingUp sx={{ fontSize: 40, color: "green" }} />,
  User: <AccountCircle sx={{ fontSize: 40, color: "orange" }} />,
  Opportunity: <Group sx={{ fontSize: 40, color: "purple" }} />,
};

export default function CardComponent({ title, count, content }) {
  return (
    <Card
      sx={{
        width: "300px",
        backgroundColor: "#F0EFEF",
        color: "black",
        textAlign: "center",
        p: 1,
        borderRadius: 2,
      }}
    >
      <CardContent>
        {iconMap[title] || (
          <AccountCircle sx={{ fontSize: 40, color: "gray" }} />
        )}

        <Typography
          gutterBottom
          sx={{ fontSize: 18, fontWeight: "bold", mt: 1 }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            height: "50px",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#e3e3e3",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              fontWeight: "bold",
              color: "#1f283e",
            }}
          >
            {count}
          </Box>
        </Box>

        <Typography variant="body2">{content}</Typography>
      </CardContent>
    </Card>
  );
}
