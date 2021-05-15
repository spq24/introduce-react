import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'context';
import { useParams } from 'react-router-dom';
import { Avatar, Card, Grid, Button, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'react-moment';
import 'moment-timezone';

import avatar2 from 'assets/images/avatars/avatar2.jpg';
import avatar3 from 'assets/images/avatars/avatar3.jpg';

export default function IntroductionRequest(props) {
  const userDetails = useAuthState();
  const [introductionRequest, setIntroductionRequest] = useState([]);
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
      setIntroductionRequest(response.data.introduction)
    })
    .catch(error => {
      console.log('error', error.response)
    })
  }, [])

  useEffect(() => {
    if (!introductionRequest.introducer_sent_request) {
      setIntroduceeStatus({
        shortTitle: 'Waiting On Intro Request',
        title: introductionRequest.introducer ? `We are waiting on ${introductionRequest.introducer.first_name} to send the request` : 'We are waiting on your introduction request to be sent.',
        description: `Your introduction request has not been sent ${introductionRequest.introducee ? `to ${introductionRequest.introducee.first_name}` : ''} yet`,
        date: '',
        color: 'info'
      })
    } else if (introductionRequest.introducee_rejected) {
      setIntroduceeStatus({
        shortTitle: 'Denied',
        title: introductionRequest.introducee ? `${introductionRequest.introducee.first_name} denied your introduction request` : 'Your introduction request was denied',
        description: `Unfortunately, your request was denied${introductionRequest.introducee ? ` by ${introductionRequest.introducee.first_name}.` : '.'}`,
        date: introductionRequest.introducee_rejected_at,
        color: 'danger'
      })
    } else if (introductionRequest.introducee_accepted) {
      setIntroduceeStatus({
        shortTitle: 'Accepted',
        title: introductionRequest.introducee ? `${introductionRequest.introducee.first_name} agreed to be introduced to you!` : 'Your introduction request was accepted!',
        description: `${introductionRequest.introducee ? `${introductionRequest.introducee.first_name} has` : 'They have'} agreed ${introductionRequest.introducer ? `to have${introductionRequest.introducer.first_name}!` : 'to be introduced to you!'}`,
        date: introductionRequest.introducer_rejected_at,
        color: 'success'
      })
    } else {
      setIntroduceeStatus({
        shortTitle: 'Pending',
        title: `A request was sent and we are waiting to hear back`,
        description: `${introductionRequest.introducer ? `${introductionRequest.introducer.first_name} has` : 'They have'} sent an introduction request to ${introductionRequest.introducee ? introductionRequest.introducee.first_name : 'to the person you asked to be introduced to!'}`,
        date: introductionRequest.introducer_sent_request_at,
        color: 'warning'
      })
    }
  }, [introductionRequest])

  useEffect(() => {
    if (introductionRequest.introducer_rejected) {
      setIntroducerStatus({
        shortTitle: 'Rejected',
        title: introductionRequest.introducer ? `${introductionRequest.introducer.first_name} denied your introduction request` : 'Your introduction request was denied',
        description: `You denied this request. Here was your reason: ${introductionRequest.rejection_reason}`,
        date: introductionRequest.introducer_rejected_at,
        color: 'danger'
      })
    } else if (introductionRequest.introducer_accepted) {
      setIntroducerStatus({
        shortTitle: 'Accepted',
        title: `You agreed to introduce ${introductionRequest.introduction_requester ? introductionRequest.introduction_requester.first_name : ''} ${introductionRequest.introducee ? `to ${introductionRequest.introducee.first_name}` : ''}`,
        description: `We will keep you updated as the status changes!`,
        date: introductionRequest.introducer_accepted_at,
        color: 'success'
      })
    } else {
      setIntroducerStatus({
        shortTitle: 'Sent',
        title: `Waiting On You`,
        description: introductionRequest.introducer ? `We are waiting on you to decide whether you want to make this introduction to ${introductionRequest.introducee ? `to ${introductionRequest.introducee.first_name}` : ''}.` : 'We are waiting on you to decide whether you want to make this introduction',
        date: introductionRequest.created_at,
        color: 'warning'
      })
    }
  }, [introductionRequest])

  useEffect(() => {
    if (introductionRequest.introducer_rejected) {
      setStatus({
        title: 'Introducer Denied',
        color: 'warning',
        date: introductionRequest.introducer_rejected_at
      })
    } else if (introductionRequest.introducee_rejected) {
      setStatus({
        title: 'Introducee Denied',
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
        title: 'Pending',
        color: 'info',
        date: null
      })
    }
  }, [introductionRequest])

  return (
    <Grid container spacing={6}>
      <Grid item lg={4}>
        <div className="timeline-list mb-5">
          <div className="timeline-item">
            <div className="timeline-item--content">
              <div className={`timeline-item--icon bg-${introducerStatus.color}`} />
              <h4 className="timeline-item--label mb-2 font-weight-bold">
                Introduction Asked For -<span>&nbsp;</span> <Moment format="MM/DD/YYYY">{introductionRequest.created_at}</Moment>
              </h4>
              <p>{introductionRequest.introduction_requester ? `${introductionRequest.introduction_requester.first_name} ${introductionRequest.introduction_requester.last_name}` : 'Someone'} asked you to introduce them to {introductionRequest.introducee ? `${introductionRequest.introducee.first_name} ${introductionRequest.introducee.last_name}` : 'Someone'}</p>
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
                    {introductionRequest.introduction_requester ? introductionRequest.introduction_requester.first_name[0] : 'NA'}
                  </Avatar>
                </div>
                <h3 className="font-weight-bold mt-3">
                  {
                    introductionRequest.introduction_requester ? `${introductionRequest.introduction_requester.first_name} ${introductionRequest.introduction_requester.last_name}` : 'No Name'
                  }
                </h3>
                <div className={`badge badge-info mt-1 mb-4 font-size-xs px-4 py-1 h-auto`}>
                  Requester
                </div>
                <p className="mb-0 text-white-50">
                  {`${introductionRequest.introduction_requester ? `${introductionRequest.introduction_requester.first_name} ${introductionRequest.introduction_requester.last_name}` : ''}`} asked you for an introduction to {introductionRequest.introducee ? `${introductionRequest.introducee.first_name} ${introductionRequest.introducee.last_name}` : ''}.
                </p>
              </div>
            </Card>
          </Grid>
          <Grid item lg={6}>
            <Card className="card-box bg-midnight-bloom text-white p-4" style={{ minHeight: '275px' }}>
              <div className="text-center">
                <div className="avatar-icon-wrapper rounded-circle m-0">
                  <Avatar>
                    {introductionRequest.introducee ? introductionRequest.introducee.first_name[0] : 'NA'}
                  </Avatar>
                </div>
                <h3 className="font-weight-bold mt-3">
                  Introducee
                </h3>
                <div className={`badge badge-warning mt-1 mb-4 font-size-xs px-4 py-1 h-auto`}>
                  Introducee
                </div>
                <p className="mb-0 text-white-50">
                  You were asked to make an introduction to {
                    `${introductionRequest.introducee ? `${introductionRequest.introducee.first_name} ${introductionRequest.introducee.last_name}` : ''}`
                  }. Can you make that happen?
                </p>
              </div>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
