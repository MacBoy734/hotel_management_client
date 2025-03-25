// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

// Async thunk for login
export const login = createAsyncThunk('users/login', async (credentials) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })

  if (!response.ok) {
    const { error } = await response.json()
    toast.error(error)
    throw new Error(error)
  }
  const data = await response.json()
  return data
})

// Async thunk for registration
export const register = createAsyncThunk('users/register', async (userData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  if (!response.ok) {
    const { error } = await response.json()
    toast.error(error)
    throw new Error(error)
  }
  const data = await response.json()
  return data
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.status = 'idle'
      state.isAuthenticated = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.isAuthenticated = true
        state.error = null
        state.user = action.payload // Save user data to state
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        state.isAuthenticated = false
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.isAuthenticated = true
        state.error = null
        state.user = action.payload // Save user data to state
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        state.isAuthenticated = false
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
