import React, { useEffect, useState } from 'react';
import { useAuthState } from 'context'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PageTitle } from 'layout-components';
import NumberBoxes from './NumberBoxes';
import Table from '../../example-components/Tables/Tables8';
import Introductions from '../../example-pages/Introductions/List';
import IntroductionRequests from '../../example-pages/IntroductionRequests/List';
import IntroductionProposals from '../../example-pages/IntroductionProposals/List';
import { Card, Button, Grid } from '@material-ui/core';
import MarketingCta from '../MarketingCta';
import Loader from '../../example-components/Loader';
import { NotificationManager } from 'react-notifications';
import {
  Fab,
  InputAdornment,
  TextField,
  FormControl,
  Container
} from '@material-ui/core';
import ProfileCard from '../../example-pages/Users/ProfileCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import illustration1 from 'assets/images/illustrations/pack2/video_call.svg';
import illustration2 from 'assets/images/illustrations/pack3/question.svg';
import requestForIntroIllustration from 'assets/images/illustrations/request-for-introduction.svg';
import introProposalIllustration from 'assets/images/illustrations/introduction-proposal.svg';
import introIllustration from 'assets/images/illustrations/introduction.svg';

export default function DashboardAnalytics() {
  const userDetails = useAuthState();
  const [loading, setLoading] = useState(true)
  const [acceptedIntroductions, setAcceptedIntroductions] = useState(0);
  const [completedIntroductions, setCompletedIntroductions] = useState(0);
  const [introductions, setIntroductions] = useState([]);
  const [introductionRequests, setIntroductionRequests] = useState([]);
  const [introductionProposals, setIntroductionProposals] = useState([]);
  const PROFILE_LINK = `https://canyouintro.me/r/${userDetails.user.unique_id}`

  useEffect(() => {

    axios.get('/api/v1/dashboard', {
      headers: userDetails.credentials
    })
      .then(response => {
        setAcceptedIntroductions(response.data.accepted_introductions)
        setCompletedIntroductions(response.data.completed_introductions)
        setIntroductionRequests(response.data.introduction_requests)
        setIntroductionProposals(response.data.introduction_proposals)
        setIntroductions(response.data.introductions)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        let message = error && error.response && error.response.data && error.response.data.message ?
          error.response.data.message : 'There was an error. Please try again!'
        NotificationManager.error(message)
      })
  }, [])

  if (loading) {
    return <Loader />
  }

  return(
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={6}>
        <ProfileCard
          title='Share your personal link'
          link={PROFILE_LINK}
          marginBottom='1%' />
        <Container>
          <h1 className="font-size-xxl font-weight-bold py-2 mb-0">
            Get Started With These Actions:
          </h1>
          <Card className="card-box p-0 mb-spacing-6-x2">
            <Grid container spacing={0}>
              <Grid item lg={7} className="d-flex align-items-center">
                <div className="p-2 text-center text-lg-left p-lg-5">
                  <h4 className="display-4 font-weight-bold mb-3">
                    <FontAwesomeIcon icon={['fas', 'search']} />&nbsp;&nbsp;
                    Create A Request For Introduction
                  </h4>
                  <p className="opacity-7 mb-4 font-size-md line-height-2">
                    Looking for introductions to multiple people? Share a request for introduction with the
                    internet and see who can make an introduction.<br /><br />
                    <b>example:</b> Looking for good freelance product designers. Can anyone make an introduction?
                  </p>
                  <Link to='/new-request-for-introduction'>
                    <Button className="btn-primary text-uppercase font-weight-bold btn-pill px-4 font-size-sm">
                      <span className="btn-wrapper--label">Create A Request For Introduction</span>
                      <span className="btn-wrapper--icon">
                        <FontAwesomeIcon icon={['fas', 'arrow-right']} />
                      </span>
                    </Button>
                  </Link>
                </div>
              </Grid>
              <Grid item lg={5} className="d-flex align-items-center">
                <img alt="..." className="w-100 p-4 p-lg-0" src={requestForIntroIllustration} />
              </Grid>
            </Grid>
          </Card>

          <Card className="card-box p-0 mb-spacing-6-x2">
            <Grid container spacing={0}>
              <Grid item lg={5} className="d-flex align-items-center">
                <img alt="..." className="w-100 p-4 p-lg-0" src={introProposalIllustration} />
              </Grid>
              <Grid item lg={7} className="d-flex align-items-center">
                <div className="p-4 text-center text-lg-left p-lg-5">
                  <h4 className="display-4 font-weight-bold mb-3">
                    <FontAwesomeIcon icon={['far', 'lightbulb']} /> Propose An Introduction
                  </h4>
                  <p className="opacity-7 mb-4 font-size-md line-height-2">
                    Know two people who should meet and they don't know it yet? Get started by introducing them using an introductin proposal.
                      We'll email both of them and see if they agree to the introduction.
                    </p>
                  <Link to="/new-introduction-proposal">
                    <Button className="btn-warning text-uppercase font-weight-bold px-4 font-size-sm">
                      <span className="btn-wrapper--label">Propose An Introduction</span>
                      <span className="btn-wrapper--icon">
                        <FontAwesomeIcon icon={['fas', 'arrow-right']} />
                      </span>
                    </Button>
                  </Link>
                </div>
              </Grid>
            </Grid>
          </Card>

          <Card className="card-box p-0 mb-spacing-6-x2">
            <Grid container spacing={0}>
              <Grid item lg={7} className="d-flex align-items-center">
                <div className="p-4 text-center text-lg-left p-lg-5">

                  <h4 className="display-4 font-weight-bold mb-3">
                    <FontAwesomeIcon icon={['fas', 'paper-plane']} />&nbsp;&nbsp;
                    Send Yourself A Test Intro Request
                  </h4>
                  <p className="opacity-7 mb-4 font-size-md line-height-2">
                    When you share your link with someone we make it really easy for them to request an introduction and
                    we make it easy for you and your contact to accept or deny that introduction request.<br /><br />
                    <b>Want to see what this looks like?</b> Go to your profile and send yourself a test introduction request
                  </p>
                  <a href={PROFILE_LINK} target="_blank">
                    <Button className="btn-primary text-uppercase font-weight-bold btn-pill px-4 font-size-sm">
                      <span className="btn-wrapper--label">Send A Test Introduction Request</span>
                      <span className="btn-wrapper--icon">
                        <FontAwesomeIcon icon={['fas', 'external-link-alt']} />
                      </span>
                    </Button>
                  </a>
                </div>
              </Grid>
              <Grid item lg={5} className="d-flex align-items-center">
                <img alt="..." className="w-100 p-4 p-lg-0" src={illustration1} />
              </Grid>
            </Grid>
          </Card>
        </Container>


      </Grid>
    </div>
  )
}
