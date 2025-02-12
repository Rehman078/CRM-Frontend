import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

function CustomDeleteDialog({ open, handleClose, title, content, onConfirm, btn }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="error" />
          {title}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
        <Button sx={{ color: "#1f283e", borderColor: "#1f283e" }} onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {btn}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomDeleteDialog;
