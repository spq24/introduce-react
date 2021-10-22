import React, { useEffect, useRef } from 'react';
import { useAuthState, logout, updateUser, useAuthDispatch } from 'context'
import {useHistory } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import { connect } from 'react-redux';
import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';
import HeaderUserbox from '../../layout-components/HeaderUserbox';
import { NotificationManager } from 'react-notifications';

const Header = (props) => {
  const {
    headerShadow,
    headerBgTransparent,
    sidebarToggleMobile,
    setSidebarToggleMobile
  } = props;
  const userDetails = useAuthState();
  const dispatch = useAuthDispatch();
  const history = useHistory();
  let image = useRef(userDetails && userDetails && userDetails.user && userDetails.user.image ? userDetails.user.image.url : '');

  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };

  useEffect(() => {
    const userId = userDetails && userDetails.user ? userDetails.user.id : null
    const credentials = userDetails && userDetails.credentials ? userDetails.credentials : null
    if(!userId || !credentials) {
      history.push('/login');
      return;
    }


    axios.get(image.current)
         .catch(error => {
           axios.get(`/api/v1/users/${userId}`, {
             headers: credentials
           })
           .then(response => {
              if(response && response.data && response.data.user) {
                image.current = response.data.user.image.url
                updateUser(dispatch, response.data.user)
              }
           })
         })

    axios.post(`api/v1/auth/${userId}/validate-token`, { client: credentials.client, token: credentials['access-token'] })
         .catch(error => {
           let message = error && error.response && error.response.data && error.response.data.message ?
             error.response.data.message : 'There was an error. Please try again!'
           NotificationManager.error(message)
           history.push('/login')
         })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = (e) => {
    e.preventDefault()
    logout(dispatch)
    .then(response => {
      history.push('/')
    })
    .catch(error => {
      let message = error && error.response && error.response.data && error.response.data.message ?
        error.response.data.message : 'There was an error. Please try again!'
      NotificationManager.error(message)
    })
  }

  return (
    <div
      className={clsx('app-header', {
        'app-header--shadow': headerShadow,
        'app-header--opacity-bg': headerBgTransparent
      })}>
      <div className="app-header--pane">
        <button
          className={clsx(
            'navbar-toggler hamburger hamburger--elastic toggle-mobile-sidebar-btn',
            { 'is-active': sidebarToggleMobile }
          )}
          onClick={toggleSidebarMobile}>
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </button>
        {/* <HeaderSearch /> */}
      </div>
      <div className="app-header--pane">
        <HeaderUserbox
          user={userDetails.user}
          trueUser={userDetails.trueUser}
          image={image}
          handleLogout={handleLogout} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  headerShadow: state.ThemeOptions.headerShadow,
  headerBgTransparent: state.ThemeOptions.headerBgTransparent,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
