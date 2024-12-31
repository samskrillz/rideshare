import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { calculateDistance, estimateFare } from '../../services/maps';
import { api } from '../../services/api';

interface BookingFormData {
  pickupAddress: string;
  dropoffAddress: string;
  scheduledTime?: Date;
}

export const BookingForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fareEstimate, setFareEstimate] = useState<number | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>();

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    try {
      // Get coordinates from addresses
      const pickupCoords = await getCoordinates(data.pickupAddress);
      const dropoffCoords = await getCoordinates(data.dropoffAddress);

      // Calculate distance and fare
      const { distance, duration } = await calculateDistance(pickupCoords, dropoffCoords);
      const fare = estimateFare(distance, duration, 5, 1); // Base fare $5, no surge

      setFareEstimate(fare);

      // Create booking
      const response = await api.post('/bookings', {
        ...data,
        pickup: { address: data.pickupAddress, ...pickupCoords },
        dropoff: { address: data.dropoffAddress, ...dropoffCoords },
        estimatedFare: fare,
      });

      // Handle successful booking
      console.log('Booking created:', response.data);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Book a Ride
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Pickup Location"
          {...register('pickupAddress', { required: 'Pickup location is required' })}
          error={!!errors.pickupAddress}
          helperText={errors.pickupAddress?.message}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Dropoff Location"
          {...register('dropoffAddress', { required: 'Dropoff location is required' })}
          error={!!errors.dropoffAddress}
          helperText={errors.dropoffAddress?.message}
          margin="normal"
        />

        <TextField
          fullWidth
          type="datetime-local"
          label="Schedule for later"
          {...register('scheduledTime')}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />

        {fareEstimate && (
          <Typography variant="h6" sx={{ my: 2 }}>
            Estimated Fare: ${fareEstimate.toFixed(2)}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Book Now'}
        </Button>
      </form>
    </Paper>
  );
};
