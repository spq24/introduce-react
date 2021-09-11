import React from 'react';
import {
  Card,
  Grid,
  Button,
  Fab,
  InputAdornment,
  TextField,
  FormControl,
  Container
} from '@material-ui/core';
import ProfileCard from '../../example-pages/Users/ProfileCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationManager } from 'react-notifications';
import illustration1 from 'assets/images/illustrations/pack2/video_call.svg';
import illustration2 from 'assets/images/illustrations/pack3/question.svg';

export default function EmptyDashboard(props) {
  const PROFILE_LINK = `https://canyouintro.me/r/${props.user.unique_id}`

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>

        <Grid container spacing={6}>
          <ProfileCard
            title='Share your personal link'
            link={PROFILE_LINK}
            marginBottom='1%' />
          <Container>
            <Card className="card-box p-0 mb-spacing-6-x2">
              <Grid container spacing={0}>
                <Grid item lg={7} className="d-flex align-items-center">
                  <div className="p-4 text-center text-lg-left p-lg-5">
                    <div className="bg-primary btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 rounded-circle mb-4">
                      <FontAwesomeIcon icon={['far', 'bell']} />
                    </div>
                    <h4 className="display-4 font-weight-bold mb-3">
                      Start Out With A Test Introduction
                    </h4>
                    <p className="opacity-7 mb-4 font-size-md line-height-2">
                      Send yourself a test introduction so you can see the magic 1st hand.
                    </p>
                    <a href={PROFILE_LINK} target="_blank">
                      <Button className="btn-primary text-uppercase font-weight-bold btn-pill px-4 font-size-sm">
                        <span className="btn-wrapper--label">Send A Test</span>
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

            <Card className="card-box p-0 mb-spacing-6-x2">
              <Grid container spacing={0}>
                <Grid item lg={5} className="d-flex align-items-center">
                  <img alt="..." className="w-100 p-4 p-lg-0" src={illustration2} />
                </Grid>
                <Grid item lg={7} className="d-flex align-items-center">
                  <div className="p-4 text-center text-lg-left p-lg-5">
                    <div className="bg-warning btn-icon mx-auto mx-lg-0 text-white font-size-xl d-50 rounded mb-4">
                      <FontAwesomeIcon icon={['far', 'lightbulb']} />
                    </div>
                    <h4 className="display-4 font-weight-bold mb-3">
                      Propose An Introduction
                    </h4>
                    <p className="opacity-7 mb-4 font-size-md line-height-2">
                      Know two people who should meet? Get started by introducing them using an introductin proposal.
                      We'll email both of them and see if they agree to the introduction.
                    </p>
                    <Link to="new-introduction-proposal">
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
          </Container>


        </Grid>
      </div>
    </>
  );
}
