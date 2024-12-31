import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const SettingsPage: React.FC = () => {
  return (
    <Box className="dashboard-content">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Settings content coming soon...</Typography>
      </Paper>
    </Box>
  );
};
