import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { impersonate, stopImpersonate, useAuthState, useAuthDispatch } from 'context';
import { Sidebar, Header, Footer } from '../../layout-components';
import { Button, Snackbar, SnackbarContent } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const LeftSidebar = (props) => {
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  const trueUser = userDetails.trueUser
  const currentUser = userDetails.user
  const history = useHistory();

  const {
    children,
    sidebarToggle,
    sidebarToggleMobile,
    sidebarFixed,
    headerFixed,
    headerSearchHover,
    headerDrawerToggle,
    footerFixed,
    contentBackground
  } = props;

  const handleStopImpersonate = (e) => {
    e.preventDefault()
    stopImpersonate(dispatch)
  }

  const action = (
    <Button
      onClick={ (e) => handleStopImpersonate(e) }
      color="secondary"
      variant="outlined"
      size="small"
      style={{ color: '#fff', borderColor: '#fff' }}>
      Stop Impersonating
    </Button>
  );

  return (
    <>
      <div
        className={clsx('app-wrapper', contentBackground, {
          'header-drawer-open': headerDrawerToggle,
          'app-sidebar-collapsed': sidebarToggle,
          'app-sidebar-mobile-open': sidebarToggleMobile,
          'app-sidebar-fixed': sidebarFixed,
          'app-header-fixed': headerFixed,
          'app-footer-fixed': footerFixed,
          'search-wrapper-open': headerSearchHover
        })}>
        <div>
          <Sidebar />
        </div>
        <div className="app-main">
          <Header />
          <div className="app-content">
            <div className="app-content--inner">
              <div className="app-content--inner__wrapper">
                {
                  trueUser && Object.keys(trueUser).length > 0 ?
                    <Snackbar open={true}>
                      <SnackbarContent
                        message={`Logged in as ${currentUser.first_name} ${currentUser.last_name}`}
                        action={action}
                        style={{ width: '525px', height: '55px', backgroundColor: '#ff9800' }}>
                      </SnackbarContent>
                    </Snackbar> : null
                }
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

LeftSidebar.propTypes = {
  children: PropTypes.node
};

const mapStateToProps = (state) => ({
  sidebarToggle: state.ThemeOptions.sidebarToggle,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile,
  sidebarFixed: state.ThemeOptions.sidebarFixed,
  headerFixed: state.ThemeOptions.headerFixed,
  headerSearchHover: state.ThemeOptions.headerSearchHover,
  headerDrawerToggle: state.ThemeOptions.headerDrawerToggle,

  footerFixed: state.ThemeOptions.footerFixed,

  contentBackground: state.ThemeOptions.contentBackground
});

export default connect(mapStateToProps)(LeftSidebar);
