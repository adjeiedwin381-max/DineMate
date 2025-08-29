import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import { useState } from 'react';
import useAuthStore from '../../../lib/authStore';
import { useNavigate } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function ResetPasswordCard() {
  const {
    user,
    validateConfirmPassword,
    email,
    password,
    passwordError,
    passwordErrorMessage,
    confirmPassword,
    confirmPasswordError,
    confirmPasswordErrorMessage,
    setConfirmPassword,
    setPassword,
    setProcessing,
    resetPassword,
  } = useAuthStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setProcessing(true);

      if (!validateConfirmPassword(password, confirmPassword)) return;

      const data = await resetPassword(user.email, password);

      if (data) {
        navigate("/app/dashboard", { replace: true });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Reset Password
      </Typography>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="password">New Password</FormLabel>
          <TextField
            id="password"
            type="text"
            name="password"
            autoComplete="password"
            autoFocus
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            color={passwordError ? 'error' : 'primary'}
          />
          {passwordError && (
            <FormHelperText error>
              {passwordErrorMessage}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
          </Box>
          <TextField
            name="confirmPassword"
            type="text"
            id="confirmPassword"
            autoComplete="confirm-password"
            required
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            color={confirmPasswordError ? 'error' : 'primary'}
          />
          {confirmPasswordError && (
            <FormHelperText error>
              {confirmPasswordErrorMessage}
            </FormHelperText>
          )}
        </FormControl>
        <Button type="submit" fullWidth variant="contained" onClick={handleSubmit}>
          Reset Password
        </Button>
      </Box>
    </Card>
  );
}