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
          <ProfileCard
            title='Add Your Personalized Link To Your Email Signature Or Website'
            link={PROFILE_LINK} />
        </Grid>
      </div>
    </>
  );
}
