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
  const [introductionProposal, setIntroductionProposal] = useState({});
  const [introduceeOneStatus, setIntroduceeOneStatus] = useState({
    title: '',
    date: '',
    description: '',
    color: 'default'
  })
  const [introduceeTwoStatus, setIntroduceeTwoStatus] = useState({
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
    axios.get(`/api/v1/introduction_proposals/${id}`, {
      headers: userDetails.credentials
    })
    .then(response => {
      console.log('response', response)
      setIntroductionProposal(response.data.introduction_proposal)
    })
    .catch(error => {
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }, [])

   useEffect(() => {
    if (introductionProposal.introducee_one_rejected) {
      setIntroduceeOneStatus({
        shortTitle: 'Denied',
        title: 'Introducee #1 Denied Request',
        description: `The introduction proposal was denied${introductionProposal.introducee_one && introductionProposal.introducee_one.first_name ? ` by ${introductionProposal.introducee_one.first_name}` : ''}.`,
        date: introductionProposal.introducee_one_rejected_at,
        color: 'danger'
      })
    } else if (introductionProposal.introducee_one_accepted) {
      setIntroduceeOneStatus({
        shortTitle: 'Accepted',
        title: 'Introducee #1 Request Accepted!',
        description: `${introductionProposal.introducee_one ? `${introductionProposal.introducee_one.first_name} has` : 'They have'} agreed to the introduction proposal!`,
        date: introductionProposal.introducee_one_accepted_at,
        color: 'success'
      })
    } else {
      setIntroduceeOneStatus({
        shortTitle: 'Pending',
        title: `Request Sent`,
        description: `We are waiting to hear from ${introductionProposal.introducee_one ? `${introductionProposal.introducee_one.first_name}` : 'introducee #1'} about your introduction proposal.`,
        date: introductionProposal.created_at,
        color: 'warning'
      })
    }
  }, [introductionProposal])

  useEffect(() => {
    if (introductionProposal.introducee_two_rejected) {
      setIntroduceeTwoStatus({
        shortTitle: 'Denied',
        title: 'Introducee #2 Denied',
        description: `The introduction proposal was denied${introductionProposal.introducee_two && introductionProposal.introducee_two.first_name ? ` by ${introductionProposal.introducee_two.first_name}` : ''}.`,
        date: introductionProposal.introducee_two_rejected_at,
        color: 'danger'
      })
    } else if (introductionProposal.introducee_two_accepted) {
      setIntroduceeTwoStatus({
        shortTitle: 'Accepted',
        title: 'Introducee #2 Accepted!',
        description: `${introductionProposal.introducee_two ? `${introductionProposal.introducee_two.first_name} has` : 'They have'} agreed to the introduction proposal!`,
        date: introductionProposal.introducee_two_accepted_at,
        color: 'success'
      })
    } else {
      setIntroduceeTwoStatus({
        shortTitle: 'Pending',
        title: `Request Sent`,
        description: `We are waiting to hear from ${introductionProposal.introducee_two ? `${introductionProposal.introducee_two.first_name}` : 'introducee #2'} about your introduction proposal.`,
        date: introductionProposal.created_at,
        color: 'warning'
      })
    }
  }, [introductionProposal])

  useEffect(() => {
    if (introductionProposal.introducee_one_rejected) {
      setStatus({
        title: 'Proposal Denied',
        color: 'danger',
        date: introductionProposal.introducee_one_rejected_at
      })
    } else if (introductionProposal.introducee_two_rejected) {
      setStatus({
        title: 'Proposal Denied',
        color: 'danger',
        date: introductionProposal.introducee_two_rejected_at
      })
    } else if (introductionProposal.completed) {
      setStatus({
        title: 'Complete',
        color: 'success',
        date: introductionProposal.completed_at
      })
    } else {
      setStatus({
        title: 'Pending',
        color: 'info',
        date: null
      })
    }
  }, [introductionProposal])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item lg={4}>
          <div className="timeline-list mb-5">
            <div className="timeline-item">
              <div className="timeline-item--content">
                <div className='timeline-item--icon bg-success' />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  Introduction Proposal Sent -<span>&nbsp;</span> <Moment format="MM/DD/YYYY">{introductionProposal.created_at}</Moment>
                </h4>
                <p>You proposed that {introductionProposal.introducee_two ? `${introductionProposal.introducee_two.first_name} ${introductionProposal.introducee_two.last_name}` : ''} and {introductionProposal.introducee_one ? `${introductionProposal.introducee_one.first_name} ${introductionProposal.introducee_one.last_name} should meet.` : ''}</p>
              </div>
            </div>
            {console.log('introduceeeOneStatus', introduceeOneStatus.date)}
            <div className="timeline-item">
              <div className="timeline-item--content">
                <div className={`timeline-item--icon bg-${introduceeOneStatus.color}`} />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  {introduceeOneStatus.title} - <span>&nbsp;</span>{
                    introduceeOneStatus.date && introduceeOneStatus.date.length > 0 ?
                    <Moment format="MM/DD/YYYY">{introduceeOneStatus.date}</Moment> : null
                  }
                </h4>
                <p>{introduceeOneStatus.description}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-item--content">
                <div className={`timeline-item--icon bg-${introduceeTwoStatus.color}`} />
                <h4 className="timeline-item--label mb-2 font-weight-bold">
                  {introduceeTwoStatus.title} -
                  {
                    introduceeTwoStatus.date && introduceeTwoStatus.date.length > 0 ?
                      <Moment format="MM/DD/YYYY">{introduceeTwoStatus.date}</Moment> : null
                  }
                </h4>
                <p>{introduceeTwoStatus.description}</p>
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
                      {introductionProposal.introducee_one ? introductionProposal.introducee_one.first_name[0] : 'NA'}
                    </Avatar>
                  </div>
                  <h3 className="font-weight-bold mt-3">
                    <small>Introducee #1:</small><br />
                    {
                      introductionProposal.introducee_one ? `${introductionProposal.introducee_one.first_name} ${introductionProposal.introducee_one.last_name}` : 'No Name'
                    }
                  </h3>
                  <div className={`badge badge-${introduceeOneStatus.color} mt-1 mb-4 font-size-xs px-4 py-1 h-auto`}>
                    Request Status: <br /> {introduceeOneStatus.shortTitle}
                  </div>
                </div>
              </Card>
            </Grid>
            <Grid item lg={6}>
              <Card className="card-box p-4 bg-night-sky text-white" style={{ minHeight: '245px' }}>
                <div className="text-center">
                  <div className="avatar-icon-wrapper rounded-circle m-0">
                    <Avatar>
                      {introductionProposal.introducee_two ? introductionProposal.introducee_two.first_name[0] : 'NA'}
                    </Avatar>
                  </div>
                  <h3 className="font-weight-bold mt-3">
                    <small>Introducee #2:</small><br />
                    {
                      introductionProposal.introducee_two ? `${introductionProposal.introducee_two.first_name} ${introductionProposal.introducee_two.last_name}` : 'No Name'
                    }
                  </h3>
                  <div className={`badge badge-${introduceeTwoStatus.color} mt-1 mb-4 font-size-xs px-4 py-1 h-auto`}>
                    Request Status: <br />{introduceeTwoStatus.shortTitle}
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
