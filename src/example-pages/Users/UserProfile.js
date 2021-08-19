import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuthState, useAuthDispatch, updateUser } from 'context';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NotificationManager } from 'react-notifications';
import {
  Grid,
  Container,
  InputAdornment,
  ButtonGroup,
  Card,
  Button,
  List,
  ListItem,
  TextField
} from '@material-ui/core';
import Loader from '../../example-components/Loader';
import ProfileCard from './ProfileCard';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDropzone } from 'react-dropzone';
import CountUp from 'react-countup';

import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import CheckIcon from '@material-ui/icons/Check';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';

import hero1 from 'assets/images/hero-bg/hero-8.jpg';
import stock3 from 'assets/images/stock-photos/stock-6.jpg';

import stock1 from 'assets/images/stock-photos/stock-4.jpg';
import stock2 from 'assets/images/stock-photos/stock-5.jpg';

import people1 from 'assets/images/stock-photos/people-1.jpg';

import TrendingUpTwoToneIcon from '@material-ui/icons/TrendingUpTwoTone';
import TrendingDownTwoToneIcon from '@material-ui/icons/TrendingDownTwoTone';

import ArrowBackTwoToneIcon from '@material-ui/icons/ArrowBackTwoTone';

import people3 from 'assets/images/stock-photos/people-3.jpg';
import people2 from 'assets/images/stock-photos/people-2.jpg';

import avatar1 from 'assets/images/avatars/avatar1.jpg';
import avatar2 from 'assets/images/avatars/avatar2.jpg';
import avatar3 from 'assets/images/avatars/avatar3.jpg';
import avatar4 from 'assets/images/avatars/avatar4.jpg';
import avatar5 from 'assets/images/avatars/avatar5.jpg';
import avatar6 from 'assets/images/avatars/avatar6.jpg';
import avatar7 from 'assets/images/avatars/avatar7.jpg';

