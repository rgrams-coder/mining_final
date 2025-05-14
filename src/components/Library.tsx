import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  IconButton,
  Tooltip,
  Button, // Added Button
  CircularProgress, // Added CircularProgress
  Alert, // Added Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import { styled } from '@mui/material/styles';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  margin: '1rem 0',
  '&:before': {
    display: 'none',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface DocumentItem {
  id: string;
  title: string;
  url: string;
}

interface DocumentSection {
  title: string;
  documents: DocumentItem[];
}

const documentSections: DocumentSection[] = [
  {
    title: 'Acts',
    documents: [
      { id: '1', title: 'Mines and Minerals (Development and Regulation) Act, 1957', url: '/docs/acts/mmdr-act-1957.pdf' },
      { id: '2', title: 'Mines Act, 1952', url: '/docs/acts/mines-act-1952.pdf' },
      { id: '3', title: 'Coal Mines (Special Provisions) Act, 2015', url: '/docs/acts/coal-mines-act-2015.pdf' },
    ],
  },
  {
    title: 'Notifications',
    documents: [
      { id: '4', title: 'Mining Lease Grant Notification 2023', url: '/docs/notifications/lease-grant-2023.pdf' },
      { id: '5', title: 'Environmental Clearance Update 2023', url: '/docs/notifications/env-clearance-2023.pdf' },
      { id: '6', title: 'Mineral Auction Guidelines 2023', url: '/docs/notifications/auction-guidelines-2023.pdf' },
    ],
  },
  {
    title: 'Government Orders',
    documents: [
      { id: '7', title: 'Mining Safety Guidelines Order 2023', url: '/docs/orders/safety-guidelines-2023.pdf' },
      { id: '8', title: 'Mineral Transportation Order 2023', url: '/docs/orders/transportation-2023.pdf' },
      { id: '9', title: 'Royalty Rate Revision Order 2023', url: '/docs/orders/royalty-revision-2023.pdf' },
    ],
  },
  {
    title: 'Judgments/Cases',
    documents: [
      { id: '10', title: 'Supreme Court Judgment on Mining Rights 2023', url: '/docs/cases/sc-mining-rights-2023.pdf' },
      { id: '11', title: 'High Court Order on Environmental Compliance', url: '/docs/cases/hc-env-compliance-2023.pdf' },
      { id: '12', title: 'NGT Verdict on Mining Operations', url: '/docs/cases/ngt-mining-ops-2023.pdf' },
    ],
  },
];

interface UserData {
  _id: string;
  name: string;
  email: string;
  hasLibraryAccess: boolean;
  libraryPaymentStatus: string;
  // Add other fields if needed, based on what /api/users/profile returns
}

const Library: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
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
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            navigate('/login');
          }
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        // Optionally, redirect to login if auth fails critically
        // navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDownload = (url: string, title: string) => {
    // Implement actual download functionality here
    console.log(`Downloading ${title} from ${url}`);
    // For actual download:
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', title || 'document.pdf');
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  const handlePayment = async () => {
    setPaymentInProgress(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token || !userData) {
      setError('User not authenticated or data missing.');
      setPaymentInProgress(false);
      navigate('/login');
      return;
    }

    try {
      // 1. Create Order
      const orderResponse = await fetch('http://localhost:5000/api/payment/create-library-access-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: userData._id }) // Send userId if needed by backend for receipt, though not strictly for order creation itself
      });

      if (!orderResponse.ok) {
        const errData = await orderResponse.json();
        throw new Error(errData.message || 'Failed to create payment order.');
      }
      const orderData = await orderResponse.json();

      // 2. Load Razorpay Script if not already loaded
      const loadScript = (src: string) => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };
          document.body.appendChild(script);
        });
      };
      const rzpScriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!rzpScriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: orderData.key_id, // From create-order API
        amount: orderData.amount, // From create-order API
        currency: orderData.currency, // From create-order API
        name: 'Mining Web Project',
        description: 'Library Access Fee',
        order_id: orderData.orderId, // From create-order API
        handler: async function (response: any) {
          // 4. Verify Payment
          const verifyResponse = await fetch('http://localhost:5000/api/payment/verify-library-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userData._id,
            }),
          });

          if (!verifyResponse.ok) {
            const errData = await verifyResponse.json();
            throw new Error(errData.message || 'Payment verification failed.');
          }
          const verificationData = await verifyResponse.json();
          if (verificationData.verified) {
            setUserData(prev => prev ? { ...prev, hasLibraryAccess: true, libraryPaymentStatus: 'completed' } : null);
            alert('Payment successful! Library access granted.');
          } else {
            throw new Error('Payment verification failed.');
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          // contact: userData.phone // if available and needed
        },
        notes: {
          address: 'User Address if available'
        },
        theme: {
          color: '#3399cc'
        }
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment Failed:', response.error);
        setError(`Payment Failed: ${response.error.description} (Reason: ${response.error.reason})`);
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err) {
      console.error('Payment process error:', err);
      setError(err instanceof Error ? err.message : 'An unknown payment error occurred');
      alert(err instanceof Error ? err.message : 'An unknown payment error occurred');
    } finally {
      setPaymentInProgress(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !userData) { // Show critical error if user data couldn't be fetched at all
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Error: {error}. Please try refreshing or logging in again.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Document Library
        </Typography>

        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>} {/* Non-critical errors like payment failure */}

        {userData && !userData.hasLibraryAccess ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Access to the E-Library requires a one-time payment.
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Unlock our comprehensive collection of mining laws, acts, notifications, and case studies for Rs. 15000.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handlePayment}
              disabled={paymentInProgress}
            >
              {paymentInProgress ? <CircularProgress size={24} color="inherit" /> : 'Pay Rs. 15000 for Library Access'}
            </Button>
          </Paper>
        ) : userData && userData.hasLibraryAccess ? (
          <Paper elevation={3} sx={{ p: 3 }}>
            {documentSections.map((section) => (
              <StyledAccordion
                key={section.title}
                expanded={expanded === section.title}
                onChange={handleChange(section.title)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '4px',
                  }}
                >
                  <Typography variant="h6">{section.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {section.documents.map((doc) => (
                      <StyledListItem key={doc.id}>
                        <ListItemIcon>
                          <PictureAsPdfIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={doc.title}
                          sx={{ pr: 2 }}
                        />
                        <Tooltip title="Download">
                          <IconButton
                            edge="end"
                            onClick={() => handleDownload(doc.url, doc.title)}
                            sx={{ color: 'primary.main' }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </StyledListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </StyledAccordion>
            ))}
          </Paper>
        ) : (
          // Fallback if userData is null but not loading and no critical error (should ideally not happen if logic is correct)
          <Typography sx={{ textAlign: 'center' }}>Unable to determine library access status. Please try again.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Library;