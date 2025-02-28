import { Modal, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const InfoModal = ({ open, handleClose, title, children }) => {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          border:"none",
          outline: "none", 
          borderRadius: 2,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "gray",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" sx={{textAlign:"center", paddingBottom:1}} gutterBottom>
                    {title}
                  </Typography>

        {/* Dynamic Content */}
        {children}
      </Box>
    </Modal>
  );
};

export default InfoModal;
