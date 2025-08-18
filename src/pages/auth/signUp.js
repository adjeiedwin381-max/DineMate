import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Link,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Stack,
  CardActions,
  Grid,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  ArrowBack,
  ArrowForward,
  Check,
} from '@mui/icons-material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PlaceIcon from '@mui/icons-material/Place';
import StoreIcon from '@mui/icons-material/Store';
import { CheckCircle } from '@mui/icons-material';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    title: 'Free',
    price: '$0',
    features: ['1 User', 'Basic Features', 'Community Support'],
    buttonText: 'Get Started',
    highlighted: false,
  },
  {
    title: 'Pro',
    price: '$19',
    features: ['Up to 5 Users', 'Advanced Features', 'Priority Support'],
    buttonText: 'Upgrade',
    highlighted: true,
  },
  {
    title: 'Enterprise',
    price: 'Contact Us',
    features: ['Unlimited Users', 'All Features', 'Dedicated Support'],
    buttonText: 'Contact Sales',
    highlighted: false,
  },
];

const steps = ['Account Info', 'Restaurant Details', 'Billing & Subscription', 'Confirmation'];

const idTypes = ['Passport', 'Driver\'s License', 'National ID'];

const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'Other'];

const availableInterests = ['Technology', 'Design', 'Business', 'Marketing', 'Finance', 'Health', 'Travel', 'Food', 'Sports', 'Music'];

export default function SignUp({ onSwitchToSignIn }) {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    idType: '',
    idNumber: '',
    phoneNumber: '',
    restaurantName: '',
    restaurantAddress: '',
    restaurantPhone: '',
    restaurantType: '',
    country: '',
    notifications: {
      email: true,
      sms: false,
      marketing: false,
    },
    interests: [],
  });

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev)[parent],
          [child]: event.target.type === 'checkbox' ? event.target.checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

    const handleFileSelect = (file) => {
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setFileName(file ? file.name : "");
    if (handleFileSelect) {
      handleFileSelect(file);
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
    case 0:
        if (!formData.email) {
        newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
        newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
        }
        if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
        }
        if (!formData.idType) {
        newErrors.idType = 'ID type is required';
        }
        if (!formData.idNumber) {
        newErrors.idNumber = 'ID number is required';
        }
        break;

    case 1:
        if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
        }
        if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
        }
        break;

    case 2:
        // Optional step, no required fields
        break;

    default:
        // No validation needed for unknown steps
        break;
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Account created successfully! (This is just a demo)');
    }, 1500);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Create Your Account
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={3}>
              Enter your basic user information to get started
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
              Personal Information
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />

              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Box>

            <TextField
              required
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="tel"
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            

            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Typography variant="body2" color="text.secondary" mb={3}>
              Identification & Verification
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl 
                    fullWidth 
                    required
                    error={!!errors.idType}
                    helperText={errors.idType}
                >
                    <InputLabel id="country-label">ID Type</InputLabel>
                    <Select
                        labelId="country-label"
                        id="country"
                        value={formData.idType}
                        label="Country"
                        onChange={(e) => setFormData(prev => ({ ...prev, idType: e.target.value }))}
                    >
                        {idTypes.map((idType) => (
                        <MenuItem key={idType} value={idType}>
                            {idType}
                        </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    required
                    fullWidth
                    id="idNumber"
                    label="ID Number"
                    name="idNumber"
                    autoComplete="id-number"
                    value={formData.idNumber}
                    onChange={handleChange('idNumber')}
                    error={!!errors.idNumber}
                    helperText={errors.idNumber}
                />
            </Box>

            <Typography variant="body2" color="text.secondary" mb={3}>
              Security
            </Typography>

            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Restaurant Information
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Tell us a bit about your restaurant
            </Typography>

            {/* <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Box> */}

            <TextField
              required
              fullWidth
              id="restaurantName"
              label="Name"
              name="restaurantName"
              autoComplete="restaurant-name"
              value={formData.restaurantName}
              onChange={handleChange('restaurantName')}
              error={!!errors.restaurantName}
              helperText={errors.restaurantName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StorefrontIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              required
              fullWidth
              id="restaurantAddress"
              label="Address"
              name="restaurantAddress"
              autoComplete="restaurant-address"
              value={formData.restaurantAddress}
              onChange={handleChange('restaurantAddress')}
              error={!!errors.restaurantAddress}
              helperText={errors.restaurantAddress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
                labelId="country-label"
                id="country"
                value={formData.country}
                label="Country"
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            >
                {countries.map((country) => (
                <MenuItem key={country} value={country}>
                    {country}
                </MenuItem>
                ))}
            </Select>
            </FormControl>

            <TextField
              required
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="tel"
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              id="restaurantType"
              label="Type - e.g. bar, café, fast food"
              name="restaurantType"
              autoComplete="restaurant-type"
              value={formData.restaurantType}
              onChange={handleChange('restaurantType')}
              error={!!errors.restaurantType}
              helperText={errors.restaurantType}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StoreIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Box display="flex" alignItems="center" gap={2}>
                <TextField
                    label="Upload Restaurant Certificate"
                    value={fileName}
                    fullWidth
                    InputProps={{
                    readOnly: true,
                    }}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <Button
                    size='large'
                    variant="contained"
                    startIcon={<UploadFileIcon />}
                    onClick={handleButtonClick}
                >
                    Browse
                </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box textAlign="center" mb={6}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                Choose Your Plan
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                Select a subscription that fits your restaurant management needs.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {plans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan.title}>
                    <Card
                    sx={{
                        borderRadius: 3,
                        boxShadow: plan.highlighted
                        ? '0 8px 24px rgba(0,0,0,0.15)'
                        : '0 4px 12px rgba(0,0,0,0.08)',
                        border: plan.highlighted ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    >
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                        {plan.title}
                        </Typography>
                        <Typography variant="h4" color="primary" gutterBottom>
                        {plan.price}
                        {plan.price !== 'Contact Us' && (
                            <Typography
                            component="span"
                            variant="subtitle1"
                            color="text.secondary"
                            >
                            /mo
                            </Typography>
                        )}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {plan.features.map((feature) => (
                        <Box
                            key={feature}
                            display="flex"
                            alignItems="center"
                            mb={1}
                        >
                            <CheckCircle
                            color="success"
                            fontSize="small"
                            sx={{ mr: 1 }}
                            />
                            <Typography variant="body2">{feature}</Typography>
                        </Box>
                        ))}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                        <Button
                        variant={plan.highlighted ? 'contained' : 'outlined'}
                        color="primary"
                        fullWidth
                        sx={{ borderRadius: 2 }}
                        >
                        {plan.buttonText}
                        </Button>
                    </CardActions>
                    </Card>
                </Grid>
                ))}
            </Grid>
        </Container>
        );

      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'visible',
            position: 'relative',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              <Typography
                component="h1"
                variant="h4"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join us today and get started in just a few steps
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ minHeight: '400px' }}>
              {renderStepContent(activeStep)}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBack />}
                sx={{ textTransform: 'none' }}
              >
                Back
              </Button>

              <Box sx={{ flex: '1 1 auto' }} />

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  endIcon={<Check />}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Next
                </Button>
              )}
            </Box>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/sign-in');
                  }}
                  fontWeight="medium"
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}