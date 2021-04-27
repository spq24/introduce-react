import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
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
import { auth, authGoogle, useAuthState, useAuthDispatch } from 'context'
import GoogleLogin from 'react-google-login';

export default function Login() {
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    auth(dispatch, email, password)
    .then(response => {
      console.log('response', response)
      if (response.currentUser && response.credentials) {
        history.push('/dashboard')
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
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
                            >
                            </GoogleLogin>
                            <Button
                              className="m-2 btn-pill px-4 font-weight-bold btn-facebook"
                              size="small">
                              <span className="btn-wrapper--icon">
                                <FontAwesomeIcon icon={['fab', 'facebook']} />
                              </span>
                              <span className="btn-wrapper--label">
                                Login with Facebook
                              </span>
                            </Button>
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
                                Bamburgh React Admin Dashboard with Material-UI
                                PRO
                              </h1>
                              <p className="font-size-lg mb-0 opacity-8">
                                Premium admin template powered by the most
                                popular UI components framework available for
                                React: Material-UI. Features hundreds of
                                examples making web development fast and easy.
                                Start from one of the individual apps included
                                or from the general dashboard and build
                                beautiful scalable applications and presentation
                                websites.
                              </p>
                              <div className="divider mx-auto border-1 my-5 border-light opacity-2 rounded w-25" />
                              <div>
                                <Button className="btn-success px-5 font-size-sm font-weight-bold btn-animated-icon text-uppercase rounded shadow-none py-3 hover-scale-sm hover-scale-lg">
                                  <span className="btn-wrapper--label">
                                    See Features List
                                  </span>
                                  <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon
                                      icon={['fas', 'arrow-right']}
                                    />
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="hero-footer pb-4">
                          <List
                            component="div"
                            className="nav-pills nav-neutral-secondary d-flex">
                            <Tooltip title="Facebook" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'facebook']} />
                              </ListItem>
                            </Tooltip>

                            <Tooltip title="Twitter" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'twitter']} />
                              </ListItem>
                            </Tooltip>

                            <Tooltip title="Google" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'google']} />
                              </ListItem>
                            </Tooltip>

                            <Tooltip title="Instagram" arrow>
                              <ListItem
                                component="a"
                                button
                                href="#/"
                                onClick={(e) => e.preventDefault()}
                                className="font-size-lg text-white-50">
                                <FontAwesomeIcon icon={['fab', 'instagram']} />
                              </ListItem>
                            </Tooltip>
                          </List>
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
