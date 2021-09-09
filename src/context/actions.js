import axios from 'axios';

export async function auth(dispatch, email, password) {
  dispatch({ type: 'REQUEST_LOGIN' });

  return axios.post(`/auth/sign_in`, {
    email: email,
    password: password
  }, {
    'Content-Type': 'application/json'
  })
  .then(response => {
    let credentials = {
      'access-token': response.headers['access-token'],
      'client': response.headers.client,
      'uid': response.headers.uid
    }
    let user = response.data.data

    if (user && credentials) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: user, credentials: credentials } });
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('credentials', JSON.stringify(credentials));
      return { currentUser: user, credentials: credentials };
    } else {
      dispatch({ type: 'LOGIN_ERROR', error: 'error signing you in' })
      return
    }
  })
  .catch(error => {
    dispatch({ type: 'LOGIN_ERROR', error: error.response })
    return
  });
}

export async function authGoogle(dispatch, code) {
  try {
    dispatch({ type: 'REQUEST_LOGIN' });
    if (!code || code === undefined) {
      dispatch({ type: 'LOGIN_ERROR', error: 'No profile' });
      return;
    }

    return axios.post(`/api/v1/social-auth/from-google`, {
      google_response: {
        code: code
      }
    })
    .then(response => {
      let credentials = response.data.token_data;
      let user = response.data.user

      if (user && credentials) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: user, credentials: credentials } });
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('credentials', JSON.stringify(credentials));
        return { currentUser: user, credentials: credentials };
      }
    })
    .catch(error => {
      dispatch({ type: 'LOGIN_ERROR', error: error.response })
      return
    });
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', error: error });
  }
}

export async function authLinkedIn(dispatch, code) {
  try {
    dispatch({ type: 'REQUEST_LOGIN' });
    if (!code || code === undefined) {
      dispatch({ type: 'LOGIN_ERROR', error: 'No profile' });
      return;
    }

    return axios.post(`/api/v1/social-auth/from-linkedin`, {
      linkedin_response: {
        code: code
      }
    })
    .then(response => {
      let credentials = response.data.token_data;
      let user = response.data.user

      if (user && credentials) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: user, credentials: credentials } });
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('credentials', JSON.stringify(credentials));
        return { currentUser: user, credentials: credentials };
      }
    })
    .catch(error => {
      dispatch({ type: 'LOGIN_ERROR', error: error.response })
      return
    });
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', error: error });
  }
}

export async function authMicrosoft(dispatch, code) {
  try {
    dispatch({ type: 'REQUEST_LOGIN' });
    if (!code || code === undefined) {
      dispatch({ type: 'LOGIN_ERROR', error: 'No profile' });
      return;
    }

    return axios.post(`/api/v1/social-auth/from-microsoft`, {
      microsoft_response: {
        code: code
      }
    })
    .then(response => {
      let credentials = response.data.token_data;
      let user = response.data.user

      if (user && credentials) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: user, credentials: credentials } });
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('credentials', JSON.stringify(credentials));
        return { currentUser: user, credentials: credentials };
      }
    })
    .catch(error => {
      dispatch({ type: 'LOGIN_ERROR', error: error.response })
      return
    });
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', error: error });
  }
}

export async function logout(dispatch) {
  dispatch({ type: 'LOGOUT' });
  let credentials = localStorage.getItem('credentials')
  localStorage.removeItem('currentUser');
  localStorage.removeItem('credentials');
  return axios.delete(`/auth/sign_out`, {}, { headers: credentials })
              .then(response => {
                return true
              })
              .catch(error => {
                return false
              })

}

export async function updateUser(dispatch, user) {
  dispatch({ type: 'UPDATE_USER' });

  if (user) {
    dispatch({ type: 'UPDATE_USER_SUCCESS', payload: { user: user } });
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { user: user };
  } else {
    dispatch({ type: 'UPDATE_USER_ERROR', error: 'error updating user' })
    return
  }
}

export async function impersonate(dispatch, originalCurrentUser, impersonateUserId, originalCurrentUserCredentials) {
  try {
    dispatch({ type: 'IMPERSONATE_START' });

    return axios.get(`/api/v1/users/${impersonateUserId}/impersonate`, { headers: originalCurrentUserCredentials })
                .then(response => {
                  let user = response.data.user
                  let credentials = response.data.token_data
                  let payload = {
                    currentUser: user,
                    credentials: credentials,
                    trueUser: originalCurrentUser,
                    trueUserCredentials: originalCurrentUserCredentials
                  }

                  console.log('currentUser', user)
                  console.log('trueUser', originalCurrentUser)

                  dispatch({ type: 'IMPERSONATE_SUCCESS', payload: payload });
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  localStorage.setItem('credentials', JSON.stringify(credentials));
                  localStorage.setItem('trueUser', JSON.stringify(originalCurrentUser));
                  localStorage.setItem('trueUserCredentials', JSON.stringify(originalCurrentUserCredentials));
                  return payload;
                })
                .catch(error => {
                  dispatch({ type: 'IMPERSONATE_ERROR', error: error.response })
                  return
                });
  } catch (error) {
    dispatch({ type: 'IMPERSONATE_ERROR', error: error });
  }
}

export async function stopImpersonate(dispatch) {
  try {
    dispatch({ type: 'STOP_IMPERSONATE_START' });
    let parsedUser = JSON.parse(localStorage.getItem('trueUser'))
    let parsedCredentials = JSON.parse(localStorage.getItem('trueUserCredentials'))
    localStorage.setItem('currentUser', localStorage.getItem('trueUser'));
    localStorage.setItem('credentials', localStorage.getItem('trueUserCredentials'));
    localStorage.removeItem('trueUser');
    localStorage.removeItem('trueUserCredentials');

    let payload = {
      currentUser: parsedUser,
      credentials: parsedCredentials,
      trueUser: {},
      trueUserCredentials: {}
    }
    dispatch({ type: 'STOP_IMPERSONATE_SUCCESS', payload: payload });
    return payload

  } catch (error) {
    dispatch({ type: 'STOP_IMPERSONATE_ERROR', error: error });
  }
}