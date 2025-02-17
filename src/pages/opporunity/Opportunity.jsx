import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContaxt";
import { useNavigate, Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Box, Button, Breadcrumbs, Typography , IconButton } from "@mui/material";
import BreadLink from "@mui/material/Link";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import toast, { Toaster } from "react-hot-toast";
import { getOpportunities, deleteOpportunities } from "../../services/OpporunityApi";
import CustomDeleteDialog from "../../components/CustomDialog";

function Opportunity() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [opportunites, setOpportunites] = useState([]);
const [dialogOpen, setDialogOpen] = useState(false);
  const [opportunityToDelete, setopportunityToDelete] = useState(null);

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  //dialog
  const handleDialogOpen = (opportunityId) => {
    setopportunityToDelete(opportunityId);
    setDialogOpen(true);
  };

  //delete opporunity
  const handleDelete = async (opportunityToDelete) => {
    try {
      console.log(opportunityToDelete)
      await deleteOpportunities(opportunityToDelete);
      setOpportunites((prevOpportunity) =>
        prevOpportunity.filter((opportunity) => opportunity._id !== opportunityToDelete)
      );
      setDialogOpen(false);
      setopportunityToDelete(null);
      toast.success("Opportunity deleted successfully.");
    } catch (error) {
      toast.error("Error deleting opportunity.");
    }
  };

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await getOpportunities();
        setOpportunites(response.data);
      } catch (error) {
        console.error("Failed fetching opportunites", error.message);
      }
    };

    fetchOpportunities();
  }, []);



  // Table Columns
  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        customBodyRenderLite: (dataIndex) => (
          <div style={{ textAlign: "center" }}>{dataIndex + 1}</div>
        ),
      },
    },
    {
      name: "name",
      label: "Opportunity Name",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const opportunity = opportunites[dataIndex];
          return <div style={{ textAlign: "center" }}>{opportunity.name}</div>;
        },
      },
    },
    {
      name: "expected_revenue",
      label: "Revenue",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const opportunity = opportunites[dataIndex];
          return <div style={{ textAlign: "center" }}>{opportunity.expected_revenue}</div>;
        },
      },
    },
    {
      name: "close_date",
      label: "Close Date",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const opportunity = opportunites[dataIndex];
          return (
            <div style={{ textAlign: "center" }}>
              {new Date(opportunity.close_date).toLocaleDateString("en-GB")}
            </div>
          );
        },
      },
    },
    {
      name: "type",
      label: "Opportunity Type",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const opportunity = opportunites[dataIndex];
          return <div style={{ textAlign: "center" }}>{opportunity.type}</div>;
        },
      },
    },
    {
      name: "assigned",
      label: "Opportunity Assigned",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const opportunity = opportunites[dataIndex];
          return <div style={{ textAlign: "center" }}>{opportunity.assigned.name}</div>;
        },
      },
    },
    {
      name: "stages",
      label: "Stages",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const opportunity = opportunites[dataIndex];
          return <div style={{ textAlign: "center" }}>{opportunity.stages.length}</div>;
        },
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const opportunity = opportunites[dataIndex];
          return (
            <div style={{ textAlign: "center" }}>
              <IconButton onClick={() => handleDialogOpen(opportunity._id)}>
                <DeleteOutlineOutlinedIcon sx={{ color: "red", fontSize: "30px" }} />
              </IconButton>
            </div>
          );
        },
      },
    },
  ];
  

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    selectableRows: "none",
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25, 50],
    search: true,
    download: false,
    print: false,
    viewColumns: true,
    pagination: true,
    sort: true,
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Opportunity", isLast: true },
  ];
  return (
    <Box sx={{ width: "90%", marginLeft: 9, marginTop: 9 }}>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
      <Toaster position="top-right" reverseOrder={false} />
      {/* Breadcrumbs */}
      <Box sx={{ paddingBottom: 2, paddingLeft: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbItems.map((item, index) =>
            item.isLast ? (
              <Typography key={index} sx={{ color: "#1F283E" }}>
                {item.label}
              </Typography>
            ) : (
              <BreadLink
                key={index}
                underline="hover"
                sx={{ color: "#a5bae5" }}
                href={item.href}
              >
                {item.label}
              </BreadLink>
            )
          )}
        </Breadcrumbs>
      </Box>


      {/* Opportunity Table */}
      <Box sx={{ marginLeft: 8 , marginTop:5
      }}>
        <MUIDataTable
          title="Opportunity List"
          data={opportunites}
          columns={columns}
          options={options}
        />
      </Box>
          {/* Delete Dialog */}
          <CustomDeleteDialog
          open={dialogOpen}
          handleClose={() => setDialogOpen(false)}
          title="Confirm Action"
          content="Are you sure you want to delete this opporunity?"
          onConfirm={() => handleDelete(opportunityToDelete)}
          btn="Delete"
        />
    </Box>
  );
}

export default Opportunity;
