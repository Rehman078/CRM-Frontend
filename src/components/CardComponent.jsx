import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { AccountCircle, Group, Person, TrendingUp } from "@mui/icons-material";

const iconMap = {
  Contact: <Person sx={{ fontSize: 40, color: "blue" }} />,
  Lead: <TrendingUp sx={{ fontSize: 40, color: "green" }} />,
  User: <AccountCircle sx={{ fontSize: 40, color: "orange" }} />,
  Opportunity: <Group sx={{ fontSize: 40, color: "purple" }} />,
};

export default function CardComponent({ title, content }) {
  return (
    <Card
      sx={{
        width: "300px",
        backgroundColor: "#F0EFEF",
        color: "black",
        textAlign: "center",
        p: 3,
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
        <Typography variant="body2">{content}</Typography>
      </CardContent>
    </Card>
  );
}
