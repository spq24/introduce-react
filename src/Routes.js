import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ClimbingBoxLoader } from 'react-spinners';
import { AuthProvider } from "context";
import { ThemeProvider } from '@material-ui/styles';
import MuiTheme from './theme';
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';
// Layout Blueprints

import {
  LeftSidebar,
  CollapsedSidebar,
  MinimalLayout,
  PresentationLayout
} from './layout-blueprints';

// Example Pages

import DashboardMonitoring from './example-pages/DashboardMonitoring';
import DashboardCommerce from './example-pages/DashboardCommerce';
import DashboardAnalytics from './example-pages/DashboardAnalytics';
import NewUser from './example-pages/DashboardAnalytics/NewUser';
import Introductions from './example-pages/Introductions';
import Introduction from './example-pages/Introductions/Introduction';
import NewIntroduction from './example-pages/Introductions/NewIntroduction';
import IntroductionRequests from './example-pages/IntroductionRequests';
import IntroductionProposals from './example-pages/IntroductionProposals';
import NewIntroductionProposal from './example-pages/IntroductionProposals/NewIntroductionProposal';
import IntroductionProposal from './example-pages/IntroductionProposals/IntroductionProposal';
import IntroductionRequest from './example-pages/IntroductionRequests/IntroductionRequest';
import PublicIntroductionRequest from './example-pages/IntroductionRequests/PublicIntroductionRequest';
import IntroducerPublicIntroduction from './example-pages/IntroductionRequests/IntroducerPublicIntroduction';
import IntroduceePublicIntroduction from './example-pages/IntroductionRequests/IntroduceePublicIntroduction';
import IntroduceeOneIntroductionProposal from './example-pages/IntroductionProposals/IntroduceeOneIntroductionProposal';
import IntroduceeTwoIntroductionProposal from './example-pages/IntroductionProposals/IntroduceeTwoIntroductionProposal';
import UserProfile from './example-pages/Users/UserProfile';
import Users from './example-pages/Users/Users';

const PageLoginCover = lazy(() => import('./example-pages/PageLoginCover'));
const PageRegisterOverlay = lazy(() =>import('./example-pages/PageRegisterOverlay'));
const PageInvoice = lazy(() => import('./example-pages/PageInvoice'));
const PageError404 = lazy(() => import('./example-pages/PageError404'));
const PageError500 = lazy(() => import('./example-pages/PageError500'));
const PageError505 = lazy(() => import('./example-pages/PageError505'));

function usePageViews() {
  const location = useLocation();
  React.useEffect(() => {
    window.analytics.page(location.pathname);
  }, [location]);
}

const Routes = () => {
  const location = useLocation();
  usePageViews()


  const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'linear',
    duration: 0.3
  };

  const SuspenseLoading = () => {
    const [show, setShow] = useState(false);
    useEffect(() => {
      let timeout = setTimeout(() => setShow(true), 300);
      return () => {
        clearTimeout(timeout);
      };
    }, []);

    return (
      <>
        <AnimatePresence>
          {show && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}>
              <div className="d-flex align-items-center flex-column vh-100 justify-content-center text-center py-3">
                <div className="d-flex align-items-center flex-column px-4">
                  <ClimbingBoxLoader color={'#3c44b1'} loading={true} />
                </div>
                <div className="text-muted font-size-xl text-center pt-3">
                  Please wait while we load the live preview examples
                  <span className="font-size-lg d-block text-dark">
                    This live preview instance can be slower than a real
                    production build!
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <ThemeProvider theme={MuiTheme}>
      <AuthProvider>
        <AnimatePresence>
          <Suspense fallback={<SuspenseLoading />}>
            <Switch>
              <Route exact path='/' component={() => { window.location = 'https://canyouintrome.com'; return null; }} />
              <Route
                path={[
                  '/login',
                  '/linkedin',
                  '/sign-up',
                  '/forgot-password',
                  '/r/:id',
                  '/requested-introduction/:id',
                  '/introducee-requested-introduction/:id',
                  '/introduction-proposal/:id/introduceeone/:introducee_id',
                  '/introduction-proposal/:id/introduceetwo/:introducee_id',
                  '/reset-password',
                  '/PageError404',
                  '/PageError500',
                  '/PageError505'
                ]}>
                <MinimalLayout>
                  <Switch location={location} key={location.pathname}>
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}>
                      <Route path="/login" component={PageLoginCover} />
                      <Route exact path="/linkedin" component={LinkedInPopUp} />
                      <Route
                        path="/sign-up"
                        component={PageRegisterOverlay}
                      />
                      <Route
                        exact path="/r/:id"
                        component={PublicIntroductionRequest}
                      />
                      <Route
                        exact path="/introduction-proposal/:id/introduceeone/:introducee_id"
                        component={IntroduceeOneIntroductionProposal}
                      />
                      <Route
                        exact path="/introduction-proposal/:id/introduceetwo/:introducee_id"
                        component={IntroduceeTwoIntroductionProposal}
                      />
                      <Route
                        exact path="/requested-introduction/:id"
                        component={IntroducerPublicIntroduction}
                      />
                      <Route
                        exact path="/introducee-requested-introduction/:id"
                        component={IntroduceePublicIntroduction}
                      />
                      <Route path="/page-missing-error" component={PageError404} />
                      <Route path="/server-error-500" component={PageError500} />
                      <Route path="/server-error-505" component={PageError505} />
                    </motion.div>
                  </Switch>
                </MinimalLayout>
              </Route>

              <Route
                path={[
                  '/new-user',
                  '/dashboard',
                  '/new-introduction',
                  '/introductions',
                  '/introductions/:id',
                  '/introduction-requests',
                  '/introduction-requests/:id',
                  '/introduction-proposals',
                  '/new-introduction-proposal',
                  '/introduction-proposals/:id',
                  '/users/:id',
                  '/users'
                ]}>
                <LeftSidebar>
                  <Switch location={location} key={location.pathname}>
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}>
                      <Route
                        path="/new-user"
                        component={NewUser}
                      />
                      <Route
                        path="/dashboard"
                        component={DashboardAnalytics}
                      />
                      <Route
                        exact path="/new-introduction"
                        component={NewIntroduction}
                      />
                      <Route
                        exact path="/introductions"
                        component={Introductions}
                      />
                      <Route
                        exact path="/introductions/:id"
                        component={Introduction}
                      />
                      <Route
                        exact path="/introduction-requests"
                        component={IntroductionRequests}
                      />
                      <Route
                        exact path="/introduction-requests/:id"
                        component={IntroductionRequest}
                      />
                      <Route
                        exact path="/new-introduction-proposal"
                        component={NewIntroductionProposal}
                      />
                      <Route
                        exact path="/introduction-proposals/:id"
                        component={IntroductionProposal}
                      />
                      <Route
                        exact path="/introduction-proposals"
                        component={IntroductionProposals}
                      />
                      <Route
                        exact path="/users/:id"
                        component={UserProfile}
                      />
                      <Route
                        exact path="/users"
                        component={Users}
                      />
                    </motion.div>
                  </Switch>
                </LeftSidebar>
              </Route>
            </Switch>
          </Suspense>
        </AnimatePresence>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Routes;
