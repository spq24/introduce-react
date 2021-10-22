import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { authGoogle, authLinkedIn, authMicrosoft, useAuthState, useAuthDispatch } from 'context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  Container,
  Card,
  Button,
  List,
  ListItem
} from '@material-ui/core';
import { NotificationManager } from 'react-notifications';
import GoogleLogin from 'react-google-login';
import { LinkedIn } from 'react-linkedin-login-oauth2';

export default function CreateAccount() {
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  const history = useHistory();
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
  }, [userDetails])

  useEffect(() => {
    const codeString = window.location.search.split('code=')[1]
    if (codeString) {
      setCode(codeString.split('&')[0])
    }
  }, [])

  useEffect(() => {
    if (code && code.length > 0) {
      authMicrosoft(dispatch, code)
        .then(response => {
          if (response.currentUser && response.credentials) {
            history.push('/new-user')
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

  const handleGoogleLogin = (payload) => {
    authGoogle(dispatch, payload.code)
      .then(response => {
        if (response.currentUser && response.credentials) {
          history.push('/new-user')
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
          history.push('/new-user')
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
                    <Grid item lg={12} md={12} sm={12} xs={12} className="d-flex align-items-center justify-content-center flex-column">
                      <div className="d-block d-xl-flex">
                        <div className="p-4">
                          <div className="text-black font-weight-bold font-size-lg mb-1">
                            Let's Get You Signed Up
                            </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid container lg={12} className="d-flex" style={{ justifyContent: 'space-evenly' }}>
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
                    </Grid>
                    <Grid item lg={12} className="d-flex align-items-center justify-content-center flex-column">
                      <div className="p-3">
                        <div className="p-4">
                          <div className="d-block d-xl-flex">
                            <div className="pl-0 pl-xl-3">
                              <div className="text-center text-black-50 mt-3">
                                Already have account?{' '}
                                <Link to='/login' className="text-first">
                                  Login
                                  </Link>
                              </div>
                              <div className="text-center text-black-50 mt-3">
                                By signing up you agree to our {' '}
                                <a href='https://canyouintrome.com/terms' target="_blank" rel="noopener noreferrer" className="text-first">
                                  Terms
                                  </a> and&nbsp;
                                  <a href='https://canyouintrome.com/privacy' target="_blank" rel="noopener noreferrer" className="text-first">
                                  Privacy Policy
                                  </a>
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
