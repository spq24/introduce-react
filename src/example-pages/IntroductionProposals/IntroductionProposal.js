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

export default function IntroductionProposal(props) {
  const userDetails = useAuthState();
  const [introduction, setIntroduction] = useState([]);
  const [requesterStatus, setRequesterStatus] = useState({
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
    if (introduction.introduction_requester_rejected) {
      setRequesterStatus({
        shortTitle: 'Denied',
        title: 'Introducee #2 Denied Request',
        description: `The introduction proposal was denied${introduction.introduction_requester && introduction.introduction_requester.first_name ? ` by ${introduction.introduction_requester.first_name}` : ''}.`,
        date: introduction.introduction_requester_rejected_at,
        color: 'danger'
      })
    } else if (introduction.introduction_requester_accepted) {
      setRequesterStatus({
        shortTitle: 'Accepted',
        title: 'Introducee #2 Request Accepted!',
        description: `${introduction.introduction_requester ? `${introduction.introduction_requester.first_name} has` : 'They have'} agreed to the introduction proposal!`,
        date: introduction.introduction_requester_accepted_at,
        color: 'success'
      })
    } else {
      setRequesterStatus({
        shortTitle: 'Pending',
        title: `Request Sent`,
        description: `We are waiting to hear from ${introduction.introduction_requester ? `${introduction.introduction_requester.first_name}` : 'introducee #2'} about your introduction proposal.`,
        date: introduction.introducer_sent_request_at,
        color: 'warning'
      })
    }
  }, [introduction])

  useEffect(() => {
    if (introduction.introducee_rejected) {
      setIntroduceeStatus({
        shortTitle: 'Denied',
        title: 'Introducee #1 Denied Request',
        description: `The introduction proposal was denied${introduction.introducee && introduction.introducee.first_name ? ` by ${introduction.introducee.first_name}` : ''}.`,
        date: introduction.introducee_rejected_at,
        color: 'danger'
      })
    } else if (introduction.introducee_accepted) {
      setIntroduceeStatus({
        shortTitle: 'Accepted',
        title: 'Introducee #1 Request Accepted!',
        description: `${introduction.introducee ? `${introduction.introducee.first_name} has` : 'They have'} agreed to the introduction proposal!`,
        date: introduction.introducee_accepted_at,
        color: 'success'
      })
    } else {
      setIntroduceeStatus({
        shortTitle: 'Pending',
        title: `Request Sent`,
        description: `We are waiting to hear from ${introduction.introducee ? `${introduction.introducee.first_name}` : 'introducee #2'} about your introduction proposal.`,
        date: introduction.introducer_sent_request_at,
        color: 'warning'
      })
    }
  }, [introduction])

  useEffect(() => {
    if(introduction.introduction_requester_rejected) {
      setStatus({
        title: 'Introducee #2 Denied',
        color: 'danger',
        date: introduction.introduction_requester_rejected_at
      })
    } else if(introduction.introducee_rejected) {
      setStatus({
        title: 'Introducee # 1 Denied',
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
                <div className={`timeline-item--icon bg-${requesterStatus.color}`} />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  Introduction Proposal Sent -<span>&nbsp;</span> <Moment format="MM/DD/YYYY">{introduction.created_at}</Moment>
                </h4>
                <p>You proposed that {introduction.introduction_requester ? `${introduction.introduction_requester.first_name} ${introduction.introduction_requester.last_name}` : ''} and {introduction.introducee ? `${introduction.introducee.first_name} ${introduction.introducee.last_name} should meet.` : ''}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-item--content">
                <div className={`timeline-item--icon bg-${requesterStatus.color}`} />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  {requesterStatus.title}<span>&nbsp;</span>{
                    requesterStatus.date && requesterStatus.date.length > 0 ?
                    ` - ${<Moment format="MM/DD/YYYY">{requesterStatus.date}</Moment>}` : null
                  }
                </h4>
                <p>{requesterStatus.description}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-item--content">
                <div className={`timeline-item--icon bg-${introduceeStatus.color}`} />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  {introduceeStatus.title}
                  {
                    introduceeStatus.date && introduceeStatus.date.length > 0 ?
                    ` - ${<Moment format="MM/DD/YYYY">{introduceeStatus.date}</Moment>}` : null
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
              <Card className="card-box bg-midnight-bloom text-white p-4" style={{ minHeight: '245px' }}>
                <div className="text-center">
                  <div className="avatar-icon-wrapper rounded-circle m-0">
                    <Avatar>
                      {introduction.introducee ? introduction.introducee.first_name[0] : 'NA'}
                    </Avatar>
                  </div>
                  <h3 className="font-weight-bold mt-3">
                    <small>Introducee #1:</small><br />
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
            <Grid item lg={6}>
              <Card className="card-box p-4 bg-night-sky text-white" style={{ minHeight: '245px' }}>
                <div className="text-center">
                  <div className="avatar-icon-wrapper rounded-circle m-0">
                    <Avatar>
                      {introduction.introduction_requester ? introduction.introduction_requester.first_name[0] : 'NA'}
                    </Avatar>
                  </div>
                  <h3 className="font-weight-bold mt-3">
                    <small>Introducee #2:</small><br />
                    {
                      introduction.introduction_requester ? `${introduction.introduction_requester.first_name} ${introduction.introduction_requester.last_name}` : 'No Name'
                    }
                  </h3>
                  <div className={`badge badge-${requesterStatus.color} mt-1 mb-4 font-size-xs px-4 py-1 h-auto`}>
                    Request Status: <br />{requesterStatus.shortTitle}
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
