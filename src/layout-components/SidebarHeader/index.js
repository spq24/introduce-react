import React from 'react';

import clsx from 'clsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from '@material-ui/core';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import {
  setSidebarToggle,
  setSidebarToggleMobile
} from '../../reducers/ThemeOptions';

import projectLogo from '../../assets/images/can-you-intro-me-logo-long-white.png';
import projectLogoSmall from '../../assets/images/can-you-intro-logo-icon-small-white.png';

const SidebarHeader = (props) => {
  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };
  const {
    sidebarToggleMobile,
    setSidebarToggleMobile,

    sidebarToggle,
    setSidebarToggle
  } = props;

  return (
    <>
      <div className="app-sidebar--header">
        <div className="app-sidebar-logo">
          <NavLink
            to="/dashboard"
            title="Can You Intro Me?"
            className="app-sidebar-logo">
            <div className="app-sidebar-logo">
              <img
                alt="Can You Intro Me?"
                style={{ width: sidebarToggleMobile || sidebarToggle ? '100%' : '75%' }}
                src={sidebarToggleMobile || sidebarToggle ? projectLogoSmall : projectLogo}
              />
            </div>
          </NavLink>
        </div>
        <Tooltip title="Collapse sidebar" placement="right" arrow>
          <Button
            onClick={toggleSidebar}
            className="btn btn-sm collapse-sidebar-btn">
            <FontAwesomeIcon icon={['far', 'dot-circle']} size="lg" />
          </Button>
        </Tooltip>
        <Button
          className={clsx(
            'navbar-toggler hamburger hamburger--elastic toggle-mobile-sidebar-btn',
            { 'is-active': sidebarToggleMobile }
          )}
          onClick={toggleSidebarMobile}>
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </Button>
        <Tooltip title="Expand sidebar" placement="right" arrow>
          <Button
            onClick={toggleSidebar}
            className="expand-sidebar-btn btn btn-sm">
            <FontAwesomeIcon icon={['fas', 'arrows-alt-h']} />
          </Button>
        </Tooltip>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  sidebarToggle: state.ThemeOptions.sidebarToggle,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarToggle: (enable) => dispatch(setSidebarToggle(enable)),
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader);
