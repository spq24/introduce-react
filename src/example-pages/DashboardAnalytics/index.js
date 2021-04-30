import React, { useEffect, useState } from 'react';
import { useAuthState } from 'context'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PageTitle } from 'layout-components';
import DashboardAnalytics1 from '../../example-components/DashboardAnalytics/DashboardAnalytics1';
import Table from '../../example-components/Tables/Tables8';
import { Card, Button, Grid } from '@material-ui/core';
export default function DashboardAnalytics() {
  const userDetails = useAuthState();


  useEffect(() => {
    axios.get('/api/v1/dashboard', {
      headers: userDetails.credentials
    })
    .then(response => {
      console.log('response', response)
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
      <DashboardAnalytics1 />
      <Table />
      <Table />
    </>
  );
}
