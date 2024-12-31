import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { api } from '../../services/api';
import { Driver } from '../../types';

export const DriverManagement: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const response = await api.get('/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error loading drivers:', error);
    }
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setOpenDialog(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDriver) return;

    try {
      await api.put(`/drivers/${selectedDriver.id}`, selectedDriver);
      setOpenDialog(false);
      loadDrivers();
    } catch (error) {
      console.error('Error updating driver:', error);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.userId}</TableCell>
                <TableCell>{driver.vehicle.model}</TableCell>
                <TableCell>{driver.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(driver)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Driver</DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <TextField
              fullWidth
              label="Status"
              value={selectedDriver?.status || ''}
              onChange={(e) => setSelectedDriver(prev => 
                prev ? { ...prev, status: e.target.value as any } : null
              )}
              margin="normal"
            />
            {/* Add more fields as needed */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
