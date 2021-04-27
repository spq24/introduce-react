let user = localStorage.getItem('currentUser')
  ? JSON.parse(localStorage.getItem('currentUser'))
  : '';
let credentials = localStorage.getItem('credentials')
  ? JSON.parse(localStorage.getItem('credentials'))
  : '';

export const initialState = {
  user: '' || user,
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

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};