import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Paper, Typography } from "@mui/material";

function Items({ id, content }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "12px",
    margin: "8px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    cursor: "grab",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      elevation={3}
      sx={{
        "&:hover": {
          backgroundColor: "#f0f0f0",
        },
      }}
    >
      <Typography variant="body1">{content}</Typography>
    </Paper>
  );
}

export default Items;
