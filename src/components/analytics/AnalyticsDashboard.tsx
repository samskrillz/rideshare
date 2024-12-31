import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';

export const AnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState({
    totalRides: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeDrivers: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [rideData, setRideData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [metricsResponse, revenueResponse, ridesResponse] = await Promise.all([
        api.get('/analytics/metrics'),
        api.get('/analytics/revenue'),
        api.get('/analytics/rides')
      ]);

      setMetrics(metricsResponse.data);
      setRevenueData(revenueResponse.data);
      setRideData(ridesResponse.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Rides
              </Typography>
              <Typography variant="h4">
                {metrics.totalRides}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">
                ${metrics.totalRevenue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Rides Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Rides by Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rideData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rides" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
