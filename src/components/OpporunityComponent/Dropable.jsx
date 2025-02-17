import { useDroppable } from "@dnd-kit/core";

function Droppable({ id, children }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} style={{ width: "100%", height: "100%" }}>
      {children}
    </div>
  );
}

export default Droppable;
