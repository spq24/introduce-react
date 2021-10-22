import React, { useState } from 'react';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { useAuthState } from 'context';
import { NotificationManager } from 'react-notifications';
import {
  Grid,
  Container,
  Card,
  Button,
  TextField,
  FormHelperText,
  CircularProgress,
  Chip,
  Avatar
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Delete from '@material-ui/icons/HighlightOff';

export default function NewReqeustForIntroduction() {
  const userDetails = useAuthState();
  const history = useHistory();
  const [requestForIntro, setRequestForIntro] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companyOptions, setCompanyOptions] = useState([])
  const [companies, setCompanies] = useState([])
  const [jobTitlesLoading, setJobTitlesLoading] = useState(false);
  const [jobTitleOptions, setJobTitleOptions] = useState([])
  const [jobTitles, setJobTitles] = useState([])

  const handleRequestForIntroChange = (e) => {
    const { name, value } = e.target;

    setRequestForIntro(requestForIntro => ({
      ...requestForIntro,
      [name]: value
    }));
  }

  const handleCompanyChange = (e, option) => {
    setCompanies(companies => [...companies, option])
  }

  const handleJobTitlesChange = (e, option) => {
    setJobTitles(jobTitles => [...jobTitles, option])
  }

  const searchCompanies = (e) => {
    e.preventDefault()
    setCompaniesLoading(true)
    axios.get(`/api/v1/search_company?query=${e.target.value}`,{
      headers: userDetails.credentials
    }).then(response => {
      setCompanyOptions(response.data)
      setCompaniesLoading(false)
    }).catch(error => {
      setCompaniesLoading(false)
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)

    })
  }

  const searchJobTitles = (e) => {
    e.preventDefault()
    setJobTitlesLoading(true)
    axios.get(`/api/v1/search_job_title?query=${e.target.value}`, {
      headers: userDetails.credentials
    }).then(response => {

      setJobTitleOptions(response.data)
      setJobTitlesLoading(false)
    }).catch(error => {
      setJobTitlesLoading(false)
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }

  const validateData = () => {
    //TODO: validate data
    setErrorMessage('')
    return true
  }

  const handleSubmit = () => {

    let validated = validateData()
    if (!validated) {
      return
    }

    axios.post('/api/v1/request_for_introductions',
      {
        request_for_introduction: requestForIntro,
        job_titles: jobTitles,
        companies: companies
      },
      { headers: userDetails.credentials }
    ).then(response => {
      NotificationManager.success("You request for introduction os setup now share it with your network!")
      history.push(`/request-for-introductions/${response.data.request_for_introduction.id}`)
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
          <small>New Request For Introduction</small>
          <b>
            Looking for an intro to someone or multiple people, but don't have a person in mind?<br />
            Create a request for intro, and share it with your network!
          </b>
        </div>
      </div>
      <div>
        <div className="mb-3">
          <Container>
            <div className="p-4">
              <h5 className="font-size-xl mb-1 font-weight-bold">
                Tell your network about the type of person you are trying to meet?
              </h5>
              <Grid container spacing={6} >
                <Grid item md={12}>
                  {
                    errorMessage && errorMessage.length > 0 ?
                      <Alert className='text-error' severity='error' style={{ margin: '20px 40px' }}>
                        {errorMessage}
                      </Alert> : null
                  }
                </Grid>
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    label="What is a description of who you are trying to meet?"
                    multiline
                    rows={4}
                    required={true}
                    variant="outlined"
                    name="description"
                    value={requestForIntro.description}
                    onChange={(e) => handleRequestForIntroChange(e)}
                  />
                  <FormHelperText>Examples: Pre-seed VC investor for your startup, other founders, product manager at Google, etc.</FormHelperText>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    label="Why Are You Requesting An Introduction?"
                    multiline
                    rows={4}
                    variant="outlined"
                    required={true}
                    name="why"
                    value={requestForIntro.why}
                    onChange={(e) => handleRequestForIntroChange(e)}
                  />
                  <FormHelperText>examples: Looking for possible investors, looking to network, looking to understand if I would be a fit as a Google PM, etc.</FormHelperText>
                </Grid>
                <Grid item md={12}>
                  {/* <TextField
                    fullWidth
                    label="What Are Some Possible Job Titles This Person Or People Might Have?"
                    multiline
                    rows={1}
                    variant="outlined"
                    name="job_title"
                    value={requestForIntro.job_title}
                    onChange={(e) => handleRequestForIntroChange(e)}
                  /> */}
                  <Autocomplete
                    multiple
                    sx={{ width: 300 }}
                    open={open}
                    onOpen={() => {
                      setOpen(true);
                    }}
                    onClose={() => {
                      setOpen(false);
                    }}
                    isOptionEqualToValue={(option, value) => option.name === value}
                    getOptionLabel={(option) => option.name}
                    options={jobTitleOptions}
                    autoComplete
                    freeSolo
                    includeInputInList
                    filterSelectedOptions
                    onInputChange={(e) => searchJobTitles(e)}
                    onChange={(e, option) => handleJobTitlesChange(e, option)}
                    loading={jobTitlesLoading}
                    renderOption={(option) => {
                      return (
                        <Grid container alignItems="center">
                          <Grid item xs>
                            {option.name}
                          </Grid>
                        </Grid>
                      );
                    }}

                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option.name}
                          deleteIcon={<Delete style={{ color: '#D3D3D3' }} />}
                          style={{ backgroundColor: '#fff', color: '#20262D' }}
                          {...getTagProps({ index }) } />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="What Are Some Possible Job Titles This Person Or People Might Have?"
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                            {jobTitlesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  <FormHelperText>examples: VC Associate or Scout, Founder, Product Manager, etc.</FormHelperText>
                </Grid>

                <Grid item md={12}>
                  <Autocomplete
                    multiple
                    sx={{ width: 300 }}
                    open={open}
                    onOpen={() => {
                      setOpen(true);
                    }}
                    onClose={() => {
                      setOpen(false);
                    }}
                    isOptionEqualToValue={(option, value) => option.name === value}
                    getOptionLabel={(option) => option.name}
                    options={companyOptions}
                    autoComplete
                    freeSolo
                    includeInputInList
                    filterSelectedOptions
                    onChange={(e, option) => handleCompanyChange(e, option)}
                    onInputChange={(e) => searchCompanies(e)}
                    loading={companiesLoading}
                    renderOption={(option) => {
                      return (
                        <Grid container alignItems="center">
                          <Grid item>
                            <Avatar alt={`${option.name}`} src={option.logo} style={{ margin: '10px' }}>
                              {option.name[0]}
                            </Avatar>
                          </Grid>
                          <Grid item xs>
                            {option.name}
                          </Grid>
                        </Grid>
                      );
                    }}

                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          avatar={<Avatar  src={option.logo} />}
                          variant="outlined"
                          label={option.name}
                          deleteIcon={<Delete style={{ color: '#D3D3D3' }} />}
                          style={{ backgroundColor: '#fff', color: '#20262D' }}
                          {...getTagProps({ index }) } />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="What Company Does This Person Or These People Work For"
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {companiesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <div className="p-4 d-flex justify-content-center" style={{ alignItems: 'center', flexDirection: 'column' }}>
                <Button
                  className="btn-success font-weight-bold"
                  onClick={handleSubmit}>
                  Create Your Request For Introduction
                </Button>
              </div>
            </div>
          </Container>
        </div>

      </div>
    </Card>
  );
}
