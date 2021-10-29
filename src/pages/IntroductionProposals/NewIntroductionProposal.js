import React, { useState } from 'react';
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
  Card,
  Button,
  TextField,
  FormHelperText
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import StepConnector from '@material-ui/core/StepConnector';

export default function NewIntroduction() {
  const userDetails = useAuthState();
  const [activeStep, setActiveStep] = useState(0);
  const [introduceeOne, setIntroduceeOne] = useState({});
  const [introduceeTwo, setIntroduceeTwo] = useState({});
  const [introducer] = useState(userDetails.user);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const steps = getSteps();

  const handleIntroduceeOneChange = (e) => {
    const { name, value } = e.target;

    setIntroduceeOne(introduceeOne => ({
      ...introduceeOne,
      [name]: value
    }));
  }

  const handleIntroduceeTwoChange = (e) => {
    const { name, value } = e.target;

    setIntroduceeTwo(introduceeTwo => ({
      ...introduceeTwo,
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
    return ["Introducee #1's Info", "Introducee #2's Info", 'Send It!'];
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const validateData = (step) => {
    let validData = false;
    if (step === 0) {
      validData = validateIntroduceeOne()
    } else if (step === 1) {
      validData = validateIntroduceeTwo()
    }

    return validData
  }

  const validateIntroduceeOne = () => {
    const firstName = introduceeOne.first_name && introduceeOne.first_name.length > 0
    const lastName = introduceeOne.last_name && introduceeOne.last_name.length > 0
    const introducerIntroduceeOneMessage = introduceeOne.introducer_introducee_one_message && introduceeOne.introducer_introducee_one_message.length > 0
    const validEmailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
    const email = introduceeOne.email && introduceeOne.email.length > 0 && validEmailRegex.test(introduceeOne.email)

    if (firstName && lastName && email && introducerIntroduceeOneMessage) {
      return true
    } else {
      setErrorMessage(
        `Please make sure all required fields are filled in properly.
        You are missing: ${!firstName ? 'First Name' : ''}
        ${!lastName ? 'Last Name' : ''}
        ${!introducerIntroduceeOneMessage ? 'Message To Introducee #1' : ''}`
      )
      return false
    }
  }

  const validateIntroduceeTwo = () => {
    const firstName = introduceeTwo.first_name && introduceeTwo.first_name.length > 0
    const lastName = introduceeTwo.last_name && introduceeTwo.last_name.length > 0
    const introducerIntroduceeTwoMessage = introduceeTwo.introducer_introducee_two_message && introduceeTwo.introducer_introducee_two_message.length > 0
    const validEmailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
    const email = introduceeTwo.email && introduceeTwo.email.length > 0 && validEmailRegex.test(introduceeTwo.email)

    if (firstName && lastName && email && introducerIntroduceeTwoMessage) {
      return true
    } else {
      setErrorMessage(
        `Please make sure all required fields are filled in properly.
        You are missing: ${!firstName ? 'First Name' : ''}
        ${!lastName ? 'Last Name' : ''}
        ${!introducerIntroduceeTwoMessage ? 'Message To Introducee #2' : ''}`
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
      introducee_one: introduceeOne,
      introducee_two: introduceeTwo,
      introducer: introducer,
      proposal: true
    }

    axios.post('/api/v1/introduction_proposals',
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
        <div className="card-header--actions"></div>
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
                              value={introduceeOne.first_name}
                              required={true}
                              onChange={(e) => handleIntroduceeOneChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="last_name"
                              variant="outlined"
                              required={true}
                              value={introduceeOne.last_name}
                              onChange={(e) => handleIntroduceeOneChange(e)}
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
                              value={introduceeOne.email}
                              onChange={(e) => handleIntroduceeOneChange(e)}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <TextField
                              fullWidth
                              label={`Your message to ${introduceeOne.first_name && introduceeOne.first_name.length > 0 ? introduceeOne.first_name : 'introducee #1'}`}
                              multiline
                              rows={4}
                              variant="outlined"
                              required={true}
                              name="introducer_introducee_one_message"
                              value={introduceeOne.request_reason}
                              onChange={(e) => handleIntroduceeOneChange(e)}
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
                        <p className="text-black-50 mb-4">Tell us who you want to introduce{introduceeTwo.first_name ? ` to ${introduceeTwo.first_name}` : null}</p>
                        <Grid container spacing={6}>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="First Name"
                              name="first_name"
                              variant="outlined"
                              value={introduceeTwo.first_name}
                              required={true}
                              onChange={(e) => handleIntroduceeTwoChange(e)}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              name="last_name"
                              required={true}
                              variant="outlined"
                              value={introduceeTwo.last_name}
                              onChange={(e) => handleIntroduceeTwoChange(e)}
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
                              value={introduceeTwo.email}
                              onChange={(e) => handleIntroduceeTwoChange(e)}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <TextField
                              fullWidth
                              label={`Your message to ${introduceeTwo.first_name && introduceeTwo.first_name.length > 0 ? introduceeTwo.first_name : 'introducee #2'}`}
                              multiline
                              rows={4}
                              variant="outlined"
                              required={true}
                              name="introducer_introducee_two_message"
                              value={introduceeTwo.introducer_introducee_two_message}
                              onChange={(e) => handleIntroduceeTwoChange(e)}
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
