import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'context'
import { Link } from 'react-router-dom';
import { PageTitle } from 'layout-components';
import DashboardAnalytics1 from '../../example-components/DashboardAnalytics/DashboardAnalytics1';
import { Table, Card, Button, Grid, CardContent, } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar/Avatar';
import List from './List';
import { NotificationManager } from 'react-notifications';
import ProfileCard from '../../example-pages/Users/ProfileCard';

export default function IntroductionRequests(props) {
  const userDetails = useAuthState();
  const [introductionRequests, setIntroductionRequests] = useState([]);
  const [pagination, setPagination] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const PROFILE_LINK = `https://canyouintro.me/r/${userDetails.user.unique_id}`

  useEffect(() => {
    retrieveIntroductionRequests()
  }, [])

  const retrieveIntroductionRequests = () => {
    axios.get(`/api/v1/introduction_requests?page=${pageNumber}`, {
      headers: userDetails.credentials
    })
    .then(response => {
      setPagination(response.data.pagination)
      setIntroductionRequests(response.data.introduction_requests)
    }).catch(error => {
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }

  useEffect(() => {
    retrieveIntroductionRequests()
  }, [pageNumber])

  const handlePageChange = (e, pageNumber) => {
    setPageNumber(pageNumber)
  }


  return (
    <>
       <Grid container spacing={6}>
          <ProfileCard
            title='Share your intro request link'
            link={PROFILE_LINK} />
        </Grid>
      <List
        introductionRequests={introductionRequests}
        showPagination={true}
        pagination={pagination}
        handlePageChange={handlePageChange} />
    </>
  );
}
