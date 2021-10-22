import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  Container,
  Card,
  Button,
  TextField,
  Tooltip
} from '@material-ui/core';
import Moment from 'react-moment';
import 'moment-timezone';
import Alert from '@material-ui/lab/Alert';
import { NotificationManager } from 'react-notifications';
import Loader from '../Loader';

export default function PublicIntroFromRequestForIntro() {
  const [loading, setLoading] = useState(true);
  const [introducee, setIntroducee] = useState({});
  const [introducer, setIntroducer] = useState({});
  const [requester, setRequester] = useState({})
  const [requestForIntro, setRequestForIntro] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { id } = useParams();
  const date = new Date();
  const year = date.getFullYear();

  useEffect(() => {
    if (id) {
      axios.get(`/api/v1/request_for_introductions/${id}/public_show`)
        .then(response => {
          setRequestForIntro(response.data.request_for_introduction)
          const requester = response.data.request_for_introduction.user
          setRequester(requester)
          document.title = `Request For Introduction From ${requester.first_name} ${requester.last_name}`
          setLoading(false)
        })
        .catch(error => {
          let message = error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message : 'There was an error. Please try again!'
          NotificationManager.error(message)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleIntroduceeChange = (e) => {
    const { name, value } = e.target;

    setIntroducee(introducee => ({
      ...introducee,
      [name]: value
    }));
  }

  const handleIntroducerChange = (e) => {
    const { name, value } = e.target;

    setIntroducer(introducer => ({
      ...introducer,
      [name]: value
    }));
  }

  const handleSubmit = () => {
    setSubmitting(true)

    let validated = validateData()
    if (!validated) {
      setSubmitting(false)
      return
    }

    let intro = {
      request_for_intro_id: id,
      introducer: introducer,
      introducee: introducee
    }

    axios.post('/api/v1/request-for-intro-new-introduction',
      intro,
    ).then(response => {
      NotificationManager.success('Successfully Submitted. Email sent to introducer to ask for permission.')
      setSubmitted(true)
      setSubmitting(false)
    }).catch(error => {
      setSubmitting(false)
      let message = error && error.response && error.response.message && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }

  const validateData = () => {
    let introduceeValid = validateIntroducee()
    let introducerValid = validateIntroducer()
    let validData = introduceeValid && introducerValid
    return validData
  }

  const validateIntroducee = () => {
    const firstName = introducee.first_name && introducee.first_name.length > 0
    const lastName = introducee.last_name && introducee.last_name.length > 0
    if (firstName && lastName) {
      return true
    } else {
      setErrorMessage(
        `Please make sure all required fields are filled in properly.
        You are missing: ${!firstName ? 'First Name' : ''}
        ${!lastName ? 'Last Name' : ''}`
      )
      return false
    }
  }

  const validateIntroducer = () => {
    const firstName = introducer.first_name && introducer.first_name.length > 0
    const lastName = introducer.last_name && introducer.last_name.length > 0
    const validEmailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
    const email = introducer.email && introducer.email.length > 0 && validEmailRegex.test(introducer.email)

    if (firstName && lastName && email) {
      return true
    } else {
      setErrorMessage(
        `Please make sure all required fields are filled in properly.
        You are missing: ${!firstName ? 'First Name' : ''}
        ${!lastName ? 'Last Name' : ''}
        ${!email ? 'Valid Email' : ''}`
      )
      return false
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
    <div className="app-wrapper min-vh-100 bg-white">
      <div className="hero-wrapper w-100 bg-composed-wrapper bg-midnight-bloom min-vh-100">
        <div className="flex-grow-1 w-100 d-flex align-items-center">
          <div
            className="bg-composed-wrapper--image opacity-6"
            style={{ backgroundImage: 'url(https://ik.imagekit.io/canyouintrome/handshake-close_kmndubvB_.jpeg)' }}
          />
          <div className="bg-composed-wrapper--bg bg-second opacity-7" />
          <div className="bg-composed-wrapper--content p-3 p-md-5">
            <Container>
              <Grid container spacing={6}>
                <Grid item md={12} className="d-flex justify-content-center" style={{ marginBottom: '50px', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="font-size-xl mb-1 text-white" style={{ textAlign: 'center' }}>
                    Hello! Thank you for helping out by trying to make this introduction for {requester.first_name} {requester.last_name}.<br />
                    Fill out the form below, we handle all of the back and forth emails, and we'll keep you in the loop!
                  </span>
                </Grid>
              </Grid>
              <Card className="rounded-sm modal-content p-3 bg-white-10">
                <Card className="rounded-sm overflow-hidden shadow-xxl font-size-sm p-3 p-sm-0">
                  {
                    submitted ?
                      <div className="p-4">
                        <Grid container spacing={6}>
                          <Grid item md={12}>
                            <Alert className="mb-4" severity="success">
                              <span>
                                Thank you for submitting your introduction! We'll keep you in the loop.
                              </span>
                            </Alert>
                          </Grid>
                          <Grid item md={12} className="d-flex justify-content-center">
                            <Link to="/sign-up">
                              <Button className="btn-info font-weight-bold">
                                Set up your profile
                              </Button>
                            </Link>
                          </Grid>
                        </Grid>
                      </div>
                      :
                      <div className="p-4">
                        <div className="d-flex justify-content-end">
                          <FontAwesomeIcon
                            icon={['fas', 'lock']}
                            className="font-size-lg"
                          />&nbsp;&nbsp;
                          <Tooltip arrow title="You and your contact's info is kept private until everyone agrees to the introduction. We ask your contact for permission before making any introductions. If they say no, then we stop the introduction process and let you and the requester know without sharing anyone's contact info. We make sure it is a properly done double opt-in introduction." placement="top">
                            <span><u>What info is shared and how does this work?</u></span>
                          </Tooltip>
                        </div>
                        <h5 className="font-size-xl mb-1 font-weight-bold">
                          Your Info
                        </h5>
                        <Grid container spacing={6}>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="First Name"
                              name="first_name"
                              variant="outlined"
                              required={true}
                              value={introducer.first_name}
                              onChange={(e) => handleIntroducerChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="last_name"
                              required={true}
                              variant="outlined"
                              value={introducer.last_name}
                              onChange={(e) => handleIntroducerChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              type="email"
                              label="Your Email"
                              name="email"
                              required={true}
                              variant="outlined"
                              value={introducer.email}
                              onChange={(e) => handleIntroducerChange(e)}
                            />
                          </Grid>
                        </Grid>
                        <div style={{ margin: '30px 0px' }} />
                        <h5 className="font-size-xl mb-1 font-weight-bold">
                          Who Can You Make An Introduction To?
                        </h5>
                        <Grid container spacing={6}>
                          {
                            errorMessage && errorMessage.length > 0 ?
                              <Grid item md={12} className="d-flex justify-content-center">
                                <Alert className='text-error' severity='error' style={{ margin: '20px 40px' }}>
                                  {errorMessage}
                                </Alert><br /><br />
                              </Grid> : null
                          }
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="First Name"
                              name="first_name"
                              variant="outlined"
                              value={introducee.first_name}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="last_name"
                              variant="outlined"
                              value={introducee.last_name}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              type="email"
                              label={`${introducee.first_name ? `${introducee.first_name}'s` :'Their'} Email`}
                              name="email"
                              required={true}
                              variant="outlined"
                              value={introducee.email}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                          </Grid>
                        </Grid>
                        <div style={{ margin: '30px 0px' }} />

                        <h5 className="font-size-xl mb-1 font-weight-bold">
                          Your Message To {introducee.first_name ? introducee.first_name : 'Them'} {introducee.last_name ? introducee.last_name : null}
                        </h5>
                        <Grid container spacing={6}>
                          <Grid item md={12}>
                            <TextField
                              fullWidth
                              label={`What would you like to say to ${introducee.first_name ? introducee.first_name : 'them'} ${introducee.last_name ? introducee.last_name : ''} about ${requester.first_name} ${requester.last_name}?`}
                              multiline
                              placeholder={`Saw this on Twitter, thought you might want to meet.`}
                              rows={4}
                              variant="outlined"
                              name="introducer_introducee_message"
                              value={introducer.introducer_introducee_message}
                              onChange={(e) => handleIntroducerChange(e)}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <Grid item md={12} className="d-flex justify-content-center">
                              {
                                requestForIntro.closed ?
                                  <Button className="btn-success font-weight-bold" disabled={true}>
                                    Request Closed &nbsp; {<Moment format="MM/DD/YYYY">{requestForIntro.closed_at}</Moment>}
                                  </Button>
                                  :
                                  <Button
                                    className="btn-success font-weight-bold"
                                    onClick={handleSubmit}
                                    disabled={submitting}>
                                    Send Introduction Request
                                  </Button>
                              }
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                  }
                </Card>
              </Card>
            </Container>
          </div>
        </div>
        <div className="hero-footer w-100 pb-4">
          <Container>
            <div className="py-3 d-block d-lg-flex font-size-xs justify-content-between">
              <div className="text-center d-block mb-3 mb-md-0 text-white">
                Copyright &copy; {year} - canyouintro.me
                </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
    </>
  );
}
