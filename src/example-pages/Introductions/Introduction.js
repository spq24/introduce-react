import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'context';
import { useParams } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import Moment from 'react-moment';
import 'moment-timezone';

export default function Introductions(props) {
  const userDetails = useAuthState();
  const [introduction, setIntroduction] = useState([]);
  const [introducerStatus, setIntroducerStatus] = useState({
    title: '',
    date: '',
    description: ''
  })
  const [introduceeStatus, setIntroduceeStatus] = useState({
    title: '',
    date: '',
    description: ''
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
      console.log('error', error.response)
    })
  }, [])

  useEffect(() => {
    if(!introduction.introducer_sent_request) {
      setIntroduceeStatus({
        title: introduction.introducer ? `We are waiting on ${introduction.introducer.first_name} to send the request` : 'We are waiting on your introduction request to be sent.',
        description: `Your introduction request has not been sent ${introduction.introducee ? `to ${introduction.introducee.first_name}` : ''} yet`,
        date: '',
        color: 'arielle-smile'
      })
    } else if (introduction.introducee_rejected) {
      setIntroduceeStatus({
        title: introduction.introducee ? `${introduction.introducee.first_name} denied your introduction request` : 'Your introduction request was denied',
        description: `Unfortunately, your request was denied${introduction.introducee ? ` by ${introduction.introducee.first_name}.` : '.'}`,
        date: introduction.introducee_rejected_at,
        color: 'danger'
      })
    } else if (introduction.introducee_accepted) {
      setIntroduceeStatus({
        title: introduction.introducee ? `${introduction.introducee.first_name} agreed to be introduced to you!` : 'Your introduction request was accepted!',
        description: `${introduction.introducee ? `${introduction.introducee.first_name} has` : 'They have'} agreed ${introduction.introducer ? `to have${introduction.introducer.first_name}!` : 'to be introduced to you!'}`,
        date: introduction.introducer_rejected_at,
        color: 'success'
      })
    } else {
      setIntroduceeStatus({
        title: `A request was sent and we are waiting ot hear back`,
        description: `${introduction.introducer ? `${introduction.introducer.first_name} has` : 'They have'} sent an introduction request to ${introduction.introducee ? introduction.introducee.first_name : 'to the person you asked to be introduced to!'}`,
        date: introduction.introducer_sent_request_at,
        color: 'arielle-smile'
      })
    }
  }, [introduction])

  useEffect(() => {
    if (introduction.introducer_rejected) {
      setIntroducerStatus({
        title: introduction.introducer ? `${introduction.introducer.first_name} denied your introduction request` : 'Your introduction request was denied',
        description: `Unfortunately, your request was denied. This is what they said in their reason: ${introduction.rejection_reason}`,
        date: introduction.introducer_rejected_at,
        color: 'danger'
      })
    } else if (introduction.introducer_accepted) {
      setIntroducerStatus({
        title: introduction.introducer ? `${introduction.introducer.first_name} agreed to introduce you ${introduction.introducee ? `to ${introduction.introducee.first_name}` : ''}` : 'Your introduction request was accepted!',
        description: `We will keep you updated as the status changes!`,
        date: introduction.introducer_accepted_at,
        color: 'success'
      })
    } else {
      setIntroducerStatus({
        title: `We sent your request and we are waiting to hear back`,
        description: introduction.introducer ? `We are waiting to hear back from ${introduction.introducer.first_name} on your introduction request ${introduction.introducee ? `to ${introduction.introducee.first_name}` : ''}. We will let you know when we hear anything!` : 'We are waiting to hear back on your introduction request. We will let you know when we hear something!',
        date: introduction.created_at,
        color: 'arielle-smile'
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
                Status
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

      </Grid>
    </Grid>
  );
}
