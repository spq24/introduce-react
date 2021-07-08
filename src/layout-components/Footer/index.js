import React from 'react';

import clsx from 'clsx';

import { List, ListItem } from '@material-ui/core';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Footer = (props) => {
  const { footerShadow, footerBgTransparent } = props;
  const date = new Date();
  const year = date.getFullYear();

  return (
    <>
      <div
        className={clsx('app-footer text-black-50', {
          'app-footer--shadow': footerShadow,
          'app-footer--opacity-bg': footerBgTransparent
        })}>
        <div className="app-footer--first">
          {/* <List
            component="div"
            className="nav-neutral-primary d-flex align-items-center">
            <ListItem
              className="rounded-sm"
              button
              component={NavLink}
              to="/DashboardAnalytics">
              <span>Analytics</span>
            </ListItem>
            <ListItem
              className="rounded-sm"
              button
              component={NavLink}
              to="/DashboardStatistics">
              <span>Statistics</span>
            </ListItem>
            <ListItem
              className="rounded-sm"
              button
              component={NavLink}
              to="/Overview">
              <span>Overview</span>
            </ListItem>
          </List> */}
        </div>
        <div className="app-footer--second">
          <span>Can You Intro Me?</span> ©
          {year} - crafted with <span className="text-danger px-1">❤</span> by{' '}
          Steve Quatrani
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  footerShadow: state.ThemeOptions.footerShadow,
  footerBgTransparent: state.ThemeOptions.footerBgTransparent
});

export default connect(mapStateToProps)(Footer);
