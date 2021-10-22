import React, { useEffect, useState } from 'react';
import { useAuthState } from 'context'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Grid } from '@material-ui/core';
import Loader from '../Loader';
import { NotificationManager } from 'react-notifications';
import requestForIntroIllustration from 'assets/images/illustrations/request-for-introduction.svg';
import introProposalIllustration from 'assets/images/illustrations/introduction-proposal.svg';
import introIllustration from 'assets/images/illustrations/introduction.svg';
import illustration3 from 'assets/images/illustrations/pack1/handshake.svg';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import NewUser from './NewUser';
import ProfileCard from '../../pages/Users/ProfileCard';

export default function Dashboard() {
  const userDetails = useAuthState();
  const [loading, setLoading] = useState(true)
  const [introductions, setIntroductions] = useState(0);
  const [introductionRequests, setIntroductionRequests] = useState(0);
  const [introductionProposals, setIntroductionProposals] = useState(0);
  const [requestForIntro, setRequestForIntro] = useState(0);
  const [profileLink, setProfileLink] = useState('#')
  const PROFILE_LINK = `https://canyouintro.me/r/${userDetails.user.unique_id}`

  useEffect(() => {
    axios.get('/api/v1/dashboard', {
      headers: userDetails.credentials
    })
    .then(response => {
      setRequestForIntro(response.data.request_for_introductions)
      setIntroductionProposals(response.data.introduction_proposals)
      setIntroductionRequests(response.data.introduction_requests)
      setIntroductions(response.data.introductions)
      setProfileLink(response.data.profile_link)
      setLoading(false)
    })
    .catch(error => {
      setLoading(false)
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }, [])

  if(loading) {
    return <Loader />
  }

  if (introductions === 0 && introductionRequests === 0 && introductionProposals === 0 && requestForIntro === 0) {
    return <NewUser />
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item md={12} lg={12} xl={12}>
          <ProfileCard
            marginBottom='0px'
            title='Share your intro request link'
            link={PROFILE_LINK} />
        </Grid>
        <Grid item md={6} lg={12} xl={6}>
          <Card>
            <div className="p-4">
              <Grid container spacing={0}>
                <Grid item md={3}>
                  <img
                    alt="..."
                    className="img-fluid"
                    style={{ minHeight: '100px', maxHeight: '150px' }}
                    src={requestForIntroIllustration}
                  />
                </Grid>
                <Grid item md={9} className="d-flex align-items-center">
                  <div>
                    <div className="font-size-lg font-weight-bold mb-1">
                      Requests For Introductions Made <br />
                    <small>{requestForIntro} Request For Intros Made So Far</small>
                    </div>
                    <p className="opacity-7 font-size-md mb-0">
                      Sent out to your broader network helping you get introduced to a group of people.
                      ex. Looking for intros to founders at the cross section of fintech and climate change. Know anyone?
                    </p>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="divider" />
            <div className="d-flex justify-content-evenly px-4 py-3">
              <Link to='/request-for-introductions'>
                <Button size="small" color="primary" variant="outlined">
                  See Who Responded
                </Button>
              </Link>
              <Link to='new-request-for-introduction'>
                <Button size="small" color="primary" variant="contained">
                  Request More Intros
                </Button>
              </Link>
            </div>
          </Card>
        </Grid>
        <Grid item md={6} lg={12} xl={6}>
          <Card>
            <div className="p-4">
              <Grid container spacing={0}>
                <Grid item md={3}>
                  <img
                    alt="..."
                    className="img-fluid"
                    style={{ minHeight: '100px', maxHeight: '150px' }}
                    src={introProposalIllustration}
                  />
                </Grid>
                <Grid item md={9} className="d-flex align-items-center">
                  <div>
                    <div className="font-size-lg font-weight-bold mb-1">
                      Introduction Proposals<br />
                      <small>{introductionProposals} Intros Proposed So Far</small>
                    </div>
                    <p className="opacity-7 font-size-md" style={{ marginBottom: '1.5rem'}} >
                      Know two people who should meet, but they don't know it yet?
                      Propose an introduction between two people!
                    </p>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="divider" />
            <div className="d-flex justify-content-evenly px-4 py-3">
              <Link to='/introduction-proposals'>
                <Button size="small" color="primary" variant="outlined">
                  See Proposals You've Made
                </Button>
              </Link>
              <Link to='/new-introduction-proposal'>
                <Button size="small" color="primary" variant="contained">
                  Propose A New Intro
                </Button>
              </Link>
            </div>
          </Card>
        </Grid>

        <Grid item md={6} lg={12} xl={6}>
          <Card>
            <div className="p-4">
              <Grid container spacing={0}>
                <Grid item md={3}>
                  <img
                    alt="..."
                    className="img-fluid"
                    style={{ minHeight: '100px', maxHeight: '150px' }}
                    src={illustration3}
                  />
                </Grid>
                <Grid item md={9} className="d-flex align-items-center">
                  <div>
                    <div className="font-size-lg font-weight-bold mb-1">
                      Intros You Asked For <br />
                      <small>{introductions} Intros Asked For So Far</small>
                    </div>
                    <p className="opacity-7 font-size-md mb-0">
                      Looking for an introduction? A warm introduction is the absolute best way to make it happen.
                      Use this tool to make it easy for your contact to make the introduction!
                    </p>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="divider" />
            <div className="d-flex justify-content-evenly px-4 py-3">
              <Link to='/introductions'>
                <Button size="small" color="primary" variant="outlined">
                  Introductions You've Asked For
                </Button>
              </Link>
              <Link to='/new-introduction'>
                <Button size="small" color="primary" variant="contained">
                  Ask For New Intro
                </Button>
              </Link>
            </div>
          </Card>
        </Grid>

        <Grid item md={6} lg={12} xl={6}>
          <Card>
            <div className="p-4">
              <Grid container spacing={0}>
                <Grid item md={3}>
                  <img
                    alt="..."
                    className="img-fluid"
                    style={{ minHeight: '100px', maxHeight: '150px' }}
                    src={introIllustration}
                  />
                </Grid>
                <Grid item md={9} className="d-flex align-items-center">
                  <div>
                    <div className="font-size-lg font-weight-bold mb-1">
                      Intros You Were Asked To Make <br />
                      <small>{introductionRequests} Intros Requested So Far</small>
                    </div>
                    <p className="opacity-7 font-size-md" style={{ marginBottom: '1.5rem' }}>
                      Share your link and make it easy for people to ask you for introductions without all the emailing back and forth.
                    </p>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="divider" />
            <div className="d-flex justify-content-evenly px-4 py-3">
              <Link to='/introduction-requests'>
                <Button size="small" color="primary" variant="outlined">
                  See Intros You Were Asked For
                </Button>
              </Link>
              <CopyToClipboard
                text={`https://canyouintro.me/r/${profileLink}`}
                onCopy={() => NotificationManager.success('Link copied!')}>
                  <Button size="small" color="primary" variant="contained">
                    Copy Your Profile Link
                  </Button>
              </CopyToClipboard>
            </div>
          </Card>
        </Grid>


      </Grid>
    </>
  );
}
