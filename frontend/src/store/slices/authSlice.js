import { createSlice } from '@reduxjs/toolkit';

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Check if token exists in localStorage
const token = localStorage.getItem('token');
let user = null;
let isAuthenticated = false;

if (token) {
  const decoded = decodeToken(token);
  // Check if token expired
  if (decoded && decoded.exp * 1000 > Date.now()) {
    user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      profileId: decoded.profileId,
      name: decoded.name
    };
    isAuthenticated = true;
  } else {
    localStorage.removeItem('token');
  }
}

const initialState = {
  user,
  token: isAuthenticated ? token : null,
  isAuthenticated,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.loading = false;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
