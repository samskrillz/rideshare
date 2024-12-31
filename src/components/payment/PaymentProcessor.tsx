import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { api } from '../../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentProcessorProps {
  rideId: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  rideId,
  amount,
  onSuccess,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Create payment intent
      const { data: { clientSecret } } = await api.post('/payments/create-intent', {
        rideId,
        amount,
      });

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Confirm payment
      const { error } = await stripe.confirmCardPayment(clientSecret);
      
      if (error) {
        throw error;
      }

      // Update ride status
      await api.post(`/rides/${rideId}/complete-payment`);
      
      onSuccess();
    } catch (error) {
      console.error('Payment failed:', error);
      onError(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Total Amount: ${(amount / 100).toFixed(2)}
      </Typography>
      
      <Button
        variant="contained"
        onClick={handlePayment}
        disabled={isProcessing}
        sx={{ mt: 2 }}
      >
        {isProcessing ? <CircularProgress size={24} /> : 'Pay Now'}
      </Button>
    </Box>
  );
};
