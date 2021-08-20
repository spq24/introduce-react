import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Button,
  List,
  ListItem,
  Tooltip,
  TextField
} from '@material-ui/core';
import Loader from '../../Loader';
import { NotificationManager } from 'react-notifications';
import { IKImage } from 'imagekitio-react'
import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';
//import hero8 from '../../../assets/images/hero-bg/hero-8.jpg';
import { auth, authGoogle, authLinkedIn, authMicrosoft, useAuthState, useAuthDispatch } from 'context'
import GoogleLogin from 'react-google-login';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import MicrosoftLogin from "react-microsoft-login";

export default function Login() {
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const PRODUCTION_URL = 'https://canyouintro.me'


  // TODO: delete if we're not bringing back sign in form
  useEffect(() => {
    if (userDetails && userDetails.credentials) {
      axios.post(`/api/v1/auth/${userDetails.user.id}/validate-token`, {
        token: userDetails.credentials['access-token'],
        client: userDetails.credentials.client
      }, {
        headers: userDetails.credentials
      })
      .then(response => {
        NotificationManager.info('You are already logged in!')
       return history.push('/dashboard')
      })
    }
  }, [])

  let url = () => {
    let hostname = window.location.hostname
    let protocol = window.location.protocol
    let port = window.location.port
    return hostname === 'localhost' ? `${protocol}//${hostname}:${port}` : PRODUCTION_URL
  }

  let msftLink = () => {
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=55bf2567-f8d2-4dba-988d-8a240f4621b5&response_type=code&redirect_uri=${url()}%2Flogin%2F&response_mode=query&scope=offline_access%20user.read%20`
  }


  useEffect(() => {
    const codeString = window.location.search.split('code=')[1]
    if(codeString) {
      setCode(codeString.split('&')[0])
    }
  }, [])

  useEffect(() => {

    if(code && code.length > 0) {
      const codeString = window.location.search.split('code=')[1]
      let formattedCode = codeString.split('&')[0]
      setSubmitting(true)
      authMicrosoft(dispatch, formattedCode)
      .then(response => {
        setSubmitting(false)
        if (response.currentUser && response.credentials) {
          history.push('/dashboard')
        }
      })
      .catch(error => {
        setSubmitting(false)
        let message = error && error.response && error.response.data.message && error.response.data.message ?
          error.response.data.message : 'Error logging in with Microsoft'
        NotificationManager.error(message)
      })
    }
  }, [code])

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    auth(dispatch, email, password)
    .then(response => {
      if (response.currentUser && response.credentials) {
        history.push('/dashboard')
      }
    })
    .catch(error => {
      let message = error && error.response && error.response.message && error.response.data.message ?
        error.response.data.message :
        'There was an error logging you in. Please make sure your information is correct and try again.'
      NotificationManager.error(message)
    })
  }

  const handleGoogleLogin = (payload) => {
    if (payload && Object.keys(payload).length > 0 && payload.code) {
      setSubmitting(true)
      authGoogle(dispatch, payload.code)
      .then(response => {
        setSubmitting(false)
        if (response.currentUser && response.credentials) {
          history.push('/dashboard')
        }
      })
      .catch(error => {
        setSubmitting(false)
        let message = error && error.response && error.response.message && error.response.data.message ?
          error.response.data.message : 'Error logging in with Google'
        NotificationManager.error(message)
      })
    }
  }

  const handleLinkedinLogin = (payload) => {
    if (payload && Object.keys(payload).length > 0 && payload.code) {
      setSubmitting(true)
      authLinkedIn(dispatch, payload.code)
      .then(response => {
        setSubmitting(false)
        if (response.currentUser && response.credentials) {
          history.push('/dashboard')
        }
      })
      .catch(error => {
        setSubmitting(false)
        let message = error && error.response && error.response.message && error.response.data.message ?
          error.response.data.message : 'Error logging in with LinkedIn'
        NotificationManager.error(message)
      })
    }
  }

  return (
    <>
      <div className="app-wrapper min-vh-100 bg-white">
        <div className="app-main min-vh-100">
          <div className="app-content p-0">
            <div className="app-inner-content-layout--main">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content">
                  <Grid container spacing={0} className="min-vh-100">
                    <Grid
                      item
                      lg={7}
                      xl={6}
                      className="d-flex align-items-center">
                      <Grid item md={10} lg={8} xl={7} className="mx-auto">
                        <div className="py-4">
                          <div className="text-center">
                            <h1 className="display-4 mb-1 font-weight-bold">
                              Login
                            </h1>
                          </div>
                          <div className="text-center py-4 rounded bg-secondary my-4">
                            <GoogleLogin
                              clientId="76583804160-hikjh5kp20nqpu701d17hemqum1mfbnt.apps.googleusercontent.com"
                              onSuccess={handleGoogleLogin}
                              onFailure={handleGoogleLogin}
                              responseType='code'
                              accessType='offline'
                              disabled={submitting}
                              render={renderProps => (
                                <Button
                                  className="m-2 btn-pill px-4 font-weight-bold btn-google"
                                  size="small"
                                  onClick={renderProps.onClick}
                                  disabled={renderProps.disabled}>
                                  <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon icon={['fab', 'google']} />
                                  </span>
                                  <span className="btn-wrapper--label">
                                    Login with Google
                                </span>
                                </Button>
                              )}
                            />
                            <LinkedIn
                              clientId="77kyaj6hcodakv"
                              onFailure={handleLinkedinLogin}
                              onSuccess={handleLinkedinLogin}
                              scope='r_liteprofile r_emailaddress'
                              redirectUri={`${url()}/linkedin`}
                              disabled={submitting}
                              renderElement={({ onClick, disabled }) => (
                                <Button
                                  className="m-2 btn-pill px-4 font-weight-bold btn-linkedin"
                                  size="small"
                                  onClick={onClick}
                                  disabled={disabled}>
                                  <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon icon={['fab', 'linkedin']} />
                                  </span>
                                  <span className="btn-wrapper--label">
                                    Login with LinkedIn
                                  </span>
                                </Button>
                              )}
                            />
                            <a href={msftLink()}>
                              <Button
                                className="m-2 btn-pill px-4 font-weight-bold btn-microsoft"
                                size="small"
                              disabled={submitting}>
                                <span className="btn-wrapper--icon">
                                  <FontAwesomeIcon icon={['fab', 'microsoft']} />
                                </span>
                                <span className="btn-wrapper--label">
                                  Login with Microsoft
                                </span>
                              </Button>
                            </a>
                          </div>
                          <div className="d-flex justify-content-center">
                            { submitting ? <Loader /> : null}
                          </div>

                          {/* <div className="text-center text-black-50 mb-4">
                            or sign in with credentials
                            </div> */}
                          <div>
                            {/* <div className="mb-4">
                              <TextField
                                fullWidth
                                variant="outlined"
                                id="textfield-email"
                                label="Email address"
                                onChange={ (e) => handleEmailChange(e) }
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <MailOutlineTwoToneIcon />
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </div>
                            <div className="mb-3">
                              <TextField
                                fullWidth
                                variant="outlined"
                                id="textfield-password"
                                label="Password"
                                type="password"
                                onChange={ (e) => handlePasswordChange(e) }
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <LockTwoToneIcon />
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </div>
                            <div className="d-flex justify-content-end align-items-center font-size-md">
                              <div>
                                <Link to='/forgot-password' className="text-first">
                                  Forgot password
                                </Link>
                              </div>
                            </div>
                            <div className="text-center py-4">
                              <Button className="btn-second font-weight-bold w-50 my-2" onClick={ (e) => handleLogin(e) }>
                                Sign in
                              </Button>
                            </div> */}
                            <div className="text-center text-black-50 mt-3">
                              Don't have an account?{' '}
                              <Link to='/sign-up' className="text-first">
                                Sign up
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid item lg={5} xl={6} className="d-flex">
                      <div className="hero-wrapper w-100 bg-composed-wrapper bg-premium-dark min-vh-lg-100">
                        <div className="flex-grow-1 w-100 d-flex align-items-center">
                          <div
                            className="bg-composed-wrapper--image opacity-5"
                            style={{ backgroundImage: 'url(https://ik.imagekit.io/canyouintrome/handshake_iicHlCH4N?tr=w-480,h-480,fo-auto)' }}
                          />
                          <div className="bg-composed-wrapper--bg bg-second opacity-6" />
                          <div className="bg-composed-wrapper--bg bg-deep-blue opacity-2" />
                          <div className="bg-composed-wrapper--content text-center p-5">
                            <div className="text-white px-0 px-lg-2 px-xl-4">
                              <h1 className="display-3 mb-4 font-weight-bold">
                                Can You Intro Me?
                              </h1>
                              <p className="font-size-lg mb-0 opacity-8">
                                We're on a mission to help the world feel more connected.
                              </p>
                              <div className="divider mx-auto border-1 my-5 border-light opacity-2 rounded w-25" />
                              <div>
                                <p className="font-size-lg mb-0 opacity-8 mb-2">
                                  Don't have an account yet?
                                </p>
                                <Link to='/sign-up'>
                                  <Button className="btn-success px-5 font-size-sm font-weight-bold btn-animated-icon text-uppercase rounded shadow-none py-3 hover-scale-sm hover-scale-lg">
                                    <span className="btn-wrapper--label">
                                      Sign Up
                                    </span>
                                    <span className="btn-wrapper--icon">
                                      <FontAwesomeIcon icon={['fas', 'arrow-right']} />
                                    </span>
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="hero-footer pb-4">

                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
