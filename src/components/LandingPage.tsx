import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: 'url("/img.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#2c3e50',
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.45)',
    zIndex: 2
  },
  '& > *': {
    position: 'relative',
    zIndex: 3
  }
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  position: 'absolute',
}));

const NRDCLogo = styled('img')({
  width: '60px',
  height: 'auto',
  marginBottom: '1rem'
});

const HeroSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  textAlign: 'center',
  color: '#ffffff',
  position: 'relative',
  zIndex: 1,
}));

const StyledTypography = styled(Typography)({
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '0.5rem'
});

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <GradientBox>
      <Container maxWidth="lg">
        <HeroSection>
          <NRDCLogo src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z' fill='%23fff'/%3E%3Cpath d='M50 20c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z' fill='%23fff'/%3E%3C/svg%3E" 
            alt="NRDC Logo" />
          
          <StyledTypography
            variant="h6"
            sx={{
              fontSize: '1rem',
              opacity: 0.8
            }}
          >
            THE NATURAL RESOURCE
          </StyledTypography>

          <StyledTypography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '3rem', md: '4.5rem' },
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            MINES AND MINERAL LAWS ECO SYSTEM
          </StyledTypography>

          <Button
            variant="outlined"
            size="large"
            sx={{
              mt: 4,
              color: '#ffffff',
              borderColor: '#ffffff',
              fontSize: '1.1rem',
              py: 1.5,
              px: 4,
              '&:hover': {
                borderColor: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.6)'
              }
            }}
            onClick={() => navigate('/home')}
          >
            ACCESS
          </Button>
        </HeroSection>
      </Container>
    </GradientBox>
  );
};

export default LandingPage;