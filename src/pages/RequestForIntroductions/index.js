import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'context';
import RequestForIntrosList from './RequestForIntrosList';
import { NotificationManager } from 'react-notifications';
import Loader from '../Loader';
import MarketingCta from '../MarketingCta';

export default function RequestForIntros(props) {
  const userDetails = useAuthState();
  const [loading, setLoading] = useState(true);
  const [requestForIntros, setRequestForIntros] = useState([]);
  const [pagination, setPagination] = useState({});
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    retrieveRequestsForIntroductions()
  }, [])

  const retrieveRequestsForIntroductions = () => {
    axios.get(`/api/v1/request_for_introductions?page=${pageNumber}`, {
      headers: userDetails.credentials
    })
    .then(response => {
      setPagination(response.data.pagination)
      setRequestForIntros(response.data.request_for_introductions)
      setLoading(false)
    }).catch(error => {
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }

  useEffect(() => {
    retrieveRequestsForIntroductions()
  }, [pageNumber])

  const handlePageChange = (e, pageNumber) => {
    setPageNumber(pageNumber)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <MarketingCta
        text="Want An Introduction, but you don't know the specific person? Get help from the crowd."
        type='success'
        button='Create A Request For Introduction'
        link='/new-request-for-introduction' />
      <RequestForIntrosList
        requestForIntros={requestForIntros}
        showPagination={true}
        pagination={pagination}
        handlePageChange={handlePageChange} />
    </>
  );
}
