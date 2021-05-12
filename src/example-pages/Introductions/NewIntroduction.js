import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { useAuthState } from 'context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  Container,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Card,
  MenuItem,
  Button,
  Tooltip,
  TextField,
  FormControl,
  Select,
  FormHelperText
} from '@material-ui/core';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import StepConnector from '@material-ui/core/StepConnector';

export default function NewIntroduction() {
  const userDetails = useAuthState();
  const [activeStep, setActiveStep] = useState(0);
  const [introducee, setIntroducee] = useState({});
  const [introducer, setIntroducer] = useState({});
  const history = useHistory();
  const steps = getSteps();

  const handleIntroduceeChange = (e) => {
    const { name, value } = e.target;

    setIntroducee(introducee => ({
      ...introducee,
      [name]: value
    }));
  }

  const handleIntroducerChange = (e) => {
    const { name, value } = e.target;

    setIntroducer(introducer => ({
      ...introducer,
      [name]: value
    }));
  }

  function StepIcon(props) {
    const { active, completed } = props;

    const icons = {
      1: <GroupAddIcon />,
      2: <GroupAddIcon />,
      3: <VideoLabelIcon />
    };

    return (
      <div
        className={clsx(
          'd-50 transition-base d-flex align-items-center bg-gray-400 justify-content-center rounded',
          {
            'd-80 bg-primary text-white shadow-primary-sm': active,
            'd-50 bg-success text-white shadow-success-sm': completed
          }
        )}>
        {completed ? <Check className="completed" /> : icons[String(props.icon)]}
      </div>
    );
  }

  StepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    icon: PropTypes.node
  };

  function getSteps() {
    return ['Who Do You Want To Meet?', 'Who Are You Asking For An Introduction?', 'Send It!'];
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = () => {
    let intro = {
      introducee: introducee,
      introducer: introducer
    }

    axios.post('/api/v1/introductions',
      intro,
      { headers: userDetails.credentials }
    ).then(response => {
      // TODO: notification
      history.push(`/introductions/${response.data.introduction.id}`)
    }).catch(error => {
      console.log('error', error.response)
    })
  }

  return (
    <Card className="card-box">
      <div className="card-header">
        <div className="card-header--title">
          <small>New Introduction</small>
          <b>Let us know all the info so we can arrange an introduction for you!</b>
        </div>
        <div className="card-header--actions">

        </div>
      </div>
      <div>
        <div className="bg-secondary mb-3">
          <Stepper
            className="stepper-horizontal-1"
            alternativeLabel
            activeStep={activeStep}
            connector={<StepConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        {activeStep === steps.length ? (
          <div className="text-center p-5">
            <div className="avatar-icon-wrapper rounded-circle m-0">
              <div className="d-inline-flex justify-content-center p-0 rounded-circle btn-icon avatar-icon-wrapper bg-neutral-warning text-warning m-0 d-130">
                <FontAwesomeIcon
                  icon={['far', 'lightbulb']}
                  className="d-flex align-self-center display-3"
                />
              </div>
            </div>
            <h4 className="font-weight-bold mt-4">You finished all steps!</h4>
            <p className="mb-0 font-size-lg text-muted">
              Customize your stepper fast and easy!
            </p>
            <div className="pt-4">
              <Button
                onClick={handleReset}
                className="btn-warning font-weight-bold rounded hover-scale-lg mx-1"
                size="large">
                <span className="btn-wrapper--label">Reset Stepper</span>
              </Button>
            </div>
          </div>
        ) : (
            <div>
              <div>
                {
                  activeStep === 0 ?
                    <Container>
                      <div className="p-4">
                        <h5 className="font-size-xl mb-1 font-weight-bold">
                          Who Are You Looking To Get Introduced To?
                        </h5>
                        <p className="text-black-50 mb-4">
                          Give your introducer the info they need to make the introduction.
                        </p>
                        <Grid container spacing={6}>
                          <Grid item md={6}>
                            <TextField
                              fullWidth
                              label="First Name"
                              name="first_name"
                              variant="outlined"
                              value={introducee.first_name}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                          </Grid>
                          <Grid item md={6}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="last_name"
                              variant="outlined"
                              value={introducee.last_name}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <TextField
                              fullWidth
                              label="What are some more details about this person?"
                              multiline
                              rows={4}
                              variant="outlined"
                              name="about_introducee"
                              value={introducee.about_introducee}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                            <FormHelperText>examples: Job title, company, etc. You want to make sure the introducer knows the right person to introduce you to.</FormHelperText>
                          </Grid>
                          <Grid item md={12}>
                            <TextField
                              fullWidth
                              label="Why Are You Requesting An Introduction?"
                              multiline
                              rows={4}
                              variant="outlined"
                              name="request_reason"
                              value={introducee.request_reason}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                            <FormHelperText>examples: Curious about a job, looking to learn more, networking, partnership, etc.</FormHelperText>
                          </Grid>
                        </Grid>
                      </div>
                    </Container> : null
                }

                {
                  activeStep === 1 ?
                    <Container>
                      <div className="p-4">
                        <h5 className="font-size-xl mb-1 font-weight-bold">
                          Who Are You Asking For This Introduction?
                        </h5>
                        <p className="text-black-50 mb-4">Tell us about the person you want to make the introduction{introducee.first_name ? ` to ${introducee.first_name}` : null}</p>
                        <Grid container spacing={6}>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="First Name"
                              name="first_name"
                              variant="outlined"
                              value={introducer.first_name}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="last_name"
                              variant="outlined"
                              value={introducer.last_name}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="Email"
                              type="email"
                              name="email"
                              variant="outlined"
                              value={introducer.email}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <TextField
                              fullWidth
                              label="Your Message To The Person You Are Asking To Introduce You"
                              multiline
                              rows={4}
                              variant="outlined"
                              name="requester_introducer_message"
                              value={introducer.requester_introducer_message}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                            <FormHelperText>Make your case for why the person you are asking should make the introduction</FormHelperText>
                          </Grid>
                        </Grid>
                      </div>
                    </Container>
                    : null
                }

                {
                  activeStep === 2 ?
                    <Container>
                      <div className="p-4 d-flex justify-content-center" style={{ alignItems: 'center', flexDirection: 'column' }}>
                        <h5 className="font-size-xl mb-1 font-weight-bold">
                          Send Your Introduction Request
                        </h5>
                        <p className="text-black-50 mb-4">
                          Send out an email and we will keep you up to date on the status
                        </p>

                        <Button
                          className="btn-success font-weight-bold"
                          onClick={handleSubmit}>
                          Send Introduction Request
                        </Button>
                      </div>
                    </Container>
                    : null
                }
              </div>
              <div className="card-footer mt-4 p-4 d-flex align-items-center justify-content-between bg-secondary">
                <Button
                  disabled={activeStep === 0}
                  className="btn-primary font-weight-bold"
                  onClick={handleBack}>
                  Back
              </Button>
                <Button
                  className="btn-primary font-weight-bold"
                  onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
      </div>
    </Card>
  );
}
