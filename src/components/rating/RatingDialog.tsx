import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  rideId: string;
  driverId: string;
}

export const RatingDialog: React.FC<RatingDialogProps> = ({
  open,
  onClose,
  rideId,
  driverId
}) => {
  const { t } = useTranslation();
  const [driverRating, setDriverRating] = useState<number | null>(null);
  const [vehicleRating, setVehicleRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post(`/ratings`, {
        rideId,
        driverId,
        driverRating,
        vehicleRating,
        feedback
      });
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('rating.title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography>{t('rating.driverRating')}</Typography>
          <Rating
            value={driverRating}
            onChange={(_, value) => setDriverRating(value)}
            size="large"
          />
        </Box>
        
        <Box sx={{ my: 2 }}>
          <Typography>{t('rating.vehicleRating')}</Typography>
          <Rating
            value={vehicleRating}
            onChange={(_, value) => setVehicleRating(value)}
            size="large"
          />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label={t('rating.feedback')}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!driverRating || !vehicleRating}
        >
          {t('rating.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
