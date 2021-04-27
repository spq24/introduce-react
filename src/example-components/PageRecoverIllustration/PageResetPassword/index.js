import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Container,
  InputAdornment,
  Button,
  TextField
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';
import illustration1 from '../../../assets/images/illustrations/pack1/security.svg';


export default function Recover() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const params = new URLSearchParams(window.location.search)
  const history = useHistory();

  useEffect(() => {
    const token = params.get('token')

    if(!token) {
      setSubmitting(true)
      setMessage('The token you provided is not valid')
      setStatus('error')
      return
    }

    axios.post('/api/v1/validate-password-reset-token', {
      token: token
    }, {
      'Content-Type': 'application/json'
    }).then(response => {

    }).catch(error => {
      setSubmitting(true)
      setMessage('The token you provided is not valid')
      setStatus('error')
    })
  }, [])

  const handleChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e) => {
    setSubmitting(true)
    axios.post('/api/v1/reset-password', {
      password: password
    }, {
      'Content-Type': 'application/json'
    }).then(response => {
      setMessage('Success! We reset your password. You will be redirected soon.')
      setStatus('success')

      setTimeout(function () { history.push('/login') }, 2000);
    }).catch(error => {
      setSubmitting(false)
      setMessage(error.response.message)
      setStatus('error')
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
                              Reset Password
                            </h1>
                            <p className="font-size-lg mb-0 text-black-50">
                              Please reset your password
                            </p>
                          </div>
                          <div>
                            <label className="font-weight-bold mb-2">
                              Password
                            </label>
                            <TextField
                              fullWidth
                              variant="outlined"
                              id="textfield-password"
                              type="password"
                              onChange={ (e) => handleChange(e) }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockTwoToneIcon />
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
