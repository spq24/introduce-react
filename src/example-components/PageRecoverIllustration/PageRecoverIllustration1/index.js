import React, { useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Container,
  InputAdornment,
  Button,
  TextField
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import illustration1 from '../../../assets/images/illustrations/pack1/security.svg';
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom';

export default function Recover() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = (e) => {
    setSubmitting(true)
    axios.post('/api/v1/password-reset-token', {
      email: email
    }, {
      'Content-Type': 'application/json'
    }).then(response => {
      setMessage('Success! We sent an email with a password reset link to your email.')
      setStatus('success')
    }).catch(error => {
      setSubmitting(false)
      setMessage(error.response.message)
      setStatus('error')
      NotificationManager.error('There was an error. Please make sure your email is correct')
    })
  }

  return (
    <>
      <div className="app-wrapper bg-white min-vh-100">
        <div className="app-main min-vh-100">
          <div className="app-content p-0">
            <div className="app-content--inner d-flex align-items-center">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content py-5">
                  <Container>
                    {
                      status && message ?
                        <Alert className={`text-${status}`} severity={status} style={{ marginBottom: '50px' }}>
                          {message}
                        </Alert> : null
                    }
                    <Grid container spacing={6}>
                      <Grid item lg={6} className="d-flex align-items-center">
                        <div className="divider-v d-none d-lg-block divider-v-md" />
                        <div className="w-100 pr-0 pr-lg-5">
                          <div className="text-center my-5">
                            <h1 className="display-4 mb-1 font-weight-bold">
                              Recover Password
                            </h1>
                            <p className="font-size-lg mb-0 text-black-50">
                              Forgot your password? No worries, we're here to
                              help!
                            </p>
                          </div>
                          <div>
                            <label className="font-weight-bold mb-2">
                              Email address
                            </label>
                            <TextField
                              fullWidth
                              variant="outlined"
                              id="textfield-email"
                              onChange={ (e) => handleChange(e) }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <MailOutlineTwoToneIcon />
                                  </InputAdornment>
                                )
                              }}
                            />
                          </div>
                          <div className="text-center mb-5">
                            <Button
                              fullWidth
                              className="text-uppercase font-weight-bold font-size-sm mt-4 btn-primary"
                              onClick={ (e) => handleSubmit(e) }
                              disabled={submitting}>
                              Send password
                            </Button>
                          </div>
                          <div className="text-center mb-5">
                            <Link to='/login' className="text-first">
                              Back To Sign in
                            </Link>
                          </div>
                        </div>
                      </Grid>
                      <Grid
                        item
                        lg={6}
                        className="d-none d-lg-flex align-items-center">
                        <img
                          alt="..."
                          className="w-100 mx-auto d-block img-fluid"
                          src={illustration1}
                        />
                      </Grid>
                    </Grid>
                  </Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
