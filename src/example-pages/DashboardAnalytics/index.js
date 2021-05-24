import React, { useEffect, useState } from 'react';
import { useAuthState } from 'context'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PageTitle } from 'layout-components';
import NumberBoxes from './NumberBoxes';
import Table from '../../example-components/Tables/Tables8';
import Introductions from '../../example-pages/Introductions/List';
import IntroductionRequests from '../../example-pages/IntroductionRequests/List';
import { Card, Button, Grid } from '@material-ui/core';
import MarketingCta from '../MarketingCta';
import EmptyDashboard from './EmptyDashboard';
import Loader from '../../example-components/Loader';

export default function DashboardAnalytics() {
  const userDetails = useAuthState();
  const [loading, setLoading] = useState(true)
  const [acceptedIntroductions, setAcceptedIntroductions] = useState(0);
  const [completedIntroductions, setCompletedIntroductions] = useState(0);
  const [introductions, setIntroductions] = useState([]);
  const [introductionRequests, setIntroductionRequests] = useState([]);

  useEffect(() => {
    axios.get('/api/v1/dashboard', {
      headers: userDetails.credentials
    })
    .then(response => {
      setAcceptedIntroductions(response.data.accepted_introductions)
      setCompletedIntroductions(response.data.completed_introductions)
      setIntroductionRequests(response.data.introduction_requests)
      setIntroductions(response.data.introductions)
      setLoading(false)
    })
    .catch(error => {
      setLoading(false)
      console.log('error', error.response)
    })
  }, [])

  if(loading) {
    return <Loader />
  }

  if(introductions && introductionRequests && introductions.length == 0 && introductionRequests.length == 0) {
    return <EmptyDashboard user={userDetails.user} />
  }


  return (
    <>
      <MarketingCta
        text='Looking to get introduced to someone new? Let us help!'
        type='success'
        button='Get Introduced'
        link='/new-introduction' />

      <NumberBoxes
        introductions={introductions}
        introductionRequests={introductionRequests}
        acceptedIntroductions={acceptedIntroductions}
        completedIntroductions={completedIntroductions} />
      <Introductions introductions={introductions} />
      <IntroductionRequests introductionRequests={introductionRequests} />
    </>
  );
}
