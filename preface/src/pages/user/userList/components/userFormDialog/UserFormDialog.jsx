import React, { useState, useCallback } from 'react'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material'

import DaumPostAddress from '../daumPost/DaumPostAddress'
import UserFormSelector from './UserFormSelector'
import { EMAIL_REGEX, PHONE_REGEX } from 'utils/userFormRegex'
import { deleteKeyValue } from 'utils/deleteKeyValue'
import { v4 as uuidv4 } from 'uuid'

import { useDispatch } from 'react-redux'
import { ADD_USER, GET_USER_LIST_PAGE, EDIT_USER } from 'redux/saga/actionType'
import { INITIAL_USER_DATA } from '../../UserList'

const timeDate = new Date()
const initailTimeFunc = () => {
  return timeDate.toISOString()
}

const INITIAL_BIRTH_DATE = {
  year: '',
  month: '',
  date: '',
}
const UserPostFormDialog = ({ selected, setSelected, setOpenDialog, openDialog, limit, page }) => {
  const [postDaumVisible, setPostDaumVisible] = useState(true)
  const [birthDate, setBirthDate] = useState(INITIAL_BIRTH_DATE)
  const dispatch = useDispatch()
  const isClose = useCallback(postBody => {
    if (
      PHONE_REGEX.test(postBody.phone_number) &
      EMAIL_REGEX.test(postBody.email) &
      (postBody.password.length >= 6) &
      (postBody.name.length > 0)
    ) {
      return true
    }
  }, [])
  const handleClose = () => {
    setOpenDialog(false)
    setBirthDate(INITIAL_BIRTH_DATE)
    setSelected(INITIAL_USER_DATA)
  }

  const handlePostDaumVisible = () => {
    setPostDaumVisible(!postDaumVisible)
  }
  const handleUserData = useCallback(
    ({ target }) => {
      const { name, value } = target
      setSelected(prev => ({ ...prev, [name]: value }))
    },
    [setSelected],
  )

  const handlePostUser = () => {
    const birth_date = new Date(birthDate.year, birthDate.month, birthDate.date)
    const newSelected = { ...selected }

    if (newSelected.uuid) {
      const putBody = {
        ...deleteKeyValue(newSelected),
        updated_at: initailTimeFunc(),
        last_login: initailTimeFunc(),
      }
      dispatch({ type: EDIT_USER, payload: putBody })
      dispatch({ type: GET_USER_LIST_PAGE, payload: { page, limit } })
      handleClose()
    } else {
      const postBody = {
        ...newSelected,
        birth_date: birthDate.year ? birth_date.toISOString() : initailTimeFunc(),
        uuid: uuidv4(),
        last_login: initailTimeFunc(),
        created_at: initailTimeFunc(),
        updated_at: initailTimeFunc(),
        age: timeDate.getUTCFullYear() - birth_date.getUTCFullYear() + 1,
      }
      dispatch({ type: ADD_USER, payload: postBody })
      dispatch({ type: GET_USER_LIST_PAGE, payload: { page, limit } })
      if (isClose(postBody)) {
        handleClose()
      }
    }
  }

  return (
    <Dialog open={openDialog} onClose={handleClose}>
      <DialogTitle>{selected.uuid ? '사용자 수정' : '사용자 등록'}</DialogTitle>
      {postDaumVisible ? (
        <>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              name="name"
              label="이름"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleUserData}
              value={selected.name}
              error={selected.name.length === 0}
            />
            <TextField
              required
              margin="dense"
              name="email"
              label="이메일"
              type="email"
              fullWidth
              variant="standard"
              placeholder="example@mail.com"
              onChange={handleUserData}
              value={selected.email}
              error={!EMAIL_REGEX.test(selected.email)}
            />
            {!selected.uuid && (
              <TextField
                required
                margin="dense"
                name="password"
                label="비밀번호"
                type="password"
                fullWidth
                variant="standard"
                onChange={handleUserData}
                value={selected.password || ''}
                error={selected.password.length < 6}
              />
            )}
            <TextField
              margin="dense"
              name="phone_number"
              label="전화번호"
              type="text"
              fullWidth
              variant="standard"
              placeholder="010-1234-5678"
              onChange={handleUserData}
              value={selected.phone_number}
              error={!PHONE_REGEX.test(selected.phone_number)}
            />
            <Stack direction="row" alignItems="center" spacing={2}>
              <TextField
                aria-readonly
                value={selected.address}
                margin="dense"
                name="address"
                label="주소"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleUserData}
              />
              <Button
                onClick={handlePostDaumVisible}
                sx={{ minWidth: 80 }}
                variant="contained"
                size="small"
              >
                주소검색
              </Button>
            </Stack>
            <TextField
              margin="dense"
              name="detail_address"
              label="상세주소"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleUserData}
              value={selected.detail_address}
            />
            {!selected.uuid && (
              <Stack>
                <UserFormSelector
                  selected={selected}
                  birthDate={birthDate}
                  setBirthDate={setBirthDate}
                  handleUserData={handleUserData}
                  setSelected={setSelected}
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>취소</Button>
            <Button onClick={handlePostUser}>{selected.uuid ? '수정' : '등록'}</Button>
          </DialogActions>
        </>
      ) : (
        <DaumPostAddress
          setSelected={setSelected}
          setPostDaumVisible={setPostDaumVisible}
          handlePostDaumVisible={handlePostDaumVisible}
        />
      )}
    </Dialog>
  )
}

export default UserPostFormDialog
