import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
  loading: false,
  logged: null,
  notification: null
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    set: (state, action) => {
      state.value = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    addNotification: (state, action) => {
      state.notification = action.payload
    },
    dismissNotification: (state, action) => {
      state.notification = null
    },
    setLogged: (state, action) => {
      state.logged = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { set, setLoading, addNotification, dismissNotification, setLogged } = counterSlice.actions

export default counterSlice.reducer