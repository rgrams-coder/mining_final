import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: '#3166b5',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: '2rem 0',
  '& p': {
    marginBottom: '1.5rem',
    lineHeight: '1.8',
    fontSize: '1.1rem',
  }
}));

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            Mines and Mineral Laws Eco System
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
        </Toolbar>
        <Toolbar justify-content="center">
        <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/mining-plan')}>Mining Plan Design</Button>
          <Button color="inherit" onClick={() => navigate('/legal-advice')}>Legal Advice</Button>
          <Button color="inherit" onClick={() => navigate('/library')}>Library</Button>
        </Toolbar>

      </StyledAppBar>

      <Container maxWidth="lg">
        <ContentSection>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            Advent of Mines and Mineral Laws
          </Typography>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="body1" paragraph>
              Minerals are treasure beneath the earth and integral part of land. It is non-renewable and oldest valuable natural resources on which development of economy of the country depends. It is the raw materials for the core sector of industries of the country.
            </Typography>

            <Typography variant="body1" paragraph>
             Minerals are the oldest natural resource regulated by LAWS - Lethal Automatic Weapon System in the hand of society having common interest, beliefs, objects, or profession to intercept any bolt from the blues. LAWS are very animated and dynamic and is guided like missile to hit the target with clarity and precission. It shapes animates and inanimates both invariably. 
            </Typography>

            <Typography variant="body1" paragraph>
              Man is such a uncontrolled creature on this planet: THE MOTHER EARTH who continuously maked the earth endangered and unsafe by disturbing environment, land, water and air and their inter relationalship which exists among and between them and other living beings, plants, microorganisms and properties; LAWS with the intension to control the environment and their inter-relationship.
            </Typography>

            <Typography variant="body1">
            </Typography>
          </Paper>
        </ContentSection>
      </Container>
    </Box>
  );
};

export default Home;