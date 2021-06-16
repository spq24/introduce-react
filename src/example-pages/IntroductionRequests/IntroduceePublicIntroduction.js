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

import hero6 from 'assets/images/hero-bg/hero-1.jpg';

export default function IntroduceePublicIntroduction() {
  const [loading, setLoading] = useState(true)
  const [introduction, setIntroduction] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [handled, setHandled] = useState(false);
  const [acceptRejectStatus, setAcceptRejectStatus] = useState('')
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
             if (intro.completed || intro.introducer_rejected || intro.introducee_rejected || intro.introducee_accepted) {
               setHandled(true)
             }

             if (status && status.length > 0) {
               if (status === 'accepted') {
                 setAcceptRejectStatus('accepted')
               } else if (status === 'denied') {
                 setAcceptRejectStatus('denied')
               }
             }
           })
           .catch(error => {
             console.log('error', error.response)
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

    axios.put(`/api/v1/introducer-accept-reject/${id}`,
      {
        introduction: introduction,
        status: acceptRejectStatus
      },
    ).then(response => {
      NotificationManager.success('Successfully submitted!')
      setSubmitted(true)
      setSubmitting(false)
    }).catch(error => {
      setSubmitting(false)
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.danger(message)
    })
  }

  if(loading) {
    return(
      <>
        <div className="app-wrapper min-vh-100 bg-white">
          <div className="hero-wrapper w-100 bg-composed-wrapper bg-midnight-bloom min-vh-100">
            <div className="flex-grow-1 w-100 d-flex align-items-center">
              <div
                className="bg-composed-wrapper--image opacity-6"
                style={{ backgroundImage: 'url(' + hero6 + ')' }}
              />
              <div className="bg-composed-wrapper--bg bg-second opacity-7" />
              <div className="bg-composed-wrapper--content p-3 p-md-5">
                <Container>
                  <Grid container spacing={6}>
                    <Grid item md={12} className="d-flex justify-content-center" style={{ marginBottom: '50px', flexDirection: 'column', alignItems: 'center' }}>
                      <h1 className="font-size-xxl mb-2 font-weight-bold text-white">
                        Will You Accept This Introduction?
                      </h1>
                    </Grid>
                  </Grid>
                  <Card className="rounded-sm modal-content p-3 bg-white-10">
                    <Card className="rounded-sm overflow-hidden shadow-xxl font-size-sm p-3 p-sm-0">
                      <h2>Loading...</h2>
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
              style={{ backgroundImage: 'url(' + hero6 + ')' }}
            />
            <div className="bg-composed-wrapper--bg bg-second opacity-7" />
            <div className="bg-composed-wrapper--content p-3 p-md-5">
              <Container>
                <Grid container spacing={6}>
                  <Grid item md={12} className="d-flex justify-content-center" style={{ marginBottom: '50px', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="font-size-xl mb-1 text-white" style={{ textAlign: 'center' }}>
                    {`Hey ${introduction.introducee.first_name}`},<br /> {`${introduction.introduction_requester.first_name} ${introduction.introduction_requester.last_name} asked ${introduction.introducer.first_name} ${introduction.introducer.last_name} to make an introduction to you. We are helping to facilitate that introduction.`}
                    </span>
                    <br /><br />
                    <h1 className="font-size-xxl mb-2 font-weight-bold text-white">
                      Will You Accept This Introduction?
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
                                    `Great! Look out for an email soon that will connect you to ${introduction.introduction_requester.first_name} ${introduction.introduction_requester.last_name}. We will Cc ${introduction.introducer.first_name} ${introduction.introducer.last_name} as well.` :
                                    acceptRejectStatus !== '' ?
                                      `Thank you we will let ${introduction.introducer.first_name} ${introduction.introducer.last_name} know.` : null
                                  }
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
                          <Grid container spacing={6}>
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
                                I Accept
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
                                Deny Introduction Request
                              </Button>
                            </Grid>
                            {
                              acceptRejectStatus === 'denied' ?
                                <Grid item md={12}>
                                  <TextField
                                    fullWidth
                                    label={`Can you let ${introduction.introducer.first_name}  ${introduction.introducer.last_name} why you are denying the introduction request?`}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    name="introducee_rejection_reason"
                                    value={introduction.introducee_rejection_reason}
                                    onChange={(e) => handleChange(e)}
                                  />
                                <FormHelperText>{`This will only be sent to ${introduction.introducer.first_name} ${introduction.introducer.last_name}. We will let ${introduction.introduction_requester.first_name} ${introduction.introduction_requester.last_name} know but, we will not share the reason why.`}</FormHelperText>
                                </Grid>
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
