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
import { NotificationManager } from 'react-notifications';
import Alert from '@material-ui/lab/Alert';
import Loader from '../../example-components/Loader';
import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';

import hero6 from 'assets/images/hero-bg/particles-2.svg';

export default function PublicIntroductionRequest() {
  const [loading, setLoading] = useState(true)
  const [introduction, setIntroduction] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [handled, setHandled] = useState(false);
  const [acceptRejectStatus, setAcceptRejectStatus] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const params = new URLSearchParams(window.location.search)
  let status = params.get('status')
  const { id } = useParams();
  const date = new Date();
  const year = date.getFullYear();

  useEffect(() => {
    if(id) {
      axios.get(`/api/v1/requested-introduction/${id}`)
           .then(response => {
             let intro = response.data.introduction
             setIntroduction(intro)
             setLoading(false)
             document.title = `${response.data.introduction.introduction_requester.first_name} ${response.data.introduction.introduction_requester.last_name} requested an introduction to ${response.data.introduction.introducee.first_name} ${response.data.introduction.introducee.last_name}`
             if (intro.completed || intro.introducer_rejected || intro.introducer_accepted) {
               setHandled(true)
             }

             if(status && status.length > 0) {
               if(status === 'accepted') {
                 setAcceptRejectStatus('accepted')
               } else if(status === 'denied'){
                 setAcceptRejectStatus('denied')
               }
             }
           })
           .catch(error => {
             let message = error && error.response && error.response.data && error.response.data.message ?
               error.response.data.message : 'There was an error. Please try again!'
             NotificationManager.error(message)
           })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;

    setIntroduction(introduction => ({
      ...introduction,
      [name]: value
    }));
  }

  const handleAcceptRejectChange = (e, status) => {
    e.preventDefault();
    setAcceptRejectStatus(status)
  }

  const handleSubmit = () => {
    setSubmitting(true)
    if (acceptRejectStatus === 'accepted') {
      let validated = validateEmail()
      if (!validated) {
        setSubmitting(false)
        return
      }
    }

    axios.put(`/api/v1/introducer-accept-reject/${id}`,
      {
        introduction: introduction,
        status: acceptRejectStatus
      },
    ).then(response => {
      NotificationManager.success('Successfully Submitted')
      setSubmitted(true)
      setSubmitting(false)
    }).catch(error => {
      setSubmitting(false)
      let message = error && error.response && error.response.message && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }

  const validateEmail = () => {
    const validEmailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
    const email = introduction.introducee_email && introduction.introducee_email.length > 0 && validEmailRegex.test(introduction.introducee_email)
    if(email) {
      return true
    } else {
      setErrorMessage(
        `Please make sure the email you entered for ${introduction.introducee.first_name} ${introduction.introducee.last_name}`
      )
      return false
    }
  }

  if(loading) {
    return(
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
                      <h1 className="font-size-xxl mb-2 font-weight-bold text-white">
                        Can You Make This Introduction?
                      </h1>
                    </Grid>
                  </Grid>
                  <Card className="rounded-sm modal-content p-3 bg-white-10">
                    <Card className="rounded-sm overflow-hidden shadow-xxl font-size-sm p-3 p-sm-0">
                      <Loader />
                    </Card>
                  </Card>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="app-wrapper min-vh-100 bg-white">
        <div className="hero-wrapper w-100 bg-composed-wrapper bg-midnight-bloom min-vh-100">
          <div className="flex-grow-1 w-100 d-flex align-items-center">
            <div
              className="bg-composed-wrapper--image opacity-6"
              style={{ backgroundImage: 'url(https://ik.imagekit.io/canyouintrome/handshake_iicHlCH4N?tr=w-480,h-480,fo-auto)' }}
            />
            <div className="bg-composed-wrapper--bg bg-second opacity-7" />
            <div className="bg-composed-wrapper--content p-3 p-md-5">
              <Container>
                <Grid container spacing={6}>
                  <Grid item md={12} className="d-flex justify-content-center" style={{ marginBottom: '50px', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="font-size-xl mb-1 text-white" style={{ textAlign: 'center' }}>
                    {`Hey ${introduction && introduction.introducer ? introduction.introducer.first_name : ''}`},<br /> {`${introduction && introduction.introduction_requester ? introduction.introduction_requester.first_name : ''} ${introduction && introduction.introduction_requester ? introduction.introduction_requester.last_name : ''} was wondering if you could make an introduction to ${introduction && introduction.introducee ? introduction.introducee.first_name : ''} ${introduction && introduction.introducee ? introduction.introducee.last_name : ''}!`}
                    </span>
                    <br /><br />
                    <h1 className="font-size-xxl mb-2 font-weight-bold text-white">
                      Can You Make This Introduction?
                    </h1>
                  </Grid>
                </Grid>
                <Card className="rounded-sm modal-content p-3 bg-white-10">
                  <Card className="rounded-sm overflow-hidden shadow-xxl font-size-sm p-3 p-sm-0">
                    {
                      handled || submitted ?
                        <div className="p-4">
                          <Grid container spacing={6}>
                            <Grid item md={12}>
                              <Alert className="mb-4" severity="success">
                                <span>
                                  {
                                    handled ?
                                      "This introduction request has already been responded to. Nothing to do." :
                                      null
                                  }
                                  {
                                    submitted && acceptRejectStatus == 'accepted' ?
                                    `Thank you we will let ${introduction.introduction_requester.first_name} ${introduction.introduction_requester.last_name} know and send an email to ${introduction.introducee.first_name} ${introduction.introducee.last_name}` :
                                    acceptRejectStatus !== '' ?
                                      `Thank you we will let ${introduction.introduction_requester.first_name} ${introduction.introduction_requester.last_name} know.` : null
                                  }
                                </span>
                              </Alert>
                            </Grid>
                            <Grid item md={12} className="d-flex justify-content-center">
                              <Link to="/login">
                                <Button className="btn-info font-weight-bold">
                                  Check Out Your Dashboard
                                </Button>
                              </Link>
                            </Grid>
                          </Grid>
                        </div>
                        :
                        <div className="p-4">
                          <Grid container spacing={6}>
                            <Grid item md={12}>
                              {
                                errorMessage && errorMessage.length > 0 ?
                                  <Alert className='text-error mb-4' severity='error' style={{ margin: '20px 40px' }}>
                                    {errorMessage}
                                  </Alert> : null
                              }
                            </Grid>
                            <Grid item md={6} className="d-flex justify-content-center">
                              <Button
                                className={`btn-${acceptRejectStatus === 'accepted' ? 'success' : 'outline-success'} font-weight-bold`}
                                onClick={(e) => handleAcceptRejectChange(e, 'accepted')}
                                disabled={submitting}>
                                {
                                  acceptRejectStatus == 'accepted' ?
                                    <>
                                      <span className="btn-wrapper--icon text-white">
                                        <FontAwesomeIcon icon={['fas', 'check-square']} />
                                      </span>&nbsp;
                                    </> : null
                                }
                                I can make this introduction
                              </Button>
                            </Grid>
                            <Grid item md={6} className="d-flex justify-content-center">
                              <Button
                                className={`btn-${acceptRejectStatus === 'denied' ? 'danger' : 'outline-danger'} font-weight-bold`}
                                onClick={(e) => handleAcceptRejectChange(e, 'denied')}
                                disabled={submitting}>
                                {
                                  acceptRejectStatus == 'denied' ?
                                    <>
                                      <span className="btn-wrapper--icon text-white">
                                        <FontAwesomeIcon icon={['fas', 'check-square']} />
                                      </span>&nbsp;
                                    </> : null
                                }
                                I will not be able to make this introduction
                              </Button>
                            </Grid>
                            {
                              acceptRejectStatus === 'denied' ?
                                <Grid item md={12}>
                                  <TextField
                                    fullWidth
                                    label={`Let ${introduction.introduction_requester.first_name} ${introduction.introduction_requester.last_name} know why you can not make this introduction`}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    name="rejection_reason"
                                    value={introduction.rejection_reason}
                                    onChange={(e) => handleChange(e)}
                                  />
                                </Grid>
                                : null
                            }

                            {
                              acceptRejectStatus === 'accepted' ?
                                <>
                                  <Grid item md={12}>
                                    <TextField
                                      fullWidth
                                      label={`What is ${introduction.introducee.first_name} ${introduction.introducee.last_name}'s email?`}
                                      variant="outlined"
                                      type="email"
                                      name="introducee_email"
                                      value={introduction.introducee_email}
                                      onChange={(e) => handleChange(e)}
                                    />
                                  </Grid>
                                  <Grid item md={12}>
                                    <TextField
                                      fullWidth
                                      label={`What would you like to say to ${introduction.introducee.first_name} ${introduction.introducee.last_name} about ${introduction.introduction_requester.first_name} ${introduction.introduction_requester.last_name}?`}
                                      multiline
                                      rows={4}
                                      variant="outlined"
                                      name="introducer_introducee_message"
                                      value={introduction.introducer_introducee_message}
                                      onChange={(e) => handleChange(e)}
                                    />
                                  </Grid>
                                </>
                                : null
                            }

                            <Grid item md={12} className="d-flex justify-content-center">
                              <Button
                                className="btn-primary font-weight-bold"
                                onClick={handleSubmit}
                                disabled={submitting}>
                                Submit
                              </Button>
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
