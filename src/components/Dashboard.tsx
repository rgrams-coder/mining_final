import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  CardActions,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

interface UserData {
  name: string;
  email: string;
  status: string;
  username: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
              Welcome, {userData.name}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    <strong>Username:</strong> {userData.username}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {userData.email}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong> {userData.status}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mb: 2 }}
                    onClick={() => navigate(`/${userData.username}/profile`)}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => navigate(`/${userData.username}/update`)}
                  >
                    Update Information
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
                Our Services
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <GavelIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      </Box>
                      <Typography variant="h6" component="h3" gutterBottom align="center">
                        Legal Advice
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Expert legal consultation for mining operations, compliance, and regulations.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => navigate(`/${userData.username}/legaladvice`)}
                      >
                        Submit for Legal Advice
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <ArchitectureIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      </Box>
                      <Typography variant="h6" component="h3" gutterBottom align="center">
                        Mining Plan & Design
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Professional mining plan development and technical design services.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => navigate(`/${userData.username}/miningplan`)}
                      >
                        Submit Queries for Mining Plan
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <LibraryBooksIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      </Box>
                      <Typography variant="h6" component="h3" gutterBottom align="center">
                        E-Library
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Access to comprehensive mining resources, documents, and research materials.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => navigate(`/${userData.username}/library`)}
                      >
                        Access to Library
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;