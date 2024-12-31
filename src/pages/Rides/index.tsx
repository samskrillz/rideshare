import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import { supabase } from '../../services/supabase';

interface Ride {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  fare: number;
  created_at: string;
  driver_id: string;
}

export const Rides = () => {
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRides(data || []);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'active':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box className="dashboard-content">
      <Typography variant="h4" gutterBottom>
        Rides
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Pickup</TableCell>
              <TableCell>Dropoff</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Fare</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rides.map((ride) => (
              <TableRow key={ride.id}>
                <TableCell>{ride.id}</TableCell>
                <TableCell>{ride.pickup_location}</TableCell>
                <TableCell>{ride.dropoff_location}</TableCell>
                <TableCell>
                  <Chip
                    label={ride.status}
                    color={getStatusColor(ride.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>${ride.fare.toFixed(2)}</TableCell>
                <TableCell>
                  {format(new Date(ride.created_at), 'MMM dd, yyyy HH:mm')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Rides;
