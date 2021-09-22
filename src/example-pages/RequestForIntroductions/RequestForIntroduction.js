import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'context';
import { useParams } from 'react-router-dom';
import { Avatar, Card, Grid, Button, Tooltip, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'react-moment';
import 'moment-timezone';
import { NotificationManager } from 'react-notifications';
import List from './List'

import avatar3 from 'assets/images/avatars/avatar3.jpg';
import Loader from '../../example-components/Loader';

import avatar1 from 'assets/images/avatars/avatar1.jpg';
import avatar2 from 'assets/images/avatars/avatar2.jpg';

import avatar5 from 'assets/images/avatars/avatar5.jpg';
import avatar6 from 'assets/images/avatars/avatar6.jpg';
import avatar7 from 'assets/images/avatars/avatar7.jpg';

import stock6 from 'assets/images/stock-photos/stock-6.jpg';


import avatar4 from 'assets/images/avatars/avatar4.jpg';

import logo1 from 'assets/images/stock-logos/spotify-icon.svg';
import logo2 from 'assets/images/stock-logos/pinterest-icon.svg';
import logo3 from 'assets/images/stock-logos/slack-icon.svg';

export default function RequestForIntroduction(props) {
  const userDetails = useAuthState();
  const user = userDetails && userDetails.user ? userDetails.user : null;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(true);
  const [submitted, setSubmitted] = useState(true);
  const [requestForIntroduction, setRequestForIntroduction] = useState({});
  const [introductions, setIntroductions] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/api/v1/request_for_introductions/${id}`, {
      headers: userDetails.credentials
    })
    .then(response => {
      setRequestForIntroduction(response.data.request_for_introduction)
      setIntroductions(response.data.request_for_introduction.introductions)
      setLoading(false)
    })
    .catch(error => {
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRequestForIntroduction(requestForIntroduction => ({
      ...requestForIntroduction,
      [name]: value
    }));
  }

  const closeRequest = (e) => {
    e.preventDefault()
    setSubmitting(true)

    axios.post(`/api/v1//request_for_introductions/${id}/close_request`,
      {
        id: id
      }, {
        headers: userDetails.credentials
    }).then(response => {
      setRequestForIntroduction(response.data.request_for_introduction)
      NotificationManager.success('Successfully closed')
      setSubmitted(true)
      setSubmitting(false)
    }).catch(error => {
      setSubmitting(false)
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>

      <Grid container spacing={0}>
        <Grid item xl={12}>
          <div className="hero-wrapper bg-composed-wrapper h-100 rounded br-xl-left-0">
            <div className="flex-grow-1 w-100 d-flex align-items-end">
              <div
                className="bg-composed-wrapper--image rounded br-xl-left-0 opacity-10 bg-composed-filter-rm"
                style={{ backgroundImage: 'url(https://ik.imagekit.io/canyouintrome/handshake-close_kmndubvB_.jpeg)' }}
              />
              <div className="bg-composed-wrapper--bg bg-second rounded br-xl-left-0 opacity-5"  />
              <div className="bg-composed-wrapper--content text-center p-5">
                <div className="text-white mt-3">
                  <h2 className="display-3 my-3 font-weight-bold">
                    Your Request For Introduction
                  </h2>
                  <Grid container spacing={0}>
                    <Grid item xl={4}>
                      <p className="font-size-lg mb-2 text-white-10">
                        <b>Job Title:</b><br />
                        {
                          requestForIntroduction.job_title.length > 0 ?
                            requestForIntroduction.job_title :
                            'N/A'
                        }
                      </p>
                    </Grid>
                    <Grid item xl={4}>
                      <p className="font-size-lg mb-2 text-white-10">
                        <b>Company:</b><br />
                        {requestForIntroduction.company}
                      </p>
                    </Grid>
                    <Grid item xl={4}>
                      <p className="font-size-lg mb-2 text-white-10">
                        <b>Why Category:</b><br />
                        {
                          requestForIntroduction.why_category.length > 0 ?
                            requestForIntroduction.why :
                            'N/A'
                        }
                      </p>
                    </Grid>
                    <Grid item xl={6}>
                      <p className="font-size-lg mb-2 text-white-10">
                        <b>Description:</b><br />
                        {requestForIntroduction.description}
                      </p>
                    </Grid>

                    <Grid item xl={6}>
                      <p className="font-size-lg mb-2 text-white-10">
                        <b>Why:</b><br />
                        {
                          requestForIntroduction.why.length > 0 ?
                            requestForIntroduction.why :
                            'N/A'
                        }
                      </p>
                    </Grid>
                  </Grid>
                  <div className="divider border-1 mx-auto my-4 border-light opacity-2 rounded w-25" />
                  <div className="d-flex justify-content-around">
                    {
                      !requestForIntroduction.closed ?
                        <Button
                          href="#/"
                          onClick={(e) => e.preventDefault()}
                          size="large"
                          className="btn-success btn-pill hover-scale-lg">
                          <span className="btn-wrapper--label">See Public Request</span>
                          <span className="btn-wrapper--icon">
                            <FontAwesomeIcon icon={['fas', 'external-link-alt']} />
                          </span>
                        </Button> : null
                    }
                    {
                      requestForIntroduction.closed ?
                        <Button
                          size="large"
                          className="btn-danger btn-pill hover-scale-lg"
                          disabled={true}>
                          <span className="btn-wrapper--label">
                            Request Closed &nbsp; {<Moment format="MM/DD/YYYY">{requestForIntroduction.closed_at}</Moment>}
                          </span>
                          <span className="btn-wrapper--icon">
                            <FontAwesomeIcon icon={['fas', 'external-link-alt']} />
                          </span>
                        </Button> :
                        <Button
                          onClick={(e) => closeRequest(e)}
                          size="large"
                          className="btn-danger btn-pill hover-scale-lg">
                          <span className="btn-wrapper--label">Close Request</span>
                          <span className="btn-wrapper--icon">
                            <FontAwesomeIcon icon={['fas', 'close']} />
                          </span>
                        </Button>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={6} className="mb-5">
        <Grid item md={12} lg={12} xl={12}>
          <h2 className="display-3 my-3 font-weight-bold">
            Share Your Request
          </h2>
        </Grid>
        <Grid item md={4} lg={12} xl={4}>
          <Card className="card-box card-box-hover">
            <div className="text-center py-3">
              <div className="d-70 rounded-lg border-0 my-3 shadow-xxl btn-icon p-2 bg-white card-icon-wrapper mx-auto">
                <img
                  className="img-fit-container d-40 rounded-lg"
                  alt="..."
                  src={logo1}
                />
              </div>

              <div className="divider mx-auto my-3" />
              <div className="text-center px-3">
                <Button
                  fullWidth
                  className="d-flex btn-transition-none border-0 shadow-none btn-neutral-dark">
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon icon={['far', 'user-circle']} />
                  </span>
                  <span className="btn-wrapper--label">Share</span>
                </Button>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item md={4} lg={12} xl={4}>
          <Card className="card-box card-box-hover">
            <div className="text-center py-3">
              <div className="d-70 rounded-lg border-0 my-3 shadow-xxl btn-icon p-2 bg-white card-icon-wrapper mx-auto">
                <img
                  className="img-fit-container d-40 rounded-lg"
                  alt="..."
                  src={logo2}
                />
              </div>

              <div className="divider mx-auto my-3" />
              <div className="text-center px-3">
                <Button
                  fullWidth
                  className="d-flex btn-transition-none border-0 shadow-none btn-neutral-dark">
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon icon={['far', 'user-circle']} />
                  </span>
                  <span className="btn-wrapper--label">Share</span>
                </Button>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item md={4} lg={12} xl={4}>
          <Card className="card-box card-box-hover">
            <div className="text-center py-3">
              <div className="d-70 rounded-lg border-0 my-3 shadow-xxl btn-icon p-2 bg-white card-icon-wrapper mx-auto">
                <img
                  className="img-fit-container d-40 rounded-lg"
                  alt="..."
                  src={logo3}
                />
              </div>

              <div className="divider mx-auto my-3" />
              <div className="text-center px-3">
                <Button
                  fullWidth
                  className="d-flex btn-transition-none border-0 shadow-none btn-neutral-dark">
                  <span className="btn-wrapper--icon">
                    <FontAwesomeIcon icon={['far', 'user-circle']} />
                  </span>
                  <span className="btn-wrapper--label">Share</span>
                </Button>
              </div>
            </div>
          </Card>
        </Grid>
      </Grid>

      <Grid item md={12} lg={12} xl={12}>
        <h2 className="display-3 my-3 font-weight-bold">
          Introductions From This Request
        </h2>
      </Grid>
      <List introductions={introductions} />
    </>
  );
}
