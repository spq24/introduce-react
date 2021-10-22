import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'context';
import { useParams } from 'react-router-dom';
import { Avatar, Card, Grid, Button, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'react-moment';
import 'moment-timezone';
import { NotificationManager } from 'react-notifications';
import Loader from '../Loader';

export default function IntroductionRequest(props) {
  const { id } = useParams();
  const userDetails = useAuthState();
  const [loading, setLoading] = useState(true);
  const [introductionRequest, setIntroductionRequest] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [handled, setHandled] = useState(false);
  const [acceptRejectStatus, setAcceptRejectStatus] = useState('')
  const [introducerStatus, setIntroducerStatus] = useState({
    title: '',
    date: '',
    description: '',
    color: 'default'
  })
  const [introduceeStatus, setIntroduceeStatus] = useState({
    title: '',
    date: '',
    description: '',
    color: 'default'
  })
  const [status, setStatus] = useState({
    title: '',
    color: 'default',
    date: null
  })

  useEffect(() => {
    axios.get(`/api/v1/introduction_requests/${id}`, {
      headers: userDetails.credentials
    })
    .then(response => {
      let intro = response.data.introduction_request
      setIntroductionRequest(intro)
      if (intro.completed || intro.introducer_rejected || intro.introducer_accepted) {
        setHandled(true)
      }
      setLoading(false)
    })
    .catch(error => {
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (introductionRequest.introducer_rejected) {
      setIntroducerStatus({
        shortTitle: 'Denied',
        title: 'You denied the request',
        description: `You denied this introduction request. Here was the reason you gave: ${introductionRequest.rejection_reason}`,
        date: introductionRequest.introducer_rejected_at,
        color: 'danger'
      })
    } else if (introductionRequest.introducer_accepted) {
      setIntroducerStatus({
        shortTitle: 'Accepted',
        title: 'You Accepted',
        description: `You agreed to make the introduction. We sent off an email to your contact to see if they agree.`,
        date: introductionRequest.introducer_accepted_at,
        color: 'success'
      })
    } else {
      setIntroducerStatus({
        shortTitle: 'Sent',
        title: `Waiting on you`,
        description: 'You were asked to make this introduction. We are waiting for you to decide what you would like to do. Check out the buttons below.',
        date: introductionRequest.created_at,
        color: 'warning'
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introductionRequest])

  useEffect(() => {
    if (introductionRequest.introducer_rejected) {
      setIntroduceeStatus({
        shortTitle: 'You Denied',
        title: introductionRequest.introducer && introductionRequest.introducer.first_name ? `${introductionRequest.introducer.first_name} denied the request` : 'The request was denied.',
        description: `You denied the introduction request`,
        date: '',
        color: 'default'
      })
    } else if (!introductionRequest.introducer_sent_request) {
      setIntroduceeStatus({
        shortTitle: 'Pending',
        title: `Pending`,
        description: `We are waiting on you to decide what to do with the request before we send anything to your contact.`,
        date: '',
        color: 'info'
      })
    } else if (introductionRequest.introducee_accepted) {
      setIntroduceeStatus({
        shortTitle: 'Accepted',
        title: `They agreed!`,
        description: `${introductionRequest.introducee && introductionRequest.introducee.first_name.length > 0 ? introductionRequest.introducee.first_name : 'They'} agreed to the introduction. We sent an email to everyone to make the introduction happen.`,
        date: introductionRequest.introducee_accepted_at,
        color: 'success'
      })
    } else if (introductionRequest.introducee_rejected) {
      setIntroduceeStatus({
        shortTitle: 'Denied',
        title: `Your contact denied the request.`,
        description: `Your contact ${introductionRequest.introducee ? introductionRequest.introducee.first_name : null} ${introductionRequest.introducee ? introductionRequest.introducee.last_name : null} denied the introduction request.`,
        date: introductionRequest.introducee_rejected_at,
        color: 'danger'
      })
    } else {
      setIntroduceeStatus({
        shortTitle: 'Pending',
        title: `Request Sent`,
        description: `We sent the request${introductionRequest.introducee ? ` to ${introductionRequest.introducee.first_name}!` : ' to your contact!'} We are waiting to hear back.`,
        date: introductionRequest.introducer_sent_request_at,
        color: 'warning'
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introductionRequest])

  useEffect(() => {
    if (introductionRequest.introducer_rejected) {
      setStatus({
        title: 'You Denied',
        color: 'danger',
        date: introductionRequest.introducer_rejected_at
      })
    } else if (introductionRequest.introducer_accepted && !introductionRequest.introducee_rejected && !introductionRequest.introducee_accepted) {
      setStatus({
        title: 'Request Sent To Your Contact',
        color: 'warning',
        date: introductionRequest.introducer_accepted_at
      })
    } else if (introductionRequest.introducee_rejected) {
      setStatus({
        title: 'Your contact Denied',
        color: 'danger',
        date: introductionRequest.introducee_rejected_at
      })
    } else if (introductionRequest.completed) {
      setStatus({
        title: 'Complete',
        color: 'success',
        date: introductionRequest.completed_at
      })
    } else {
      setStatus({
        title: 'Waiting On You',
        color: 'info',
        date: null
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introductionRequest])

  const handleChange = (e) => {
    const { name, value } = e.target;

    setIntroductionRequest(introductionRequest => ({
      ...introductionRequest,
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
        introduction: introductionRequest,
        status: acceptRejectStatus
      },
    ).then(response => {
      setIntroductionRequest(response.data.introduction)
      NotificationManager.success('Successfully Submitted')
      setSubmitted(true)
      setSubmitting(false)

    }).catch(error => {
      setSubmitting(false)
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item lg={4}>
          <div className="timeline-list mb-5">
            <div className="timeline-item">
              <div className="timeline-item--content">
                <div className={`timeline-item--icon bg-${introducerStatus.color}`} />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  Introduction Requested -<span>&nbsp;</span> <Moment format="MM/DD/YYYY">{introductionRequest.created_at}</Moment>
                </h4>
                <p>{introductionRequest.introduction_requester ? `${introductionRequest.introduction_requester.first_name} ${introductionRequest.introduction_requester.last_name}` : 'Someone'} asked you to introduce them to {introductionRequest.introducee ? `${introductionRequest.introducee.first_name} ${introductionRequest.introducee.last_name}` : 'Someone'}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-item--content">
                <div className={`timeline-item--icon bg-${introducerStatus.color}`} />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  {introducerStatus.title} - <span>&nbsp;</span>
                  {
                    introducerStatus.date && introducerStatus.date.length > 0 ?
                      <Moment format="MM/DD/YYYY">{introducerStatus.date}</Moment> : null
                  }
                </h4>
                <p>{introducerStatus.description}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-item--content">
                <div className={`timeline-item--icon bg-${introduceeStatus.color}`} />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  {introduceeStatus.title} - <span>&nbsp;</span>
                  {
                    introduceeStatus.date && introduceeStatus.date.length > 0 ?
                      <Moment format="MM/DD/YYYY">{introduceeStatus.date}</Moment> : null
                  }
                </h4>
                <p>{introduceeStatus.description}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-item--content">
                <div className={`timeline-item--icon bg-${status.color}`} />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  Overall Status
                </h4>
                <div className="mt-2">
                  <Button size="small" className={`btn-${status.color}`}>
                    {status.title}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item lg={8}>
          <Grid container spacing={6}>
            <Grid item lg={6}>
              <Card className="card-box p-4 bg-night-sky text-white" style={{ minHeight: '245px' }}>
                <div className="text-center">
                  <div className="avatar-icon-wrapper rounded-circle m-0">
                    <Avatar>
                      {introductionRequest.introduction_requester ? introductionRequest.introduction_requester.first_name[0] : 'NA'}
                    </Avatar>
                  </div>
                  <h3 className="font-weight-bold mt-3">
                    {
                      introductionRequest.introduction_requester ? `${introductionRequest.introduction_requester.first_name} ${introductionRequest.introduction_requester.last_name}` : 'No Name'
                    }
                  </h3>
                  <div className={`badge badge-info mt-1 mb-4 font-size-xs px-4 py-1 h-auto`}>
                    Introduction <br />Requester
                  </div>
                </div>
              </Card>
            </Grid>
            <Grid item lg={6}>
              <Card className="card-box bg-midnight-bloom text-white p-4" style={{ minHeight: '245px' }}>
                <div className="text-center">
                  <div className="avatar-icon-wrapper rounded-circle m-0">
                    <Avatar>
                      {introductionRequest.introducee ? introductionRequest.introducee.first_name[0] : 'NA'}
                    </Avatar>
                  </div>
                  <h3 className="font-weight-bold mt-3">
                    {introductionRequest.introducee ? `${introductionRequest.introducee.first_name} ${introductionRequest.introducee.last_name}` : 'Introducee'}
                  </h3>
                  <div className={`badge badge-${introduceeStatus.color} mt-1 mb-4 font-size-xs px-4 py-1 h-auto`}>
                   Introducee <br /> Request Status: <br />{introduceeStatus.shortTitle}
                  </div>
                </div>
              </Card>
            </Grid>
            <Grid item lg={12}>
              <Card className="overflow-hidden shadow-xxl font-size-sm" style={{ padding: '50px', borderRadius: '0.75rem' }}>
                <Grid container spacing={6}>
                  {
                    handled || submitted ?
                      <div className="p-4">
                        <Grid container spacing={6}>
                          <Grid item md={12} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Alert className="mb-4" severity="success">
                              <span>
                                {
                                  handled ?
                                    "This introduction request has already been responded to. Nothing to do." :
                                    null
                                }
                                {
                                  submitted && acceptRejectStatus === 'accepted' ?
                                    `Thank you we will let ${introductionRequest.introduction_requester.first_name} ${introductionRequest.introduction_requester.last_name} know and send an email to ${introductionRequest.introducee ? introductionRequest.introducee.first_name : null} ${introductionRequest.introducee ? introductionRequest.introducee.last_name : null}` :
                                    acceptRejectStatus !== '' ?
                                      `Thank you we will let ${introductionRequest.introduction_requester.first_name} ${introductionRequest.introduction_requester.last_name} know.` : null
                                }
                              </span>
                            </Alert>
                          </Grid>
                        </Grid>
                      </div> :
                      <>
                        <Grid item md={12} className="d-flex justify-content-center" style={{ paddingBottom: '5px' }}>
                          <p className="display-4 font-weight-bold" >
                            Can you make this introduction?
                          </p>
                        </Grid>
                        <Grid item md={6} className="d-flex justify-content-center">
                          <Button
                            className={`btn-${acceptRejectStatus === 'accepted' ? 'success' : 'outline-success'} font-weight-bold`}
                            onClick={(e) => handleAcceptRejectChange(e, 'accepted')}
                            disabled={submitting}>
                            {
                              acceptRejectStatus === 'accepted' ?
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
                              acceptRejectStatus === 'denied' ?
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
                                label={`Let ${introductionRequest.introduction_requester.first_name} ${introductionRequest.introduction_requester.last_name} know why you can not make this introduction`}
                                multiline
                                rows={4}
                                variant="outlined"
                                name="rejection_reason"
                                value={introductionRequest.rejection_reason}
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
                                label={`What is ${introductionRequest.introducee ? introductionRequest.introducee.first_name : null} ${introductionRequest.introducee ? introductionRequest.introducee.last_name : null}'s email?`}
                                variant="outlined"
                                type="email"
                                name="introducee_email"
                                value={introductionRequest.introducee_email}
                                onChange={(e) => handleChange(e)}
                              />
                            </Grid>
                            <Grid item md={12}>
                              <TextField
                                fullWidth
                                label={`What would you like to say to ${introductionRequest.introducee ? introductionRequest.introducee.first_name : null} ${introductionRequest.introducee ? introductionRequest.introducee.last_name : null} about ${introductionRequest.introduction_requester.first_name} ${introductionRequest.introduction_requester.last_name}?`}
                                multiline
                                rows={4}
                                variant="outlined"
                                name="introducer_introducee_message"
                                value={introductionRequest.introducer_introducee_message}
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
                          {submitting ? <Loader /> : null}
                        </Grid>
                      </>
                  }
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
