import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'context';
import { useParams } from 'react-router-dom';
import { Avatar, Card, Grid, Button } from '@material-ui/core';
import Moment from 'react-moment';
import 'moment-timezone';
import { NotificationManager } from 'react-notifications';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (introduction.introducer_rejected) {
      setIntroduceeStatus({
        shortTitle: 'Introducer Denied',
        title: 'Introducer Denied Request',
        description: `The introduction request was denied${introduction.introducer && introduction.introducer.first_name ? ` by ${introduction.introducer.first_name}` : ''}.`,
        date: '',
        color: 'default'
      })
    } else if(!introduction.introducer_sent_request) {
      setIntroduceeStatus({
        shortTitle: 'Waiting On Introducer',
        title: 'Waiting On Introducer',
        description: `Your introduction request has not been sent ${introduction.introducee ? `to ${introduction.introducee.first_name}` : ''} yet`,
        date: '',
        color: 'info'
      })
    } else if (introduction.introducee_accepted) {
      setIntroduceeStatus({
        shortTitle: 'Accepted',
        title: 'Introducee Request Accepted!',
        description: `${introduction.introducee ? `${introduction.introducee.first_name} has` : 'They have'} agreed ${introduction.introducer ? `to the introduction request!` : 'to be introduced to you!'}`,
        date: introduction.introducee_accepted_at,
        color: 'success'
      })
    } else if (introduction.introducee_rejected) {
      setIntroduceeStatus({
        shortTitle: 'Denied',
        title: 'Introducee Request Denied',
        description: `${introduction.introducee ? `${introduction.introducee.first_name} has` : 'They have'} denied the introduction request`,
        date: introduction.introducee_rejected_at,
        color: 'danger'
      })
    } else {
      setIntroduceeStatus({
        shortTitle: 'Pending',
        title: `Request Sent`,
        description: `${introduction.introducer ? `${introduction.introducer.first_name} has` : 'They have'} sent an introduction request to ${introduction.introducee ? introduction.introducee.first_name : 'to the person you asked to be introduced to!'}`,
        date: introduction.introducer_sent_request_at,
        color: 'warning'
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introduction])

  useEffect(() => {
    if (introduction.introducer_rejected) {
      setIntroducerStatus({
        shortTitle: 'Denied',
        title: 'Request Denied',
        description: `Unfortunately, your request was denied. This is what they said in their reason: ${introduction.rejection_reason}`,
        date: introduction.introducer_rejected_at,
        color: 'danger'
      })
    } else if (introduction.introducer_accepted) {
      setIntroducerStatus({
        shortTitle: 'Accepted',
        title: 'Request Accepted!',
        description: `Your introducer ${introduction.introducer ? introduction.introducer.first_name : ''} has agreed to try to make the introduction. A request was sent to ${introduction.introducee ? introduction.introducee.first_name : ''}. We will keep you updated!`,
        date: introduction.introducer_accepted_at,
        color: 'success'
      })
    } else {
      setIntroducerStatus({
        shortTitle: 'Sent',
        title: `Request Sent - Waiting`,
        description: introduction.introducer ? `We are waiting to hear back from ${introduction.introducer.first_name} on your introduction request ${introduction.introducee ? `to ${introduction.introducee.first_name}` : ''}. We will let you know when we hear anything!` : 'We are waiting to hear back on your introduction request. We will let you know when we hear something!',
        date: introduction.created_at,
        color: 'warning'
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introduction])

  useEffect(() => {
    if(introduction.introducer_rejected) {
      setStatus({
        title: 'Introducer Denied',
        color: 'danger',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  {introduceeStatus.title} {introduceeStatus.date === '' ? '' : '-'}
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
                      {introduction.introducer ? introduction.introducer.first_name[0] : 'NA'}
                    </Avatar>
                  </div>
                  <h3 className="font-weight-bold mt-3">
                    <small>Introducer:</small><br />
                    {
                      introduction.introducer ? `${introduction.introducer.first_name} ${introduction.introducer.last_name}` : 'No Name'
                    }
                  </h3>
                  <div className={`badge badge-${introducerStatus.color} mt-1 mb-4 font-size-xs px-4 py-1 h-auto`}>
                    Request Status: <br />{introducerStatus.shortTitle}
                  </div>

                </div>
              </Card>
            </Grid>
            <Grid item lg={6}>
              <Card className="card-box bg-midnight-bloom text-white p-4" style={{ minHeight: '245px' }}>
                <div className="text-center">
                  <div className="avatar-icon-wrapper rounded-circle m-0">
                    <Avatar>
                      {introduction.introducee ? introduction.introducee.first_name[0] : 'NA'}
                    </Avatar>
                  </div>
                  <h3 className="font-weight-bold mt-3">
                    <small>Introducee:</small><br />
                    {
                      introduction.introducee ? `${introduction.introducee.first_name} ${introduction.introducee.last_name}` : 'No Name'
                    }
                  </h3>
                  <div className={`badge badge-${introduceeStatus.color} mt-1 mb-4 font-size-xs px-4 py-1 h-auto`}>
                    Request Status: <br /> {introduceeStatus.shortTitle}
                  </div>
                </div>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
