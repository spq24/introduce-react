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
import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';
import hero8 from '../../../assets/images/hero-bg/hero-8.jpg';
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
  let url = ''

  useEffect(() => {
    if (userDetails && userDetails.credentials) {
      axios.post(`/api/v1/auth/${userDetails.user.id}/validate-token`, {
        token: userDetails.credentials['access-token'],
        client: userDetails.credentials.client
      }, {
        headers: userDetails.credentials
      })
      .then(response => {
        // TODO: send notification about already being logged in.
        history.push('/dashboard')
      })
    }

    let hostname = window.location.hostname
    let protocol = window.location.protocol
    let port = window.location.port
    if(hostname === 'localhost') {
      url = `${protocol}//${hostname}:${port}`
    } else {
      url = `${protocol}//${hostname}`
    }
  }, [])

  useEffect(() => {
    const codeString = window.location.search.split('code=')[1]
    if(codeString) {
      setCode(codeString.split('&')[0])
    }
  }, [])

  useEffect(() => {
    authMicrosoft(dispatch, code)
    .then(response => {
      if (response.currentUser && response.credentials) {
        history.push('/dashboard')
      }
    })
    .catch(error => {
      console.log(error)
    })
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
      console.log(error)
    })
  }

  const handleGoogleLogin = (payload) => {
    authGoogle(dispatch, payload.code)
    .then(response => {
      if (response.currentUser && response.credentials) {
        history.push('/dashboard')
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  const handleLinkedinLogin = (payload) => {
    authLinkedIn(dispatch, payload.code)
    .then(response => {
      if (response.currentUser && response.credentials) {
        history.push('/dashboard')
      }
    })
    .catch(error => {
      console.log(error)
    })
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
                            <p className="font-size-lg mb-0 text-black-50">
                              Fill in the fields below to login to your account
                            </p>
                          </div>
                          <div className="text-center py-4 rounded bg-secondary my-4">
                            <GoogleLogin
                              clientId="76583804160-hikjh5kp20nqpu701d17hemqum1mfbnt.apps.googleusercontent.com"
                              onSuccess={handleGoogleLogin}
                              onFailure={handleGoogleLogin}
                              responseType='code'
                              accessType='offline'
                              render={renderProps => (
                                <Button
                                  className="m-2 btn-pill px-4 font-weight-bold btn-google"
                                  size="small"
                                  onClick={renderProps.onClick}>
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
                              redirectUri={`${url}/linkedin`}
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

                            <a href={`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=55bf2567-f8d2-4dba-988d-8a240f4621b5&response_type=code&redirect_uri=${url}%2Flogin%2F&response_mode=query&scope=offline_access%20user.read%20`}>
                              <Button
                                className="m-2 btn-pill px-4 font-weight-bold btn-microsoft"
                                size="small">
                                <span className="btn-wrapper--icon">
                                  <FontAwesomeIcon icon={['fab', 'microsoft']} />
                                </span>
                                <span className="btn-wrapper--label">
                                  Login with Microsoft
                                  </span>
                              </Button>
                            </a>
                          </div>
                          <div className="text-center text-black-50 mb-4">
                            or sign in with credentials
                          </div>
                          <div>
                            <div className="mb-4">
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
                            </div>
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
                            style={{ backgroundImage: 'url(' + hero8 + ')' }}
                          />
                          <div className="bg-composed-wrapper--bg bg-second opacity-6" />
                          <div className="bg-composed-wrapper--bg bg-deep-blue opacity-2" />
                          <div className="bg-composed-wrapper--content text-center p-5">
                            <div className="text-white px-0 px-lg-2 px-xl-4">
                              <h1 className="display-3 mb-4 font-weight-bold">
                                Can You Introduce Me?
                              </h1>
                              <p className="font-size-lg mb-0 opacity-8">
                                Our mission is to help connect the world by making it easy for everyone involved to ask for and make introductions.
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
