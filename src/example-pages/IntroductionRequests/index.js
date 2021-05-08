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

export default function IntroductionRequests(props) {
  const userDetails = useAuthState();
  const [introductionRequests, setIntroductionRequests] = useState([]);
  const [pagination, setPagination] = useState({});
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    retrieveIntroductionRequests()
  }, [])

  const retrieveIntroductionRequests = () => {
    axios.get(`/api/v1/introduction_requests?page=${pageNumber}`, {
      headers: userDetails.credentials
    })
    .then(response => {
      console.log('response', response)
      setPagination(response.data.pagination)
      setIntroductionRequests(response.data.introduction_requests)
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
      <List
        introductionRequests={introductionRequests}
        showPagination={true}
        pagination={pagination}
        handlePageChange={handlePageChange} />
    </>
  );
}
