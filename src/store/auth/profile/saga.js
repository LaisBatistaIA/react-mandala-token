import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { EDIT_PROFILE, GET_PROFILE, CHANGE_PASSWORD } from "./actionTypes"
import { profileSuccess, profileError, getProfileError, getProfileSuccess, changePasswordSuccess, changePasswordError } from "./actions"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  postFakeProfile,
  postJwtProfile,
} from "../../../helpers/fakebackend_helper"

const fireBaseBackend = getFirebaseBackend()

function* getProfile({ payload: {userId} }) {
  try {
    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      // Chama o método Firebase para buscar o perfil
      const response = yield call(fireBaseBackend.getUserData, userId)
      yield put(getProfileSuccess(response))
    }
    else{
      throw Error("No using firebase");
    }
  } catch (error) {
    yield put(getProfileError(error))
  }
}

function* changePassword ({ payload: {userPasswords} }) {
  try {
    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.changePassword, userPasswords)
      yield put(changePasswordSuccess(response))
    }
    else{
      throw Error("No using firebase");
    }
  } catch (error) {
    yield put(changePasswordError(error))
  }
}

function* editProfile({ payload: { user } }) {
  try {
    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(
        fireBaseBackend.editProfileAPI,
        user
      )
      yield put(profileSuccess(response))
    } else if (import.meta.env.VITE_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtProfile, "/post-jwt-profile", {
        username: user.username,
        idx: user.idx,
      })
      yield put(profileSuccess(response))
    } else if (import.meta.env.VITE_APP_DEFAULTAUTH === "fake") {
      const response = yield call(postFakeProfile, {
        username: user.username,
        idx: user.idx,
      })
      yield put(profileSuccess(response))
    }
  } catch (error) {
    yield put(profileError(error))
  }
}
export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile)
}

export function* watchGetProfile() {
  yield takeEvery(GET_PROFILE, getProfile)
}

export function* watchChangePassword() {
  yield takeEvery(CHANGE_PASSWORD, changePassword)
}

function* ProfileSaga() {
  yield all([fork(watchProfile), fork(watchGetProfile), fork(watchChangePassword) ])
}

export default ProfileSaga
