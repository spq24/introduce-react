import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { auth, authGoogle, authLinkedIn, authMicrosoft, useAuthState, useAuthDispatch } from 'context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  Container,
  Card,
  Button,
  List,
  ListItem,
  TextField
} from '@material-ui/core';
import { NotificationManager } from 'react-notifications';
import GoogleLogin from 'react-google-login';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import MicrosoftLogin from "react-microsoft-login";
import hero3 from '../../../assets/images/hero-bg/hero-5.jpg';

export default function SignUp() {
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  const history = useHistory();
  const [user, setUser] = useState({});
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [code, setCode] = useState('');
  const date = new Date();
  const year = date.getFullYear();
  const PRODUCTION_URL = 'https://canyouintro.me'

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
        history.push('/dashboard')
      })
    }
  }, [])

  useEffect(() => {
    const codeString = window.location.search.split('code=')[1]
    if (codeString) {
      setCode(codeString.split('&')[0])
    }
  }, [])

  useEffect(() => {
    if(code && code.length > 0) {
      authMicrosoft(dispatch, code)
        .then(response => {
          if (response.currentUser && response.credentials) {
            history.push('/dashboard')
          }
        })
        .catch(error => {
          let message = error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message : 'There was an error. Please try again!'
          NotificationManager.error(message)
        })
    }
  }, [code])

  let url = () => {
    let hostname = window.location.hostname
    let protocol = window.location.protocol
    let port = window.location.port
    return hostname === 'localhost' ? `${protocol}//${hostname}:${port}` : PRODUCTION_URL
  }

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisableSubmit(true)

    axios.post('/api/v1/users', {
      user: user
    }, {
      'Content-Type': 'application/json'
    })
    .then(response => {
      loginUser();
    }).catch(error => {
      setDisableSubmit(false)
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
       NotificationManager.error(message)
    })
  }

  const loginUser = () => {
    auth(dispatch, user.email, user.password)
    .then(response => {
      if (response.currentUser && response.credentials) {
        history.push('/dashboard')
      }
    })
    .catch(error => {
      let message = error && error.response && error.response.message && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
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
      let message = error && error.response && error.response.message && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
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
        let message = error && error.response && error.response.message && error.response.data.message ?
          error.response.data.message : 'There was an error. Please try again!'
        NotificationManager.error(message)
      })
  }

  return (
    <>
      <div className="app-wrapper min-vh-100 bg-white">
        <div className="hero-wrapper w-100 bg-composed-wrapper bg-light-pure min-vh-100">
          <div className="flex-grow-1 w-100 d-flex align-items-center">
            <div
              className="bg-composed-wrapper--image opacity-6"
              style={{ backgroundImage: 'url(https://images.pexels.com/photos/1181715/pexels-photo-1181715.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=300)' }}
            />
            <div className="bg-composed-wrapper--bg bg-second opacity-7" />
            <div className="bg-composed-wrapper--bg bg-premium-dark opacity-5" />
            <div className="bg-composed-wrapper--content p-3 p-md-5">
              <Container>
                <Card className="rounded-sm modal-content p-3 bg-white-10">
                  <Card className="rounded-sm shadow-none font-size-sm p-3 p-sm-0">
                    <Grid container spacing={0}>
                      <Grid
                        item
                        lg={6}
                        className="d-flex align-items-center justify-content-center flex-column">
                        <div className="divider-v divider-v-lg d-none d-lg-block" />
                        <div className="text-center mt-4">
                          <h1 className="font-size-xxl mb-1 font-weight-bold">
                            Create account
                          </h1>
                          <p className="mb-0 text-black-50">
                            Let's Get You Connected!
                          </p>
                        </div>
                        <div className="px-5 py-4">
                          <div className="mb-3">
                            <Grid container spacing={6}>
                              <Grid item md={6}>
                                <div>
                                  <label className="font-weight-bold mb-2">
                                    First name
                                  </label>
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    placeholder="Enter your first name"
                                    name="first_name"
                                    onChange={(e) => handleChange(e)}
                                  />
                                </div>
                              </Grid>
                              <Grid item md={6}>
                                <div>
                                  <label className="font-weight-bold mb-2">
                                    Last name
                                  </label>
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    placeholder="Enter your last name"
                                    name="last_name"
                                    onChange={(e) => handleChange(e)}
                                  />
                                </div>
                              </Grid>
                            </Grid>
                          </div>
                          <div className="mb-3">
                            <label className="font-weight-bold mb-2">
                              Your Work Title
                            </label>
                            <TextField
                              variant="outlined"
                              size="small"
                              fullWidth
                              placeholder="Enter your work title"
                              type="title"
                              name="title"
                              onChange={ (e) => handleChange(e) }
                            />
                          </div>
                          <div className="mb-3">
                            <label className="font-weight-bold mb-2">
                              Email
                            </label>
                            <TextField
                              variant="outlined"
                              size="small"
                              fullWidth
                              placeholder="Enter your email address"
                              type="email"
                              name="email"
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between">
                              <label className="font-weight-bold mb-2">
                                Password
                              </label>
                            </div>
                            <TextField
                              variant="outlined"
                              size="small"
                              fullWidth
                              placeholder="Enter your password"
                              type="password"
                              name="password"
                              onChange={(e) => handleChange(e)}
                            />
                          </div>

                          <div className="my-4">
                            By clicking the <strong>Create account</strong>{' '}
                            button below you agree to our terms of service and
                            privacy statement.
                          </div>
                          <div className="text-center mb-4">
                            <Button className="btn-primary text-uppercase font-weight-bold font-size-sm my-3" disabled={disableSubmit} onClick={ (e) => handleSubmit(e) }>
                              Create account
                            </Button>
                          </div>
                        </div>
                      </Grid>
                      <Grid
                        item
                        lg={6}
                        className="d-flex align-items-center justify-content-center flex-column">
                        <div className="p-3">
                          <div className="p-4">
                            <div className="d-block d-xl-flex">
                              <div className="pl-0 pl-xl-3">
                                <div className="text-black font-weight-bold font-size-lg mb-1">
                                  Create Your Account With A Service
                                </div>
                                <GoogleLogin
                                  clientId="76583804160-hikjh5kp20nqpu701d17hemqum1mfbnt.apps.googleusercontent.com"
                                  onSuccess={handleGoogleLogin}
                                  onFailure={handleGoogleLogin}
                                  responseType='code'
                                  accessType='offline'
                                  render={renderProps => (
                                    <Button className="btn-google m-2" onClick={renderProps.onClick}>
                                      <span className="btn-wrapper--icon">
                                        <FontAwesomeIcon
                                          icon={['fab', 'google']}
                                          className="font-size-lg"
                                        />
                                      </span>
                                      <span className="btn-wrapper--label">Sign Up With Google</span>
                                    </Button>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="d-block d-xl-flex">
                              <div className="pl-0 pl-xl-3">
                              <LinkedIn
                                clientId="77kyaj6hcodakv"
                                onFailure={handleLinkedinLogin}
                                onSuccess={handleLinkedinLogin}
                                scope='r_liteprofile r_emailaddress'
                                redirectUri={`${url()}/linkedin`}
                                renderElement={({ onClick, disabled }) => (
                                  <Button className="btn-linkedin m-2" onClick={onClick} disabled={disabled}>
                                    <span className="btn-wrapper--icon">
                                      <FontAwesomeIcon
                                        icon={['fab', 'linkedin']}
                                        className="font-size-lg"
                                      />
                                    </span>
                                    <span className="btn-wrapper--label">Sign Up With LinkedIn</span>
                                  </Button>
                                )}
                              />
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="d-block d-xl-flex">
                              <div className="pl-0 pl-xl-3">
                                <a href={`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=55bf2567-f8d2-4dba-988d-8a240f4621b5&response_type=code&redirect_uri=${url()}%2Flogin%2F&response_mode=query&scope=offline_access%20user.read%20`}>
                                  <Button className="btn-microsoft m-2">
                                    <span className="btn-wrapper--icon">
                                      <FontAwesomeIcon
                                        icon={['fab', 'microsoft']}
                                        className="font-size-lg"
                                      />
                                    </span>
                                    <span className="btn-wrapper--label">Sign Up With Microsoft</span>
                                  </Button>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="d-block d-xl-flex">
                              <div className="pl-0 pl-xl-3">
                                <div className="text-center text-black-50 mt-3">
                                  Already have account?{' '}
                                  <Link to='/login' className="text-first">
                                    Sign in
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </Card>
                </Card>
              </Container>
            </div>
          </div>
          <div className="hero-footer w-100 pb-4">
            <Container>
              <div className="py-3 d-block d-lg-flex font-size-xs justify-content-between">
                <div className="text-center d-block mb-3 mb-md-0 text-white">
                  Copyright &copy; {year} - Can You Intro Me
                </div>
                <List
                  component="div"
                  className="nav-transparent text-nowrap d-flex justify-content-center">
                  <ListItem
                    button
                    className="text-white-50"
                    href="#/"
                    onClick={(e) => e.preventDefault()}>
                    Privacy Policy
                  </ListItem>
                  <ListItem
                    button
                    className="text-white-50"
                    href="#/"
                    onClick={(e) => e.preventDefault()}>
                    Terms of Service
                  </ListItem>
                </List>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}
