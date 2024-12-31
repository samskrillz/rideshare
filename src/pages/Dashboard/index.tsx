import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import { supabase } from '../../services/supabase';

interface DashboardStats {
  totalRides: number;
  activeDrivers: number;
  totalRevenue: number;
  averageRating: number;
}

const StatCard = ({ title, value, icon }: { title: string; value: any; icon: React.ReactNode }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Box>
      <Typography color="textSecondary" variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
    <Box sx={{ color: 'primary.main' }}>{icon}</Box>
  </Paper>
);

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRides: 0,
    activeDrivers: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total rides
      const { count: ridesCount } = await supabase
        .from('rides')
        .select('*', { count: 'exact' });

      // Fetch active drivers
      const { count: driversCount } = await supabase
        .from('drivers')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      // Fetch revenue
      const { data: rides } = await supabase
        .from('rides')
        .select('fare')
        .eq('status', 'completed');

      const totalRevenue = rides?.reduce((sum, ride) => sum + (ride.fare || 0), 0) || 0;

      // Fetch average rating
      const { data: ratings } = await supabase
        .from('ratings')
        .select('rating');

      const avgRating = ratings?.length 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;

      setStats({
        totalRides: ridesCount || 0,
        activeDrivers: driversCount || 0,
        totalRevenue,
        averageRating: Number(avgRating.toFixed(1)),
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <Box className="dashboard-content">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Rides"
            value={stats.totalRides}
            icon={<DirectionsCarIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Drivers"
            value={stats.activeDrivers}
            icon={<PersonIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={<AttachMoneyIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Rating"
            value={stats.averageRating}
            icon={<StarIcon fontSize="large" />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
