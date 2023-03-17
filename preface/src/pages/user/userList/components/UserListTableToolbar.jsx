import React, { useState } from 'react'

import { Toolbar, Typography, Tooltip, IconButton, Stack, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import { alpha } from '@mui/material/styles'

import FilterSelect from './FilterSelect'
import UserFormDialog from './userFormDialog/UserFormDialog'

import { DELETE_USER, GET_USER_LIST_PAGE } from 'redux/saga/actionType'
import { useDispatch } from 'react-redux'
import { INITIAL_USER_DATA } from '../UserList'
import { maskingName } from 'utils/maskingName'

const UserListTableToolbar = ({ selected, setSelected, page, limit }) => {
  const dispatch = useDispatch()
  const [openDialog, setOpenDialog] = useState(false)
  const handleUserDelete = () => {
    const confirmMessage = window.confirm('정말 삭제 하시겠습니까?')
    if (confirmMessage) {
      dispatch({ type: DELETE_USER, payload: selected.id })
      dispatch({ type: GET_USER_LIST_PAGE, payload: { page, limit } })
      setSelected(INITIAL_USER_DATA)
    }
  }
  const handleClickOpenModal = () => {
    setOpenDialog(true)
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selected.uuid && {
          bgcolor: theme =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {selected.uuid ? (
        <Typography sx={{ flex: '1 1 100%' }} variant="subtitle1" component="div">
          {maskingName(selected.name)}
        </Typography>
      ) : (
        <Stack
          sx={{ flex: '1 1 50%', alignItems: 'center', flexDirection: 'row' }}
          direction="row"
          spacing={2}
        >
          <Typography variant="h6" id="tableTitle" component="div">
            유저 목록
          </Typography>
          <FilterSelect />
        </Stack>
      )}

      {selected.uuid ? (
        <>
          <Tooltip title="Edit">
            <IconButton onClick={handleClickOpenModal}>
              <ModeEditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={handleUserDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Button variant="contained" disableElevation onClick={handleClickOpenModal}>
          사용자 등록
        </Button>
      )}
      <UserFormDialog
        selected={selected}
        setSelected={setSelected}
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        limit={limit}
        page={page}
      />
    </Toolbar>
  )
}

export default UserListTableToolbar
