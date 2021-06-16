import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'context';
import { useParams } from 'react-router-dom';
import { Avatar, Card, Grid, Button, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'react-moment';
import 'moment-timezone';
import { NotificationManager } from 'react-notifications';

import avatar2 from 'assets/images/avatars/avatar2.jpg';
import avatar3 from 'assets/images/avatars/avatar3.jpg';

export default function Introductions(props) {
  const userDetails = useAuthState();
  const [introduction, setIntroduction] = useState([]);
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
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/api/v1/introductions/${id}`, {
      headers: userDetails.credentials
    })
    .then(response => {
      setIntroduction(response.data.introduction)
    })
    .catch(error => {
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }, [])

  useEffect(() => {
    if(!introduction.introducer_sent_request) {
      setIntroduceeStatus({
        shortTitle: 'Waiting On Intro Request',
        title: introduction.introducer ? `We are waiting on ${introduction.introducer.first_name} to send the request` : 'We are waiting on your introduction request to be sent.',
        description: `Your introduction request has not been sent ${introduction.introducee ? `to ${introduction.introducee.first_name}` : ''} yet`,
        date: '',
        color: 'info'
      })
    } else if (introduction.introducee_rejected) {
      setIntroduceeStatus({
        shortTitle: 'Denied',
        title: introduction.introducee ? `${introduction.introducee.first_name} denied your introduction request` : 'Your introduction request was denied',
        description: `Unfortunately, your request was denied${introduction.introducee ? ` by ${introduction.introducee.first_name}.` : '.'}`,
        date: introduction.introducee_rejected_at,
        color: 'danger'
      })
    } else if (introduction.introducee_accepted) {
      setIntroduceeStatus({
        shortTitle: 'Accepted',
        title: introduction.introducee ? `${introduction.introducee.first_name} agreed to be introduced to you!` : 'Your introduction request was accepted!',
        description: `${introduction.introducee ? `${introduction.introducee.first_name} has` : 'They have'} agreed ${introduction.introducer ? `to have${introduction.introducer.first_name}!` : 'to be introduced to you!'}`,
        date: introduction.introducer_rejected_at,
        color: 'success'
      })
    } else {
      setIntroduceeStatus({
        shortTitle: 'Pending',
        title: `A request was sent and we are waiting to hear back`,
        description: `${introduction.introducer ? `${introduction.introducer.first_name} has` : 'They have'} sent an introduction request to ${introduction.introducee ? introduction.introducee.first_name : 'to the person you asked to be introduced to!'}`,
        date: introduction.introducer_sent_request_at,
        color: 'warning'
      })
    }
  }, [introduction])

  useEffect(() => {
    if (introduction.introducer_rejected) {
      setIntroducerStatus({
        shortTitle: 'Rejected',
        title: introduction.introducer ? `${introduction.introducer.first_name} denied your introduction request` : 'Your introduction request was denied',
        description: `Unfortunately, your request was denied. This is what they said in their reason: ${introduction.rejection_reason}`,
        date: introduction.introducer_rejected_at,
        color: 'danger'
      })
    } else if (introduction.introducer_accepted) {
      setIntroducerStatus({
        shortTitle: 'Accepted',
        title: introduction.introducer ? `${introduction.introducer.first_name} agreed to introduce you ${introduction.introducee ? `to ${introduction.introducee.first_name}` : ''}` : 'Your introduction request was accepted!',
        description: `We will keep you updated as the status changes!`,
        date: introduction.introducer_accepted_at,
        color: 'success'
      })
    } else {
      setIntroducerStatus({
        shortTitle: 'Sent',
        title: `We sent your request and we are waiting to hear back`,
        description: introduction.introducer ? `We are waiting to hear back from ${introduction.introducer.first_name} on your introduction request ${introduction.introducee ? `to ${introduction.introducee.first_name}` : ''}. We will let you know when we hear anything!` : 'We are waiting to hear back on your introduction request. We will let you know when we hear something!',
        date: introduction.created_at,
        color: 'warning'
      })
    }
  }, [introduction])

  useEffect(() => {
    if(introduction.introducer_rejected) {
      setStatus({
        title: 'Introducer Denied',
        color: 'warning',
        date: introduction.introducer_rejected_at
      })
    } else if(introduction.introducee_rejected) {
      setStatus({
        title: 'Introducee Denied',
        color: 'danger',
        date: introduction.introducee_rejected_at
      })
    } else if(introduction.completed) {
      setStatus({
        title: 'Complete',
        color: 'success',
        date: introduction.completed_at
      })
    } else {
      setStatus({
        title: 'Pending',
        color: 'info',
        date: null
      })
    }
  }, [introduction])


  return (
    <>
      <Grid container spacing={6}>
        <Grid item lg={4}>
          <div className="timeline-list mb-5">
            <div className="timeline-item">
              <div className="timeline-item--content">
                <div className={`timeline-item--icon bg-${introducerStatus.color}`} />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  Introduction Sent -<span>&nbsp;</span> <Moment format="MM/DD/YYYY">{introduction.created_at}</Moment>
                </h4>
                <p>You asked {introduction.introducer ? `${introduction.introducer.first_name} ${introduction.introducer.last_name}` : ''} to introduce you to {introduction.introducee ? `${introduction.introducee.first_name} ${introduction.introducee.last_name}` : ''}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-item--content">
                <div className={`timeline-item--icon bg-${introducerStatus.color}`} />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  {introducerStatus.title} - <span>&nbsp;</span>{
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
                  {introduceeStatus.title} {introduceeStatus.date == '' ? '' : '-'}
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
              <Card className="card-box p-4 bg-night-sky text-white" style={{ minHeight: '275px' }}>
                <div className="text-center">
                  <div className="avatar-icon-wrapper rounded-circle m-0">
                    <Avatar>
                      {introduction.introducer ? introduction.introducer.first_name[0] : 'NA'}
                    </Avatar>
                  </div>
                  <h3 className="font-weight-bold mt-3">
                    {
                      introduction.introducer ? `${introduction.introducer.first_name} ${introduction.introducer.last_name}` : 'No Name'
                    }
                  </h3>
                  <div className={`badge badge-${introducerStatus.color} mt-1 mb-4 font-size-xs px-4 py-1 h-auto`}>
                    {introducerStatus.shortTitle}
                  </div>
                  <p className="mb-0 text-white-50">
                    You asked {`${introduction.introducer ? `${introduction.introducer.first_name} ${introduction.introducer.last_name} for` : 'for'}`} an introduction. We reached out to them and we will keep you updated with the status of the introduction!
                  </p>
                </div>
              </Card>
            </Grid>
            <Grid item lg={6}>
              <Card className="card-box bg-midnight-bloom text-white p-4" style={{ minHeight: '275px' }}>
                <div className="text-center">
                  <div className="avatar-icon-wrapper rounded-circle m-0">
                    <Avatar>
                      {introduction.introducee ? introduction.introducee.first_name[0] : 'NA'}
                    </Avatar>
                  </div>
                  <h3 className="font-weight-bold mt-3">
                    {
                      introduction.introducee ? `${introduction.introducee.first_name} ${introduction.introducee.last_name}` : 'No Name'
                    }
                  </h3>
                  <div className={`badge badge-${introduceeStatus.color} mt-1 mb-4 font-size-xs px-4 py-1 h-auto`}>
                    {introduceeStatus.shortTitle}
                  </div>
                  <p className="mb-0 text-white-50">
                    You asked
                    for an introduction to {
                      `${introduction.introducee ? `${introduction.introducee.first_name} ${introduction.introducee.last_name}` : ''}`
                    }. We are working to make that happen!
                  </p>
                </div>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
