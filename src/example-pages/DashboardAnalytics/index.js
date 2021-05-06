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

export default function DashboardAnalytics() {
  const userDetails = useAuthState();
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
    })
    .catch(error => {
      console.log('error', error.response)
    })
  }, [])


  return (
    <>
      <Grid container spacing={0}>
        <Grid item md={12} className="d-flex justify-content-center">
          <Card className="card-box bg-neutral-success p-3 p-xl-4 mb-10" style={{ marginBottom: '3rem' }}>
            <div className="bg-composed-wrapper--content d-block text-center text-xl-left d-xl-flex justify-content-between align-items-center">
              <p className="opacity-9 font=size-xl mr-0 mr-xl-3 mb-4 mb-xl-0">
                Looking to get introduced to someone new? Let us help!
              </p>
              <Link to='/new-introduction'>
                <Button className="btn-success text-nowrap px-4 text-uppercase font-size-sm font-weight-bold">
                  Get Introduced
                </Button>
              </Link>
            </div>
          </Card>
        </Grid>
      </Grid>
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
