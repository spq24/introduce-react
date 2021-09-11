import React from 'react';
import {
  Card,
  Grid,
  Button,
  Fab,
  InputAdornment,
  TextField,
  FormControl
} from '@material-ui/core';
import ProfileCard from '../../example-pages/Users/ProfileCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationManager } from 'react-notifications';

export default function EmptyDashboard(props) {
  const PROFILE_LINK = `https://canyouintro.me/r/${props.user.unique_id}`

  return (
    <>
      <div className="app-page-title--heading d-flex justify-content-center" style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3rem' }}>Welcome!</h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={6}>
          <Grid item md={6}>
            <Card className="overflow-hidden shadow-xxl font-size-sm" style={{ padding: '50px', borderRadius: '0.75rem', marginBottom: '5%', width: '100%' }}>
              <div className="font-weight-bold font-size-lg mb-3" style={{ width: '100%' }}>
                Send A Test
              </div>
              <Grid container spacing={6}>
                <Grid item md={12} className="d-flex justify-content-center">
                  button
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item md={6}>
            <Card className="overflow-hidden shadow-xxl font-size-sm" style={{ padding: '50px', borderRadius: '0.75rem', marginBottom: '5%', width: '100%' }}>
              <div className="font-weight-bold font-size-lg mb-3" style={{ width: '100%' }}>
                Propose An Intro
              </div>
              <Grid container spacing={6}>
                <Grid item md={12} className="d-flex justify-content-center">
                  button
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <ProfileCard
            title='Share your link'
            link={PROFILE_LINK} />
        </Grid>
      </div>
    </>
  );
}
