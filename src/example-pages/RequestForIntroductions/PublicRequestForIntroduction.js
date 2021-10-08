import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  Container,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Card,
  Button,
  List,
  ListItem,
  TextField,
  FormHelperText,
  Avatar,
  Chip
} from '@material-ui/core';
import Moment from 'react-moment';
import 'moment-timezone';
import Alert from '@material-ui/lab/Alert';
import { NotificationManager } from 'react-notifications';
import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';
import Loader from '../../example-components/Loader';

export default function PublicRequestForIntroduction() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({})
  const [requestForIntroduction, setRequestForIntroduction] = useState({})
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { id } = useParams();
  const date = new Date();
  const year = date.getFullYear();

  useEffect(() => {
    if(id) {
      axios.get(`/api/v1/request_for_introductions/${id}/public_show`)
           .then(response => {
             console.log('response', response)
             setRequestForIntroduction(response.data.request_for_introduction)
             const user = response.data.request_for_introduction.user
             setUser(user)
             document.title = `Request For Introduction From ${user.first_name} ${user.last_name}`
             setLoading(false)
           })
           .catch(error => {
             let message = error && error.response && error.response.data && error.response.data.message ?
               error.response.data.message : 'There was an error. Please try again!'
             NotificationManager.error(message)
           })
    }
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className="app-wrapper min-vh-100 bg-white">
        <div className="hero-wrapper w-100 bg-composed-wrapper bg-midnight-bloom min-vh-100">
          <div className="flex-grow-1 w-100 d-flex align-items-center">
            <div
              className="bg-composed-wrapper--image opacity-6"
              style={{ backgroundImage: 'url(https://ik.imagekit.io/canyouintrome/handshake-close_kmndubvB_.jpeg)' }}
            />
            <div className="bg-composed-wrapper--bg bg-second opacity-7" />
            <div className="bg-composed-wrapper--content p-3 p-md-5">
              <Container>
                <Grid container spacing={6}>
                  <Grid item md={12} className="d-flex justify-content-center" style={{ marginBottom: '50px', flexDirection: 'column', alignItems: 'center' }}>
                    {
                      user.image && user.image.url ?
                        <div className="avatar-icon-wrapper border-white m-3">
                          <div className="avatar-icon shadow-sm d-100">
                            <img alt={`${user.first_name} ${user.last_name}`} src={user.image.url} />
                          </div>
                        </div> :
                        user.first_name && user.first_name.length > 0 ?
                          <div className="avatar-icon-wrapper avatar-initials avatar-icon-xl" style={{ marginBottom: '25px' }}>
                            <div className="avatar-icon text-white bg-info">
                              {user.first_name[0]}
                            </div>
                          </div>
                          :
                          null
                    }
                    <h1 className="font-size-xxl mb-2 font-weight-bold text-white">
                      {user.first_name} {user.last_name}
                    </h1>
                    <span className="font-size-xl mb-1 text-white" style={{ textAlign: 'center' }}>
                      Hello! I'm looking for some help getting introduced to some helpful people, but I'm not sure exactly who.<br />
                      Would you be able to help make an introduction?
                    </span>
                  </Grid>
                </Grid>
                <Card className="card-box mb-spacing-6-x2">
                  <Card className="rounded-sm overflow-hidden shadow-xxl font-size-sm p-3 p-sm-5">
                    <Grid container spacing={0}>
                      <Grid item xl={12} className="mb-3">
                        <p className="font-size-xl font-weight-bold">
                          Who I'm Looking For An Introduction To:
                        </p>
                        <p className="font-size-md">
                          {requestForIntroduction.description}
                        </p>
                      </Grid>
                      <Grid item xl={12} className="mb-3">
                        <p className="font-size-xl font-weight-bold">
                          Why I'm Looking For An Introduction:
                        </p>
                        <p className="font-size-md">
                          {
                            requestForIntroduction.why.length > 0 ?
                              requestForIntroduction.why :
                              'N/A'
                          }
                        </p>
                      </Grid>
                      <Grid item xl={6}>
                        <p className="font-size-xl font-weight-bold d-flex justify-content-center">
                          Job Titles They Might Have:
                        </p>
                        <p className="font-size-md d-flex justify-content-evenly">
                          {
                            requestForIntroduction.job_titles && requestForIntroduction.job_titles.length > 0 ?
                              requestForIntroduction.job_titles.map(title => {
                                return (
                                  <Chip
                                    key={title.id}
                                    variant="outlined"
                                    label={title.name}
                                    style={{ backgroundColor: '#fff', color: '#20262D' }} />
                                )
                              }) :
                              'N/A'
                          }
                        </p>
                      </Grid>
                      <Grid item xl={6}>
                        <p className="font-size-xl font-weight-bold  d-flex justify-content-center">
                          Companies They Might Work For:
                        </p>
                        <p className="font-size-md d-flex justify-content-evenly">
                          {
                            requestForIntroduction.introducee_companies && requestForIntroduction.introducee_companies.length > 0 ?
                              requestForIntroduction.introducee_companies.map(company => {
                                return (
                                  <Chip
                                    key={company.id}
                                    avatar={<Avatar src={company.logo_url} />}
                                    variant="outlined"
                                    label={company.name}
                                    style={{ backgroundColor: '#fff', color: '#20262D' }} />
                                )
                              }) :
                              'N/A'
                          }
                        </p>
                      </Grid>
                      <Grid item md={12} className="d-flex flex-column align-items-center mt-5">
                        <p className="font-size-xl font-weight-bold">
                          Can You Make An Introduction?
                        </p>
                        {
                          requestForIntroduction.closed ?
                            <Button className="btn-success font-weight-bold" disabled={true}>
                            Request Closed  &nbsp; {<Moment format="MM/DD/YYYY">{requestForIntroduction.closed_at}</Moment>}
                            </Button>
                          :
                          <Link to={`/request-for-intro/${id}/new-introduction`} target="_blank">
                            <Button className="btn-success font-weight-bold">
                              I Can Make An Introduction!
                            </Button>
                          </Link>
                        }
                      </Grid>
                    </Grid>
                  </Card>
                </Card>
              </Container>
            </div>
          </div>
          <div className="hero-footer w-100 pb-4">
            <Container>
              <div className="py-3 d-block d-lg-flex font-size-xs justify-content-between">
                <div className="text-center d-block mb-3 mb-md-0 text-white">
                  Copyright &copy; {year} - canyouintro.me
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}
