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

export default function EmptyDashboard(props) {
  const link = `https://canyouintro.me/new-introduction-request/${props.user.unique_id}`

  return (
    <>
    <div className="app-page-title--heading d-flex justify-content-center" style={{ marginBottom: '50px' }}>
      <h1 style={{ fontSize: '3rem' }}>Welcome! Let's Get Connected.</h1>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={6}>
        <Grid item md={12}>
          <Card className="overflow-hidden shadow-xxl font-size-sm" style={{ minHeight: '198px', padding: '50px', borderRadius: '0.75rem', width: '90%' }}>
            <div className="font-weight-bold font-size-lg mb-3" style={{ textAlign: 'center' }}>
              Request Your First Introduction
            </div>
            <Grid container spacing={6}>
              <Grid item md={12} className="d-flex justify-content-center">

                <Link to='/new-introduction'>
                  <Button className='btn-primary font-weight-bold'>
                    Get Started
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item md={12}>
          <Card className="overflow-hidden shadow-xxl font-size-sm" style={{ padding: '50px', borderRadius: '0.75rem', width: '90%' }}>
            <div className="font-weight-bold font-size-lg mb-3" style={{ width: '100%' }}>
              Copy Your Introduction Request Email
            </div>
            <Grid container spacing={6}>
              <Grid item md={12} className="d-flex justify-content-center">
                <FormControl className="w-100" variant="outlined">
                  <TextField
                    variant="outlined"
                    value={link}
                    fullWidth
                    disabled={true}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CopyToClipboard
                            text={link}
                            onCopy={() => console.log('copied!')}>
                            <Fab size="small" color="primary">
                              <FontAwesomeIcon icon={['fas', 'copy']} />
                            </Fab>
                          </CopyToClipboard>
                        </InputAdornment>
                      )
                    }}
                  />
                </FormControl>
                <a href={link} target="_blank">
                  <Fab size="small" color="primary" style={{ margin: '8px' }}>
                    <FontAwesomeIcon icon={['fas', 'external-link-alt']} />
                  </Fab>
                </a>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      </div>
    </>
  );
}
