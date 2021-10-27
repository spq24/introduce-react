import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ClimbingBoxLoader } from 'react-spinners';
import { AuthProvider } from "context";
import { ThemeProvider } from '@material-ui/styles';
import MuiTheme from './theme';
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';
// Layout Blueprints

import {
  LeftSidebar,
  MinimalLayout,
} from './layout-blueprints';

// Authenticated Pages
import Dashboard from './pages/Dashboard';
import NewUser from './pages/Dashboard/NewUser';
import Introductions from './pages/Introductions';
import NewIntroduction from './pages/Introductions/NewIntroduction';
import Introduction from './pages/Introductions/Introduction';
import IntroductionRequests from './pages/IntroductionRequests';
import IntroductionRequest from './pages/IntroductionRequests/IntroductionRequest';
import IntroductionProposals from './pages/IntroductionProposals';
import NewIntroductionProposal from './pages/IntroductionProposals/NewIntroductionProposal';
import IntroductionProposal from './pages/IntroductionProposals/IntroductionProposal';
import RequestForIntroductions from './pages/RequestForIntroductions';
import RequestForIntroduction from './pages/RequestForIntroductions/RequestForIntroduction';
import NewRequestForIntroduction from './pages/RequestForIntroductions/NewRequestForIntroduction';


import UserProfile from './pages/Users/UserProfile';
import Users from './pages/Users/Users';

//Public Pages
import PublicNewIntroductionRequest from './pages/IntroductionRequests/PublicNewIntroductionRequest';
import IntroducerPublicIntroduction from './pages/IntroductionRequests/IntroducerPublicIntroduction';
import IntroduceePublicIntroduction from './pages/IntroductionRequests/IntroduceePublicIntroduction';
import IntroduceeOneIntroductionProposal from './pages/IntroductionProposals/IntroduceeOneIntroductionProposal';
import IntroduceeTwoIntroductionProposal from './pages/IntroductionProposals/IntroduceeTwoIntroductionProposal';
import PublicRequestForIntroduction from './pages/RequestForIntroductions/PublicRequestForIntroduction';
import PublicNewIntroFromRequestForIntro from './pages/Introductions/PublicNewIntroFromRequestForIntro';

const Login = lazy(() => import('./pages/Login'));
const CreateAccount = lazy(() =>import('./pages/CreateAccount'));
const PageError404 = lazy(() => import('./pages/PageError404'));
const PageError500 = lazy(() => import('./pages/PageError500'));
const PageError505 = lazy(() => import('./pages/PageError505'));

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
                  Loading...
                  <span className="font-size-lg d-block text-dark">
                    Be with you in just a moment!
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
                  '/r/:unique_id',
                  '/requested-introduction/:id',
                  '/introduction-requests/:id/introducee',
                  '/introduction-proposals/:id/introducee-one',
                  '/introduction-proposals/:id/introducee-two',
                  '/request-for-intro/:id',
                  '/request-for-intro/:id/new-introduction',
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
                      <Route path="/login" component={Login} />
                      <Route exact path="/linkedin" component={LinkedInPopUp} />
                      <Route
                        path="/sign-up"
                        component={CreateAccount}
                      />
                      <Route
                        exact path="/r/:unique_id"
                        component={PublicNewIntroductionRequest}
                      />
                      <Route
                        exact path="/introduction-proposals/:id/introducee-one"
                        component={IntroduceeOneIntroductionProposal}
                      />
                      <Route
                        exact path="/introduction-proposals/:id/introducee-two"
                        component={IntroduceeTwoIntroductionProposal}
                      />
                      <Route
                        exact path="/requested-introduction/:id"
                        component={IntroducerPublicIntroduction}
                      />
                      <Route
                        exact path="/introduction-requests/:id/introducee"
                        component={IntroduceePublicIntroduction}
                      />
                      <Route
                        exact path='/request-for-intro/:id'
                        component={PublicRequestForIntroduction}
                      />
                      <Route
                        exact path='/request-for-intro/:id/new-introduction'
                        component={PublicNewIntroFromRequestForIntro}
                      />
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
                  '/users',
                  '/request-for-introductions',
                  '/request-for-introductions/:id',
                  '/new-request-for-introduction'
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
                        component={Dashboard}
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
                        exact path="/request-for-introductions"
                        component={RequestForIntroductions}
                      />
                      <Route
                        exact path="/request-for-introductions/:id"
                        component={RequestForIntroduction}
                      />
                      <Route
                        exact path="/new-request-for-introduction"
                        component={NewRequestForIntroduction}
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
              <Route path="*" component={PageError404} />
            </Switch>
          </Suspense>
        </AnimatePresence>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Routes;
