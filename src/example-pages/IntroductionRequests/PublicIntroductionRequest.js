import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  Container,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Card,
  Button,
  List,
  ListItem,
  TextField,
  FormHelperText,
  Avatar
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { NotificationManager } from 'react-notifications';
import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';

export default function PublicIntroductionRequest() {
  const [introducee, setIntroducee] = useState({});
  const [introducer, setIntroducer] = useState({});
  const [requester, setRequester] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { id } = useParams();
  const date = new Date();
  const year = date.getFullYear();

  useEffect(() => {
    if(id) {
      axios.get(`/api/v1/request-introduction/${id}`)
           .then(response => {
             const user = response.data.user
             setIntroducer(user)
             document.title = `Request An Introduction From ${user.first_name} ${user.last_name}`
           })
           .catch(error => {
             let message = error && error.response && error.response.data && error.response.data.message ?
               error.response.data.message : 'There was an error. Please try again!'
             NotificationManager.error(message)
           })
    }
  }, [])

  const handleIntroduceeChange = (e) => {
    const { name, value } = e.target;

    setIntroducee(introducee => ({
      ...introducee,
      [name]: value
    }));
  }

  const handleRequesterChange = (e) => {
    const { name, value } = e.target;

    setRequester(requester => ({
      ...requester,
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
      introducer_id: id,
      requester: requester,
      introducee: introducee
    }

    axios.post('/api/v1/new-introduction-request',
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
    let requesterValid = validateRequester()
    let validData = introduceeValid && requesterValid
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

  const validateRequester = () => {
    const firstName = requester.first_name && requester.first_name.length > 0
    const lastName = requester.last_name && requester.last_name.length > 0
    const requestReason = requester.request_reason && requester.request_reason.length > 0
    const validEmailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
    const email = requester.email && requester.email.length > 0 && validEmailRegex.test(requester.email)

    if (firstName && lastName && email && requestReason) {
      return true
    } else {
      setErrorMessage(
        `Please make sure all required fields are filled in properly.
        You are missing: ${!firstName ? 'First Name' : ''}
        ${!lastName ? 'Last Name' : ''}
        ${!email ? 'Valid Email' : ''}
        ${!requestReason ? 'Request Reason' : ''}`
      )
      return false
    }
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
                    {
                      introducer.image && introducer.image.url ?
                        <div className="avatar-icon-wrapper border-white m-3">
                          <div className="avatar-icon shadow-sm d-100">
                            <img alt={`${introducer.first_name} ${introducer.last_name}`} src={introducer.image.url} />
                          </div>
                        </div> :
                        introducer.first_name && introducer.first_name.length > 0 ?
                          <div className="avatar-icon-wrapper avatar-initials avatar-icon-xl" style={{ marginBottom: '25px' }}>
                            <div className="avatar-icon text-white bg-info">
                              {introducer.first_name[0]}
                            </div>
                          </div>
                          :
                          null
                    }
                    <h1 className="font-size-xxl mb-2 font-weight-bold text-white">
                      {introducer.first_name} {introducer.last_name}
                    </h1>
                    <span className="font-size-xl mb-1 text-white" style={{ textAlign: 'center' }}>
                      Hello! I'd be happy to make an introduction if I am able to. <br />Please let me know who you would like to be introduced to and I will see if I can make it happen.
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
                                  Thank you for submitting your introduction request! I will get back to you soon!
                                </span>
                              </Alert>
                            </Grid>
                            <Grid item md={12} className="d-flex justify-content-center">
                              <Link to="/sign-up">
                                <Button className="btn-info font-weight-bold">
                                  Start Accepting Your Own Introduction Requests
                                </Button>
                              </Link>
                            </Grid>
                          </Grid>
                        </div>
                        :
                        <div className="p-4">
                        <h5 className="font-size-xl mb-1 font-weight-bold">
                          Tell Me About You
                        </h5>
                        <Grid container spacing={6}>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="First Name"
                              name="first_name"
                              variant="outlined"
                              required={true}
                              value={requester.first_name}
                              onChange={(e) => handleRequesterChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="last_name"
                              required={true}
                              variant="outlined"
                              value={requester.last_name}
                              onChange={(e) => handleRequesterChange(e)}
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
                              value={requester.email}
                              onChange={(e) => handleRequesterChange(e)}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <TextField
                              fullWidth
                              label="What should I know about you that will help me make this introduction?"
                              multiline
                              rows={4}
                              variant="outlined"
                              name="requester_introducer_message"
                              value={requester.requester_introducer_message}
                              onChange={(e) => handleRequesterChange(e)}
                            />
                          </Grid>
                        </Grid>
                        <div style={{ margin: '30px 0px' }} />
                          <h5 className="font-size-xl mb-1 font-weight-bold">
                            Who are you looking to be introduced to?
                          </h5>
                          <Grid container spacing={6}>
                            <Grid item md={12}>
                              <TextField
                                fullWidth
                                label="Info about the person"
                                multiline
                                rows={4}
                                variant="outlined"
                                name="about_introducee"
                                required={true}
                                value={introducee.about_introducee}
                                onChange={(e) => handleIntroduceeChange(e)}
                              />
                              <FormHelperText>examples: Job title, company, etc. Make sure I know the right person to introduce you to.</FormHelperText>
                            </Grid>
                          </Grid>
                          <div style={{ margin: '30px 0px' }} />
                          <h6 className="font-size-l mb-1">
                            If you know the person's name put it below (optional)
                          </h6>
                          <Grid container spacing={6}>
                            <Grid item md={6}>
                              <TextField
                                fullWidth
                                label="First Name"
                                name="first_name"
                                variant="outlined"
                                value={introducee.first_name}
                                onChange={(e) => handleIntroduceeChange(e)}
                              />
                            </Grid>
                            <Grid item md={6}>
                              <TextField
                                fullWidth
                                label="Last Name"
                                name="last_name"
                                variant="outlined"
                                value={introducee.last_name}
                                onChange={(e) => handleIntroduceeChange(e)}
                              />
                            </Grid>
                          </Grid>
                          <div style={{ margin: '30px 0px' }} />

                          <h5 className="font-size-xl mb-1 font-weight-bold">
                            How Will This Introduction Help You?
                          </h5>
                          <Grid container spacing={6}>
                            <Grid item md={12}>
                              <TextField
                                fullWidth
                                label="Tell me why you are requesting this introduction"
                                multiline
                                rows={4}
                                variant="outlined"
                                name="request_reason"
                                value={requester.request_reason}
                                onChange={(e) => handleRequesterChange(e)}
                              />
                              <FormHelperText>examples: Curious about a job, looking to learn more, networking, partnership, etc.</FormHelperText>
                            </Grid>
                            <Grid item md={12}>
                              {
                                errorMessage && errorMessage.length > 0 ?
                                  <Grid item md={12} className="d-flex justify-content-center">
                                    <Alert className='text-error' severity='error' style={{ margin: '20px 40px' }}>
                                      {errorMessage}
                                    </Alert><br /><br />
                                  </Grid> : null
                              }
                              <Grid item md={12} className="d-flex justify-content-center">
                                <Button
                                  className="btn-success font-weight-bold"
                                  onClick={handleSubmit}
                                  disabled={submitting}>
                                  Ask For The Introduction
                                </Button>
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
