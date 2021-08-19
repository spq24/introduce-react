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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationManager } from 'react-notifications';

export default function ProfileCard(props) {
  const PROFILE_LINK = props.link

  return (
    <Grid item md={12}>
      <Card className="overflow-hidden shadow-xxl font-size-sm" style={{ padding: '50px', borderRadius: '0.75rem', width: '90%' }}>
        <div className="font-weight-bold font-size-lg mb-3" style={{ width: '100%' }}>
          {props.title}
        </div>
        <Grid container spacing={6}>
          <Grid item md={12} className="d-flex justify-content-center">
            <FormControl className="w-100" variant="outlined">
              <TextField
                variant="outlined"
                value={PROFILE_LINK}
                fullWidth
                disabled={true}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CopyToClipboard
                        text={PROFILE_LINK}
                        onCopy={() => NotificationManager.success('Link copied!')}>
                        <Fab size="small" color="primary">
                          <FontAwesomeIcon icon={['fas', 'copy']} />
                        </Fab>
                      </CopyToClipboard>
                    </InputAdornment>
                  )
                }}
              />
              <small>
                Edit your <u>
                  <a href="https://support.google.com/mail/answer/8395" target="_blank">Gmail Signature</a>
                </u>&nbsp;or your&nbsp;
                <u>
                  <a href="https://support.microsoft.com/en-us/office/change-an-email-signature-86597769-e4df-4320-b219-39d6e1a9e87b" target="_blank">
                    Outlook Signature
                  </a>
                </u>
              </small>
            </FormControl>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
