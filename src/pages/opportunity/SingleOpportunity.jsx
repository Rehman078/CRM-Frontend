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
  getOpporuintyById,
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
      sx={{
        color: "red",
        fontWeight: "bold",
        padding: 1,
        backgroundColor: "#fff",
        borderRadius: 1,
      }}
    >
      {children}
    </Typography>
  );
}

function Opportunity() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [stages, setStages] = useState([]);
  const [opportunities, setOpportunities] = useState(null);
  const [currentStageId, setCurrentStageId] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const fetchOpportunity = async () => {
    try {
      const response = await getOpporuintyById(id);
      if (!response?.data?.length) {
        console.error("No opportunity data found");
        return;
      }

      const opportunity = response.data[0];
      setOpportunities(opportunity);
      if (opportunity?.stageName?._id && opportunity?.stages) {
        setCurrentStageId(opportunity.stageName._id);
        setStages(opportunity.stages);
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

    if (!over) return; // If dropped outside any stage, do nothing

    const draggedItemId = active.id;
    const newStageId = over.id;

    // Ensure opportunity exists and is being moved to a new stage
    if (
      opportunities &&
      draggedItemId === opportunities._id &&
      newStageId !== currentStageId
    ) {
      setCurrentStageId(newStageId); // Update state first

      try {
        await updateOpportunityStage(id, newStageId);
        toast.success("Opportunity stage updated successfully.");
        fetchOpportunity();
      } catch (error) {
        console.error(
          "Error updating opportunity stage:",
          error?.response?.data || error.message
        );
      }
    }
  };

  return (
    <>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
      <ToastContainer position="top-right" autoClose={2000} />
      <Container maxWidth="xl" sx={{ marginTop: 12 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Grid
            container
            spacing={2}
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
                        sx={{
                          color: currentStageId === stage._id ? "red" : "black",
                          fontWeight:
                            currentStageId === stage._id ? "bold" : "normal",
                            fontSize: "14px"
                        }}
                      >
                        {stage.stage}
                        {currentStageId === stage._id && " ✔ Current Stage"}
                      </Typography>

                      <SortableContext
                        items={stages.map((s) => s._id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {currentStageId === stage._id && opportunities ? (
                          <DraggableItem id={opportunities._id}>
                            <Box
                              sx={{
                                color: "red",
                                fontSize: "14px",
                                fontWeight: "bold",
                                backgroundColor: "yellow",
                                padding: 0,
                                height: 50,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 1,
                                marginTop: 2,
                              }}
                            >
                              {opportunities.name}
                            </Box>
                          </DraggableItem>
                        ) : (
                          <Typography
                            variant="body2"
                            align="center"
                            sx={{ padding: 1, color: "gray" }}
                          >
                            Drop here
                          </Typography>
                        )}
                      </SortableContext>
                    </CardContent>
                  </Card>
                </Droppable>
              </Grid>
            ))}
          </Grid>

          <DragOverlay>
            {activeId ? (
              <Box
              sx={{
                color: "red",
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: "yellow",
                padding: 0,
                height: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 1,
              }}
              >
                {opportunities?.name}
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Container>
    </>
  );
}

export default Opportunity;
