import React from 'react';
import { useAuthState } from 'context'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';

import { NavLink } from 'react-router-dom';
import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';

import ChevronRightTwoToneIcon from '@material-ui/icons/ChevronRightTwoTone';

import BallotTwoToneIcon from '@material-ui/icons/BallotTwoTone';

import SupervisorAccountTwoToneIcon from '@material-ui/icons/SupervisorAccountTwoTone';
import GroupAddTwoToneIcon from '@material-ui/icons/GroupAddTwoTone';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PersonAddTwoToneIcon from '@material-ui/icons/PersonAddTwoTone';
import PeopleTwoToneIcon from '@material-ui/icons/PeopleTwoTone';
import OpenInNewTwoToneIcon from '@material-ui/icons/OpenInNewTwoTone';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';

const SidebarMenu = (props) => {
  const userDetails = useAuthState();
  const { setSidebarToggleMobile } = props;

  const toggleSidebarMobile = () => setSidebarToggleMobile(false);



  return (
    <>
      <PerfectScrollbar>
        <div className="sidebar-navigation">
          <div className="sidebar-header">
            <span>Navigation menu</span>
          </div>
          <ul>
            <li>
              <NavLink
                activeClassName="active"
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/dashboard">
                <span className="sidebar-icon">
                  <BallotTwoToneIcon />
                </span>
                  Home
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                activeClassName="active"
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/introductions">
                <span className="sidebar-icon">
                  <GroupAddTwoToneIcon />
                </span>
                Intros You Asked For
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                activeClassName="active"
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/introduction-requests">
                <span className="sidebar-icon">
                  <SupervisorAccountTwoToneIcon />
                </span>
                Intros Asked To Make
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                activeClassName="active"
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/introduction-proposals">
                <span className="sidebar-icon">
                  <PersonAddTwoToneIcon />
                </span>
                Intros Proposed
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                activeClassName="active"
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/request-for-introductions">
                <span className="sidebar-icon">
                  <SearchTwoToneIcon />
                </span>
                Request For Intros
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span>
              </NavLink>
            </li>
            {
              userDetails && userDetails.user && userDetails.user.admin ?
                <li>
                  <NavLink
                    activeClassName="active"
                    onClick={toggleSidebarMobile}
                    className="nav-link-simple"
                    to="/users">
                    <span className="sidebar-icon">
                      <PeopleTwoToneIcon />
                    </span>
                    Users
                    <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                      <ChevronRightTwoToneIcon />
                    </span>
                  </NavLink>
                </li>
                : null
            }
            <li>
              <a href="https://canyouintrome.freshdesk.com/" target="_blank" rel="noopener noreferrer" className="nav-link-simple" >
                <span className="sidebar-icon">
                  <HelpOutlineIcon />
                </span>
                  Support
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <OpenInNewTwoToneIcon />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </PerfectScrollbar>
    </>
  );
};

const mapStateToProps = (state) => ({
  sidebarUserbox: state.ThemeOptions.sidebarUserbox,

  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarMenu);
