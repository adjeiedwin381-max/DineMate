import { Grid, Typography, Avatar, Button, Card, Divider, Badge } from "@mui/material";
import useProfileStore from "../lib/profileStore";
import { useEffect } from "react";

const Profile = () => {
    const { getProfile, profile } = useProfileStore();

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    return (
        <>
          <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
            {/* Left column - Profile Picture & Upload */}
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Badge color={profile?.status === 'active' ? 'success' : 'error'} overlap="circular" badgeContent=" ">
                <Avatar
                  src={profile?.image}
                  alt={profile?.name}
                  sx={{ width: 180, height: 180, mx: 'auto', mb: 2 }}
                />
              </Badge>
              <br/>
                <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                  Upload New Photo
                  <input type="file" hidden />
                </Button>
              </Card>
            </Grid>

            {/* Right column - Profile Details */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                  <Typography variant="h4" gutterBottom>
                    {profile?.name}
                  </Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 3 }}>
                  {profile?.role}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Email
                    </Typography>
                    <Typography variant="h6">{profile?.email || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Phone
                    </Typography>
                    <Typography variant="h6">{profile?.phone || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      About
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {profile?.bio || 'No bio available.'}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

        </>
    );
}

export default Profile;