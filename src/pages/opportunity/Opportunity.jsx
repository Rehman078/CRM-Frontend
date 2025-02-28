import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContaxt";
import { useNavigate, Link } from "react-router-dom";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Box, Button, Breadcrumbs, Typography , IconButton } from "@mui/material";
import BreadLink from "@mui/material/Link";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import { toast, ToastContainer } from "react-toastify";
import { getOpportunities, deleteOpportunities } from "../../services/OpporunityApi";
import CustomDeleteDialog from "../../components/CustomDialog";
import { MaterialReactTable } from "material-react-table";
import FolderOffIcon from '@mui/icons-material/FolderOff';
import "../../table.css"
function Opportunity() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [opportunites, setOpportunites] = useState([]);
     const [selectedRows, setSelectedRows] = useState({});
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
    const columns = useMemo(
      () => [
        {
          accessorKey: "id",
          header: "ID",
          size: 5,
          Cell: ({ row }) => <div >{row.index + 1}</div>,
        },
        {
          accessorKey: "name",
          header: "Opportunity Name",
          size: 20,
          Cell: ({ row }) => (
             <Link to={`/opportunities/${row.original._id}`} style={{ textDecoration: "none",}}>
               {row.original.name}
             </Link>
            // <div >{row.original.name}</div>
          ),
        },
        {
          accessorKey: "expected_revenue",
          header: "Revenue",
          size: 40,
          Cell: ({ row }) => (
            <div >{row.original.expected_revenue}</div>
          ),
        },
        {
          accessorKey: "close_date",
          header: "Close Date",
          size: 40,
          Cell: ({ row }) => (
            <div >
              {new Date(row.original.close_date).toLocaleDateString("en-GB")}
            </div>
          ),
        },
        {
          accessorKey: "type",
          header: "Opportunity Type",
          size: 40,
          Cell: ({ row }) => <div >{row.original.type}</div>,
        },
        {
          accessorKey: "assigned",
          header: "Assigned To",
          size: 40,
          Cell: ({ row }) => (
            <div>{row.original?.assigned?.name || "Not Assigned"}</div>
          ),
        },
        {
          accessorKey: "Current Stage",
          header: "Current Stage",
          size: 40,
          Cell: ({ row }) => (
            <div>{row.original?.stageName?.stage}</div>
          ),
        },
        {
          accessorKey: "stages",
          header: "Stages",
          size:20,
          Cell: ({ row }) => (
            <div >{row.original.stages.length}</div>
          ),
        },
        {
          accessorKey: "actions",
          header: "Actions",
          size: 50,
          Cell: ({ row }) => {
            const opportunity = row.original;
            return (
              <div >
                <IconButton onClick={() => handleDialogOpen(opportunity._id)}>
                  <DeleteOutlineOutlinedIcon sx={{ color: "red", fontSize: "25px" }} />
                </IconButton>
              </div>
            );
          },
        },
      ],
      [handleDialogOpen]
    );
 
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Opportunity", isLast: true },
  ];
  return (
    <Box sx={{ width: "90%", marginLeft: 9, marginTop: 9 }}>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
      <ToastContainer position="top-right" autoClose={2000} />
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
        <MaterialReactTable
            columns={columns}
            data={opportunites}
            getRowId={(row) => row.id}
            enableRowSelection
            enableDensityToggle={false}
            enableExpandAll={false}
            enableColumnFilters={false}
            onRowSelectionChange={setSelectedRows}
            state={{ rowSelection: selectedRows }}
            muiTableBodyRowProps={({ row }) => ({
              sx: (theme) => ({
                backgroundColor: selectedRows?.[row.id] ? "#FFCDD2" : "inherit",
                "&:hover": {
                  backgroundColor: selectedRows?.[row.id]
                    ? "#D32F2F"
                    : "#FCE4EC",
                },
              }),
            })}
            muiTableContainerProps={{ sx: { width: "100%" } }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "#055266",
                color: "white",
                fontSize: "12px",
                padding: "4px 8px",
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                fontSize: "12px",
                padding: "4px 8px",
              },
            }}
            renderEmptyRowsFallback={() => (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="120px"
              >
                  <FolderOffIcon sx={{color:"gray", fontSize:"30px"}} />
                <Typography variant="body1" color="#0d576b" sx={{color:"gray", fontSize:"15px"}}>
                  No Opportunity Available
                </Typography>
              </Box>
            )}
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
