import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

// Full page loader with backdrop
export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={true}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" size={50} thickness={4} />
        <Typography variant="body1" color="inherit">
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

// Inline loader for sections/components
export const SectionLoader = ({ message = 'Loading...', height = '200px' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
        gap: 2,
      }}
    >
      <CircularProgress color="primary" size={40} thickness={4} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

// Table loader
export const TableLoader = ({ message = 'Loading data...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
        gap: 2,
      }}
    >
      <CircularProgress color="primary" size={45} thickness={4} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

// Button loader (small spinner)
export const ButtonLoader = ({ size = 20 }) => {
  return (
    <CircularProgress
      color="inherit"
      size={size}
      thickness={5}
      sx={{ marginLeft: 1 }}
    />
  );
};

// Skeleton card loader
export const CardLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '150px',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <CircularProgress color="primary" size={35} thickness={4} />
    </Box>
  );
};

// Default export with all loaders
const Loader = {
  Page: PageLoader,
  Section: SectionLoader,
  Table: TableLoader,
  Button: ButtonLoader,
  Card: CardLoader,
};

export default Loader;
