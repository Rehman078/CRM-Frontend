import React from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";

const CustomModal = ({ open, handleClose, title, btnName, children, onSubmit }) => {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          paddingTop: 3,
          paddingBottom: 3,
          px: 4,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2" sx={{ textAlign: "center" }}>
          {title}
        </Typography>

        <form onSubmit={onSubmit}>
          {children}
          <Box sx={{ textAlign: "end", marginTop: 2 }}>
            <Button variant="outlined" sx={{ marginRight: 1, color: "#1f283e" }} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              sx={{
                backgroundColor: "#a5bae5",
                color: "#1f283e",
                paddingInline: 2,
                paddingBlock: 1,
              }}
            >
              {btnName}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CustomModal;
