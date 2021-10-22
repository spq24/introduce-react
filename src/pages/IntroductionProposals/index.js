import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'context';
import List from './List';
import { NotificationManager } from 'react-notifications';
import MarketingCta from '../MarketingCta';

export default function IntroductionProposals(props) {
  const userDetails = useAuthState();
  const [introductionProposals, setIntroductionProposals] = useState([]);
  const [pagination, setPagination] = useState({});
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    retrieveIntroductionProposals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const retrieveIntroductionProposals = () => {
    axios.get(`/api/v1/introduction_proposals?page=${pageNumber}`, {
      headers: userDetails.credentials
    })
    .then(response => {
      setPagination(response.data.pagination)
      setIntroductionProposals(response.data.introduction_proposals)
    }).catch(error => {
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }

  useEffect(() => {
    retrieveIntroductionProposals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber])

  const handlePageChange = (e, pageNumber) => {
    setPageNumber(pageNumber)
  }


  return (
    <>
      <MarketingCta
        text='Do you think two people you know should meet? Introduce Them!'
        type='info'
        button='Propose Introduction'
        link='/new-introduction-proposal' />

      <List
        introductionProposals={introductionProposals}
        showPagination={true}
        pagination={pagination}
        handlePageChange={handlePageChange} />
    </>
  );
}
