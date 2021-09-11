import React, { useEffect } from 'react';
import { useAuthState, logout, useAuthDispatch } from 'context'
import {useHistory } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import { connect } from 'react-redux';

import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';

import HeaderDots from '../../layout-components/HeaderDots';
import HeaderDrawer from '../../layout-components/HeaderDrawer';
import HeaderUserbox from '../../layout-components/HeaderUserbox';
import HeaderSearch from '../../layout-components/HeaderSearch';
import HeaderMenu from '../../layout-components/HeaderMenu';
import { useDispatch } from 'react-redux/lib/hooks/useDispatch';
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

    axios.post(`api/v1/auth/${userId}/validate-token`, { client: credentials.client, token: credentials['access-token'] })
         .catch(error => {
           let message = error && error.response && error.response.data && error.response.data.message ?
             error.response.data.message : 'There was an error. Please try again!'
           NotificationManager.error(message)
           history.push('/login')
         })
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
