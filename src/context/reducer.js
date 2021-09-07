let user = localStorage.getItem('currentUser')
  ? JSON.parse(localStorage.getItem('currentUser'))
  : '';
let trueUser = localStorage.getItem('trueUser')
  ? JSON.parse(localStorage.getItem('trueUser'))
  : '';
let credentials = localStorage.getItem('credentials')
  ? JSON.parse(localStorage.getItem('credentials'))
  : '';

export const initialState = {
  user: '' || user,
  trueUser: '' || trueUser,
  credentials: '' || credentials,
  loading: false,
  errorMessage: null,
};

export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return {
        ...initialState,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...initialState,
        user: action.payload.user,
        credentials: action.payload.credentials,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        user: '',
        credentials: '',
      };
    case 'LOGIN_ERROR':
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };
    case 'UPDATE_USER':
      return {
        ...initialState,
        user: '',
        loading: false,
      };
    case 'UPDATE_USER_SUCCESS':
      return {
        ...initialState,
        user: action.payload.user,
        loading: false,
      };
    case 'UPDATE_USER_ERROR':
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };
    case 'IMPERSONATE_SUCCESS':
      return {
        ...initialState,
        user: action.payload.currentUser,
        trueUser: action.payload.trueUser,
        loading: false
      };
    case 'IMPERSONATE_ERROR':
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };
    case 'STOP_IMPERSONATE_SUCCESS':
      return {
        ...initialState,
        user: action.payload.currentUser
      };
    case 'STOP_IMPERSONATE_ERROR':
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};