export default function UserProfile() {
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  const [loading, setLoading] = useState(true)
  const { id } = useParams();
  const [inputBg, setInputBg] = useState(false);
  const [user, setUser] = useState({});
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const toggleInputBg = () => setInputBg(!inputBg);

  useEffect(() => {
    axios.get(`/api/v1/users/${id}`, { headers: userDetails.credentials })
         .then(response => {
           setUser(response.data.user)
           if(response.data.user.image && response.data.user.image.url) {
            setFiles([...files, { preview: response.data.user.image.url }])
           }
           setLoading(false)
         })
         .catch(error => {
           setLoading(false)
           let  message = error && error.response && error.response.data && error.response.data.message ?
             error.response.data.message : 'There was an error. Please try again!'
           NotificationManager.error(message)
         })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser(user => ({
      ...user,
      [name]: value
    }));
  }

  const handleSubmit = () => {
    setSubmitting(true)
    axios.put(`/api/v1/users/${id}`, {
      user: user
    }, {
      headers: userDetails.credentials
    }).then(response => {
      NotificationManager.success('Successfully updated!')
      updateUser(dispatch, response.data.user)
      setSubmitting(false)
    }).catch(error => {
      setSubmitting(false)
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }


  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
    getRootProps,
    getInputProps
  } = useDropzone({
      noClick: true,
      noKeyboard: true,
      multiple: false,
      accept: 'image/*',
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );

        let file = acceptedFiles[0]
        uploadImage(file)
      }
    });

  const thumbs = files.map((file) => (
    <div
      key={file.name}
      className="rounded-circle avatar-image overflow-hidden d-140 bg-neutral-success text-center font-weight-bold text-success d-flex justify-content-center align-items-center">
      <img
        className="img-fluid img-fit-container rounded-sm"
        src={file.preview}
        alt={`${user.first_name} ${user.last_name}`}
      />
    </div>
  ));

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const uploadImage = (image) => {
    let reader = new FileReader();

    if (!image) {
      return;
    }

    reader.readAsDataURL(image)

    let formData = new FormData();
    formData.append('image', image);

    axios.put(`/api/v1/users/${id}/update-image`,
      formData,
      {
        headers: userDetails.credentials
      }
    )
    .then(response => {
      setUser(response.data.user)
      if(response.data.user.image && response.data.user.image.url) {
        setFiles([...files, { preview :response.data.user.image.url }])
      }
      NotificationManager.info('Updated your profile image!')
    })
    .catch(error => {
      let message = error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was a problem uploading your profile image'
      NotificationManager.error(message);
      setUser({
        ...user,
        'image': ''
      });
    })
  };

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div style={{ margin: '0px 15% 2% 15%' }}>
        <Grid container spacing={6}>
          <ProfileCard
            title='Your Personalized Link'
            link={`https://canyouintro.me/new-introduction-request/${user.unique_id}`} />
        </Grid>
      </div>
      <div className="app-inner-content-layout">
        <div className="app-inner-content-layout--main bg-white p-0">
          <div className="hero-wrapper mx-5 rounded-bottom shadow-xxl bg-composed-wrapper bg-second" style={{ minHeight: '350px' }}>
            <div className="flex-grow-1 w-100 d-flex align-items-center">
              <div
                className="bg-composed-wrapper--image rounded-bottom opacity-3"
                style={{ backgroundImage: 'url(https://ik.imagekit.io/canyouintrome/meeting-of-the-minds_SHct6M6IUQ.jpeg)', backgroundPosition: 'center top' }}
              />
              <div className="bg-composed-wrapper--bg rounded-bottom bg-deep-sky opacity-4" />
              <div className="bg-composed-wrapper--content px-3 pt-5">
                <Container className="pt-4">
                  <div className="d-block d-md-flex align-items-start">
                    <div className="dropzone rounded-circle shadow-sm-dark mr-md-3">
                      <div
                        {...getRootProps({
                          className: 'dropzone-upload-wrapper'
                        }) }>
                        <input {...getInputProps() } />
                        <div className="dropzone-inner-wrapper d-140 rounded-circle dropzone-avatar">
                          <div className="avatar-icon-wrapper d-140 rounded-circle m-2">
                            <Button
                              onClick={open}
                              className="btn-first avatar-button badge shadow-sm-dark btn-icon badge-position badge-position--bottom-right border-0 text-indent-0 d-40 badge-circle badge-first text-white">
                              <PublishTwoToneIcon className="d-20" />
                            </Button>

                            <div>
                              {isDragAccept && (
                                <div className="rounded-circle overflow-hidden d-140 bg-success text-center font-weight-bold text-white d-flex justify-content-center align-items-center">
                                  <CheckIcon className="d-40" />
                                </div>
                              )}
                              {isDragReject && (
                                <div className="rounded-circle overflow-hidden d-140 bg-danger text-center font-weight-bold text-white d-flex justify-content-center align-items-center">
                                  <CloseTwoToneIcon className="d-60" />
                                </div>
                              )}
                              {!isDragActive && (
                                <div className="rounded-circle overflow-hidden d-140 bg-second text-center font-weight-bold text-white-50 d-flex justify-content-center align-items-center">
                                  <AccountCircleTwoToneIcon className="d-50" />
                                </div>
                              )}
                            </div>

                            <div>
                              <div>{thumbs}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex text-white flex-column pl-md-2">
                      <div className="d-block d-md-flex align-items-center">
                        <div className="my-3 my-md-0">
                          <div className="d-flex align-items-end">
                            <div className="font-size-xxl font-weight-bold">
                              {user.first_name} {user.last_name}
                            </div>
                          </div>
                          <div className="font-weight-bold mt-1 font-size-lg text-white-50">
                            <a href={`/new-introduction-request/${user.unique_id}`} className="text-white-50" target="_blank">
                              Your Introduction Request Page <FontAwesomeIcon icon={['fas', 'external-link-alt']} lassName="text-white-50" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          </div>
          <Container className="z-over py-5">
            <Grid container spacing={6}>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  variant="outlined"
                  value={user.first_name}
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  variant="outlined"
                  value={user.last_name}
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  name="email"
                  variant="outlined"
                  value={user.email}
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="Unique ID"
                  name="unique_id"
                  variant="outlined"
                  value={user.unique_id}
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  variant="outlined"
                  value={user.title}
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  variant="outlined"
                  value={user.password}
                  type="password"
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid item md={12} className="d-flex justify-content-center">
                <Button
                  className="btn-success font-weight-bold"
                  onClick={handleSubmit}
                  disabled={submitting}>
                  Update
                </Button>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    </>
  );
}
