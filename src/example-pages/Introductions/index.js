import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'context';
import { Link } from 'react-router-dom';
import { PageTitle } from 'layout-components';
import DashboardAnalytics1 from '../../example-components/DashboardAnalytics/DashboardAnalytics1';
import { Table, Card, Button, Grid, CardContent, } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar/Avatar';
import List from './List';
import MarketingCta from '../MarketingCta';

export default function Introductions(props) {
  const userDetails = useAuthState();
  const [introductions, setIntroductions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    retrieveIntroductions()
  }, [])

  const retrieveIntroductions = () => {
    axios.get(`/api/v1/introductions?page=${pageNumber}`, {
      headers: userDetails.credentials
    })
    .then(response => {
      setPagination(response.data.pagination)
      setIntroductions(response.data.introductions)
    })
  }

  useEffect(() => {
    retrieveIntroductions()
  }, [pageNumber])

  const handlePageChange = (e, pageNumber) => {
    setPageNumber(pageNumber)
  }


  return (
    <>
      <MarketingCta
        text='Looking to get introduced to someone new? Let us help!'
        type='success'
        button='Get Introduced'
        link='/new-introduction' />
      <List
        introductions={introductions}
        showPagination={true}
        pagination={pagination}
        handlePageChange={handlePageChange} />
    </>
  );
}
