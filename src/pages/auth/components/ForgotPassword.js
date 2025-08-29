import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { supabase } from '../../../lib/supabase';
import Swal from 'sweetalert2';

function ForgotPassword({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: async (event) => {
            event.preventDefault();
            const email = event.target.email.value;

            let { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: "http://localhost:3000/#/reset-password",
            });

            if (error) {
              Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
              });

              console.error(error);

              return;
            }

            handleClose();

            Swal.fire({
              title: 'Success',
              text: 'Check your email for a link to reset your password.',
              icon: 'success',
            });
          },
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;