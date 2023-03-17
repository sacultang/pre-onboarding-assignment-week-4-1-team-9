import { createSlice } from '@reduxjs/toolkit'
import { findEqualUserId, findEqualUuid } from 'utils/findEqualData'

const initialState = {
  userList: [],
  userSettings: [],
  userAccounts: [],
  totalResults: 0,
  errorMsg: '',
}

const userListSlice = createSlice({
  name: 'userlist',
  initialState,
  reducers: {
    getUserListAction: (state, { payload }) => {
      state.userList = payload
        .filter(user => {
          return user.uuid
        })
        .map(user => ({
          ...user,
          ...findEqualUuid(user.uuid, state.userSettings),
          ...findEqualUserId(user.id, state.userAccounts),
        }))
    },
    getUserSettingAction: (state, { payload }) => {
      state.userSettings = payload
    },
    getUserAccountsAction: (state, { payload }) => {
      state.userAccounts = payload
    },
    getTotalResultsAction: (state, { payload }) => {
      state.totalResults = payload.filter(user => user.uuid).length
    },
    getErrorMessageAction: (state, { payload }) => {
      state.errorMsg = payload
    },
  },
})

export const {
  getUserListAction,
  getTotalResultsAction,
  getErrorMessageAction,
  getUserSettingAction,
  getUserAccountsAction,
} = userListSlice.actions
export default userListSlice.reducer
