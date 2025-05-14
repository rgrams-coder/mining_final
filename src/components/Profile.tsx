import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
} from '@mui/material';

interface UserData {
  name: string;
  email: string;
  status: string;
  username: string;
  phone?: string;
  firmName?: string;
  companyName?: string;
  state?: string;
  district?: string;
  circle?: string;
  mauzza?: string;
  revenueThanaNo?: string;
  plotNo?: string;
  area?: string;
  policeStation?: string;
  minerals?: string;
  natureOfLand?: string;
  mineCodeIBM?: string;
  mineCodeDGMS?: string;
  licenseNo?: string;
  dealerCodeIBM?: string;
  natureOfBusiness?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/profile/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!userData) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              Profile Details
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid size={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Name:</strong> {userData.name}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Username:</strong> {userData.username}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Email:</strong> {userData.email}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Status:</strong> {userData.status}
                      </Typography>
                      {userData.phone && (
                        <Typography variant="body1" gutterBottom>
                          <strong>Phone:</strong> {userData.phone}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {userData.status === 'Individual Leasee' && (
              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Lease Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {userData.state && (
                          <Typography variant="body1" gutterBottom>
                            <strong>State:</strong> {userData.state}
                          </Typography>
                        )}
                        {userData.district && (
                          <Typography variant="body1" gutterBottom>
                            <strong>District:</strong> {userData.district}
                          </Typography>
                        )}
                        {userData.circle && (
                          <Typography variant="body1" gutterBottom>
                            <strong>Circle:</strong> {userData.circle}
                          </Typography>
                        )}
                        {userData.mauzza && (
                          <Typography variant="body1" gutterBottom>
                            <strong>Mauzza:</strong> {userData.mauzza}
                          </Typography>
                        )}
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {userData.revenueThanaNo && (
                          <Typography variant="body1" gutterBottom>
                            <strong>Revenue Thana No:</strong> {userData.revenueThanaNo}
                          </Typography>
                        )}
                        {userData.plotNo && (
                          <Typography variant="body1" gutterBottom>
                            <strong>Plot No:</strong> {userData.plotNo}
                          </Typography>
                        )}
                        {userData.area && (
                          <Typography variant="body1" gutterBottom>
                            <strong>Area:</strong> {userData.area}
                          </Typography>
                        )}
                        {userData.policeStation && (
                          <Typography variant="body1" gutterBottom>
                            <strong>Police Station:</strong> {userData.policeStation}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {userData.status === 'Mineral Dealers' && (
              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Dealer Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        {userData.dealerCodeIBM && (
                          <Typography variant="body1" gutterBottom>
                            <strong>Dealer Code IBM:</strong> {userData.dealerCodeIBM}
                          </Typography>
                        )}
                        {userData.natureOfBusiness && (
                          <Typography variant="body1" gutterBottom>
                            <strong>Nature of Business:</strong> {userData.natureOfBusiness}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;