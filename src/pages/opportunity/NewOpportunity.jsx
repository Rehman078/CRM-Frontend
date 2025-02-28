import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Droppable from "../../components/OpporunityComponent/Dropable";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
import {
  getOpportunitiesByPipelineId,
  updateOpportunityStage,
} from "../../services/OpporunityApi";

function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    cursor: "grab",
  };

  return (
    <Typography
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      variant="h6"
      align="center"
      gutterBottom
      color="primary"
      sx={{
        fontWeight: "bold",
        backgroundColor: "#fff",
        borderRadius: 1,
        paddingBlock: "8px",
        marginTop:2
      }}
    >
      {children}
    </Typography>
  );
}

function NewOpportunity() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [stages, setStages] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const fetchOpportunity = async () => {
    try {
      const response = await getOpportunitiesByPipelineId(id);
      if (!response?.data?.length) {
        console.error("No opportunity data found");
        return;
      }

      setOpportunities(response.data);
      if (response.data[0]?.stages) {
        setStages(response.data[0].stages);
      }
    } catch (error) {
      console.error("Failed fetching opportunities", error.message);
    }
  };

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const draggedItemId = active.id;
    const newStageId = over.id;

    // Find the dragged opportunity
    const draggedOpportunity = opportunities.find(
      (o) => o._id === draggedItemId
    );

    if (!draggedOpportunity || draggedOpportunity.stageName._id === newStageId)
      return;

    try {
      await updateOpportunityStage(draggedItemId, newStageId);
      toast.success("Opportunity stage updated successfully.");
      fetchOpportunity();
    } catch (error) {
      console.error(
        "Error updating opportunity stage:",
        error?.response?.data || error.message
      );
    }
  };

  return (
    <>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />

      <ToastContainer position="top-right" autoClose={2000} />
      <Container maxWidth="xl" sx={{ marginTop: 11 }}>
        <Card
          sx={{
            maxWidth: 200,
            boxShadow: 3,
            borderRadius: 2,
            marginLeft: 8,
            marginBottom: 3,
          }}
        >
          <CardContent
            sx={{
              padding: "10px !important",
              paddingBottom: "10px !important",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: "18px" }}
              color="primary"
            >
              Pipeline Name
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {opportunities?.[0]?.pipelineDetails?.name || "No Pipeline Name"}
            </Typography>
          </CardContent>
        </Card>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Grid
            container
            spacing={1}
            justifyContent="center"
            sx={{ paddingLeft: 8 }}
          >
            {stages.map((stage) => (
              <Grid item key={stage._id}>
                <Droppable id={stage._id}>
                  <Card
                    sx={{
                      width: 250,
                      height: "60vh",
                      backgroundColor: "#a5bae5",
                      borderRadius: 2,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        sx={{ fontSize: "14px", backgroundColor:"#1f283e", color:"white", padding:"6px", borderRadius:"5px" }}
                      >
                        {stage.stage}
                      </Typography>

                      <SortableContext
                        items={opportunities.map((o) => o._id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {opportunities
                          .filter((o) => o.stageName._id === stage._id)
                          .map((opportunity) => (
                            <DraggableItem
                              key={opportunity._id}
                              id={opportunity._id}
                            >
                              <Typography>{opportunity.name}</Typography>
                            </DraggableItem>
                          ))}
                      </SortableContext>
                    </CardContent>
                  </Card>
                </Droppable>
              </Grid>
            ))}
          </Grid>

          <DragOverlay>
            {activeId ? (
              <Typography
                sx={{
                  backgroundColor: "#1f283e",
                  paddingBlock: "8px",
                  textAlign: "center",
                  color:"white",
                  borderRadius: 1,
                }}
              >
                {opportunities.find((o) => o._id === activeId)?.name}
              </Typography>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Container>
    </>
  );
}

export default NewOpportunity;
