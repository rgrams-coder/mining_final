import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  status: string;
  username: string;
  password: string;
  confirmPassword: string;
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

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    status: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const statusOptions = [
    'Individual Leasee',
    'Firm/Partners',
    'Company',
    'Mineral Dealers',
    'Officials',
    'Students',
    'Researchers'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const initializePayment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000 // Registration fee amount in INR
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment order');
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'Mining Registration',
        description: 'Registration Fee Payment',
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Register user with payment details
            const registerResponse = await fetch('http://localhost:5000/api/users/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...formData,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              })
            });

            const registerData = await registerResponse.json();
            
            if (registerResponse.ok) {
              alert('Registration successful!');
              navigate('/login');
            } else {
              alert(registerData.message || 'Registration failed');
            }
          } catch (error) {
            console.error('Error during registration:', error);
            alert('Failed to complete registration');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#3f51b5'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment');
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Check username and email availability before payment
    try {
      const checkResponse = await fetch('http://localhost:5000/api/users/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: formData.username, email: formData.email })
      });
      const checkData = await checkResponse.json();
      if (!checkResponse.ok) {
        alert(checkData.message || 'Failed to check availability');
        return;
      }
      if (!checkData.usernameAvailable) {
        alert('Username is already taken');
        return;
      }
      if (!checkData.emailAvailable) {
        alert('Email is already registered');
        return;
      }
      initializePayment();
    } catch (error) {
      console.error('Availability check error:', error);
      alert('Failed to check username/email availability');
    }
  };

  const renderStatusSpecificFields = () => {
    if (['Individual Leasee', 'Firm/Partners', 'Company'].includes(formData.status)) {
      return (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel>State</InputLabel>
            <Select
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              label="State"
            >
              <MenuItem value="Jharkhand">Jharkhand</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="District"
            name="district"
            value={formData.district || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Circle"
            name="circle"
            value={formData.circle || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="miningdetails"
            value={'Mining Lease Details'}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Minerals"
            name="minerals"
            value={formData.minerals || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Lease Period"
            name="leaseperiod"
            value={formData.leaseperiod || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mauzza"
            name="mauzza"
            value={formData.mauzza || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Revenue Thana No"
            name="revenueThanaNo"
            value={formData.revenueThanaNo || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Plot No"
            name="plotNo"
            value={formData.plotNo || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Area"
            name="area"
            value={formData.area || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Police Station"
            name="policeStation"
            value={formData.policeStation || ''}
            onChange={handleChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Nature of Land"
            name="natureOfLand"
            value={formData.natureOfLand || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mine Code (IBM)"
            name="mineCodeIBM"
            value={formData.mineCodeIBM || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mine Code (DGMS)"
            name="mineCodeDGMS"
            value={formData.mineCodeDGMS || ''}
            onChange={handleChange}
          />
        </>
      );
    } else if (formData.status === 'Mineral Dealers') {
      return (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="License No"
            name="licenseNo"
            value={formData.licenseNo || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Minerals Name"
            name="minerals"
            value={formData.minerals || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Dealer Code (IBM)"
            name="dealerCodeIBM"
            value={formData.dealerCodeIBM || ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Nature of Business"
            name="natureOfBusiness"
            value={formData.natureOfBusiness || ''}
            onChange={handleChange}
          />
        </>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            User Registration
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Name/Authorized Person"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone No"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status  (Students / Researchers / Officials / Lessee)</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
                required
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {renderStatusSpecificFields()}

            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
              Registration Fee: Rs. 1000
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register and Pay
            </Button>
            <Button
              variant="text"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/login')}
            >
              Already have an account? Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegistrationForm;