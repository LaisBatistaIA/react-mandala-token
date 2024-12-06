import { 
  PROFILE_ERROR, 
  PROFILE_SUCCESS, 
  EDIT_PROFILE, 
  RESET_PROFILE_FLAG, 
  GET_PROFILE, 
  GET_PROFILE_SUCCESS, 
  GET_PROFILE_ERROR,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR } from "./actionTypes"

export const editProfile = user => {
  return {
    type: EDIT_PROFILE,
    payload: { user },
  }
}

export const profileSuccess = msg => {
  return {
    type: PROFILE_SUCCESS,
    payload: msg,
  }
}

export const profileError = error => {
  return {
    type: PROFILE_ERROR,
    payload: error,
  }
}
export const getProfile = userId => {
  return {
    type: GET_PROFILE,
    payload: { userId },
  }
}

export const getProfileSuccess = user => {
  return {
    type: GET_PROFILE_SUCCESS,
    payload: user,
  }
}

export const getProfileError = error => {
  return {
    type: GET_PROFILE_ERROR,
    payload: error,
  }
}

export const changePassword = userPasswords => {
  return {
    type: CHANGE_PASSWORD,
    payload: { userPasswords },
  }
}

export const changePasswordSuccess = success => {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
    payload: success,
  }
}

export const changePasswordError = error => {
  return {
    type: CHANGE_PASSWORD_ERROR,
    payload: error,
  }
}

export const resetProfileFlag = error => {
  return {
    type: RESET_PROFILE_FLAG,
  }
}
