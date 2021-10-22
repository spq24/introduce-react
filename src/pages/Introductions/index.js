import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'context';
import List from './List';
import MarketingCta from '../MarketingCta';

export default function Introductions(props) {
  const userDetails = useAuthState();
  const [introductions, setIntroductions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    retrieveIntroductions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
