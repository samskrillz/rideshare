import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { format } from 'date-fns';

interface EarningsSummary {
  totalEarnings: number;
  totalTrips: number;
  totalHours: number;
  averagePerTrip: number;
  periodEarnings: {
    date: string;
    earnings: number;
    trips: number;
    hours: number;
  }[];
}

export const DriverEarningsReport: React.FC = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('week');
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);

  useEffect(() => {
    loadEarnings();
  }, [period]);

  const loadEarnings = async () => {
    try {
      const response = await api.get(`/earnings/summary?period=${period}`);
      setEarnings(response.data);
    } catch (error) {
      console.error('Error loading earnings:', error);
    }
  };

  if (!earnings) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">{t('earnings.title')}</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Period"
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle2">{t('earnings.totalEarnings')}</Typography>
          <Typography variant="h4">${earnings.totalEarnings.toFixed(2)}</Typography>
        </Paper>
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle2">{t('earnings.trips')}</Typography>
          <Typography variant="h4">{earnings.totalTrips}</Typography>
        </Paper>
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle2">{t('earnings.hours')}</Typography>
          <Typography variant="h4">{earnings.totalHours}</Typography>
        </Paper>
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle2">{t('earnings.average')}</Typography>
          <Typography variant="h4">${earnings.averagePerTrip.toFixed(2)}</Typography>
        </Paper>
      </Box>

      {/* Detailed Earnings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Earnings</TableCell>
              <TableCell align="right">Trips</TableCell>
              <TableCell align="right">Hours</TableCell>
              <TableCell align="right">Average/Trip</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {earnings.periodEarnings.map((day) => (
              <TableRow key={day.date}>
                <TableCell>{format(new Date(day.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell align="right">${day.earnings.toFixed(2)}</TableCell>
                <TableCell align="right">{day.trips}</TableCell>
                <TableCell align="right">{day.hours}</TableCell>
                <TableCell align="right">
                  ${(day.earnings / day.trips).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
