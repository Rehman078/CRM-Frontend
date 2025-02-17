import { useState } from "react";
import Items from "../../components/OpporunityComponent/Items";
import Droppable from "../../components/OpporunityComponent/Dropable";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";;
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContaxt";
import AppBarComponent from "../../components/AppBar";
import DrawerComponent from "../../components/SideBar";
function Opporunity() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  //logout function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

   // State for managing tasks in different columns
   const [tasks, setTasks] = useState({
    pending: [
      { id: 1, content: "Task 1" },
      { id: 2, content: "Task 2" },
    ],
    process: [
        // { id: 3, content: "Task 3" }
    ],
    completed: [
    //   { id: 4, content: "Task 4" },
    //   { id: 5, content: "Task 5" },
    ],
  });

  // Drag-and-Drop Sensors
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  // Handle Drag End Event
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceColumn = null;
    let destinationColumn = null;
    let itemToMove = null;

    // Find the source column
    for (const column in tasks) {
      const index = tasks[column].findIndex((item) => item.id === activeId);
      if (index !== -1) {
        sourceColumn = column;
        itemToMove = tasks[column][index];
        break;
      }
    }

    // Determine the destination column
    for (const column in tasks) {
      if (tasks[column].some((item) => item.id === overId)) {
        destinationColumn = column;
        break;
      }
    }

    // If dropped in an empty column, set destination as the column itself
    if (!destinationColumn && overId in tasks) {
      destinationColumn = overId;
    }

    // Move the item if source and destination are different
    if (sourceColumn && destinationColumn && sourceColumn !== destinationColumn) {
      setTasks((prev) => {
        const newSource = prev[sourceColumn].filter((item) => item.id !== activeId);
        const newDestination = [...prev[destinationColumn], itemToMove];

        return {
          ...prev,
          [sourceColumn]: newSource,
          [destinationColumn]: newDestination,
        };
      });
    }
  };

  // Background Colors for Different Stages
  const columnColors = {
    pending: "#FFEB3B",
    process: "#64B5F6",
    completed: "#81C784",
  };

  return (
    <>
      <AppBarComponent handleLogout={handleLogout} />
      <DrawerComponent />
        <Container maxWidth="xl" sx={{ marginTop:12 }}>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <Grid container spacing={2} justifyContent="center" sx={{paddingLeft:8}}>
          {Object.entries(tasks).map(([stage, items]) => (
            <Grid item key={stage}>
              <Droppable id={stage}>
                <Card sx={{ width: 420, height:"83vh", backgroundColor: columnColors[stage], borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" align="center" gutterBottom>
                      {stage.toUpperCase()}
                    </Typography>
                    <SortableContext strategy={verticalListSortingStrategy} items={items.map((i) => i.id)}>
                      {items.length > 0 ? (
                        items.map((task) => <Items key={task.id} id={task.id} content={task.content} />)
                      ) : (
                        <Typography variant="body2" align="center" sx={{ padding: 2, color: "gray" }}>
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
      </DndContext>
    </Container>
</>
  );
}

export default Opporunity;
