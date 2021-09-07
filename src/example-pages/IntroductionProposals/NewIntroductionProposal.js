import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { useAuthState } from 'context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NotificationManager } from 'react-notifications';
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
import Alert from '@material-ui/lab/Alert';
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
  const [introducer] = useState(userDetails.user);
  const [requester, setRequester] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const steps = getSteps();

  const handleIntroduceeChange = (e) => {
    const { name, value } = e.target;

    setIntroducee(introducee => ({
      ...introducee,
      [name]: value
    }));
  }

  const handleRequesterChange = (e) => {
    const { name, value } = e.target;

    setRequester(requester => ({
      ...requester,
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
    return ["1st Person's Info", "2nd Person's Info", 'Send It!'];
  }

  const handleNext = () => {
    let validated = validateData(activeStep)
    if (!validated) {
      return
    }

    setErrorMessage('')

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const validateData = (step) => {
    let validData = false;
    if (step === 0) {
      validData = validateIntroducee()
    } else if (step === 1) {
      validData = validateRequester()
    }

    return validData
  }

  const validateIntroducee = () => {
    const firstName = introducee.first_name && introducee.first_name.length > 0
    const lastName = introducee.last_name && introducee.last_name.length > 0
    const requestReason = introducee.request_reason && introducee.request_reason.length > 0
    const validEmailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
    const email = introducee.email && introducee.email.length > 0 && validEmailRegex.test(introducee.email)

    if (firstName && lastName && email && requestReason) {
      return true
    } else {
      setErrorMessage(
        `Please make sure all required fields are filled in properly.
        You are missing: ${!firstName ? 'First Name' : ''}
        ${!lastName ? 'Last Name' : ''}
        ${!requestReason ? 'Request Reason' : ''}`
      )
      return false
    }
  }

  const validateRequester = () => {
    const firstName = requester.first_name && requester.first_name.length > 0
    const lastName = requester.last_name && requester.last_name.length > 0
    const validEmailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
    const requesterIntroducerMessage = requester.requester_introducer_message && requester.requester_introducer_message.length > 0
    const email = requester.email && requester.email.length > 0 && validEmailRegex.test(requester.email)

    if (firstName && lastName && email && requesterIntroducerMessage) {
      return true
    } else {
      setErrorMessage(
        `Please make sure all required fields are filled in properly.
        You are missing: ${!firstName ? 'First Name' : ''}
        ${!lastName ? 'Last Name' : ''}
        ${!email ? 'Valid Email' : ''}`
      )
      return false
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = () => {
    let intro = {
      introducee: introducee,
      requester: requester,
      introducer: introducer,
      proposal: true
    }

    axios.post('/api/v1/introduction-proposal-create',
      intro,
      { headers: userDetails.credentials }
    ).then(response => {
      NotificationManager.success("Introduction Proposal Is On It's Way")
      history.push(`/introduction-proposals/${response.data.introduction.id}`)
    }).catch(error => {
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }

  return (
    <Card className="card-box">
      <div className="card-header">
        <div className="card-header--title">
          <small>New Introduction Proposal</small>
          <b>Tell us the two people you think should meet, and we'll handle the rest.</b>
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
              {
                errorMessage && errorMessage.length > 0 ?
                  <Alert className='text-error' severity='error' style={{ margin: '20px 40px' }}>
                    {errorMessage}
                  </Alert> : null
              }

              <div>
                {
                  activeStep === 0 ?
                    <Container>
                      <div className="p-4">
                        <h5 className="font-size-xl mb-1 font-weight-bold">
                          Who Is The First Introducee?
                        </h5>
                        <p className="text-black-50 mb-4">
                          Tell us the first person's info
                        </p>
                        <Grid container spacing={6}>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="First Name"
                              name="first_name"
                              variant="outlined"
                              value={introducee.first_name}
                              required={true}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="last_name"
                              variant="outlined"
                              required={true}
                              value={introducee.last_name}
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
                              required={true}
                              value={introducee.email}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <TextField
                              fullWidth
                              label={`Your message to ${introducee.first_name && introducee.first_name.length > 0 ? introducee.first_name : 'introducee #1'}`}
                              multiline
                              rows={4}
                              variant="outlined"
                              required={true}
                              name="request_reason"
                              value={introducee.request_reason}
                              onChange={(e) => handleIntroduceeChange(e)}
                            />
                            <FormHelperText>example: John Doe is great, I've worked with him for years. He's looking for people with your expertise so I thought you two should connect.</FormHelperText>
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
                          Who is the 2nd introducee?
                        </h5>
                        <p className="text-black-50 mb-4">Tell us who you want to introduce{introducee.first_name ? ` to ${introducee.first_name}` : null}</p>
                        <Grid container spacing={6}>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="First Name"
                              name="first_name"
                              variant="outlined"
                              value={requester.first_name}
                              required={true}
                              onChange={(e) => handleRequesterChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="last_name"
                              required={true}
                              variant="outlined"
                              value={requester.last_name}
                              onChange={(e) => handleRequesterChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="Email"
                              type="email"
                              name="email"
                              required={true}
                              variant="outlined"
                              value={requester.email}
                              onChange={(e) => handleRequesterChange(e)}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <TextField
                              fullWidth
                              label={`Your message to ${requester.first_name && requester.first_name.length > 0 ? requester.first_name : 'introducee #2'}`}
                              multiline
                              rows={4}
                              variant="outlined"
                              required={true}
                              name="requester_introducer_message"
                              value={requester.requester_introducer_message}
                              onChange={(e) => handleRequesterChange(e)}
                            />
                            <FormHelperText>example: Jane Doe is great, I've worked with her for years. She's looking for people with your expertise so I thought you two should connect.</FormHelperText>
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
                          Send Your Introduction Proposal
                        </h5>
                        <p className="text-black-50 mb-4">
                          Send out an email and we will keep you up to date on the status
                        </p>

                        <Button
                          className="btn-success font-weight-bold"
                          onClick={handleSubmit}>
                          Send It!
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
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
      </div>
    </Card>
  );
}
