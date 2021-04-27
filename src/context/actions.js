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

export async function logout(dispatch) {
  dispatch({ type: 'LOGOUT' });
  let credentials = localStorage.getItem('credentials')
  localStorage.removeItem('currentUser');
  localStorage.removeItem('credentials');
  return axios.delete(`/auth/sign_out`, {}, { headers: credentials })
              .then(response => {
                console.log('removing...')
                return true
              })
              .catch(error => {
                return false
              })

}