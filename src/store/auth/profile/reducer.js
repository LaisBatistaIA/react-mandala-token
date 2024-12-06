import { PROFILE_ERROR, PROFILE_SUCCESS, EDIT_PROFILE, RESET_PROFILE_FLAG, GET_PROFILE, GET_PROFILE_SUCCESS, GET_PROFILE_ERROR } from "./actionTypes";

const initialState = {
  user: null,
  error: "",
  success: "",
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_PROFILE:
      state = { ...state };
      break;
    case PROFILE_SUCCESS:
      state = { ...state, success: action.payload };
      break;
    case PROFILE_ERROR:
      state = { ...state, error: action.payload };
      break;
    case GET_PROFILE:
      state = { ...state };
      break;
    case GET_PROFILE_SUCCESS:
      state = { ...state, user: action.payload };
      break;
    case GET_PROFILE_ERROR:
      state = { ...state, error: action.payload };
      break;
    case CHANGE_PASSWORD:
      state = { ...state };
      break;
    case CHANGE_PASSWORD_SUCCESS:
      state = { ...state, success: action.payload };
      break;
    case CHANGE_PASSWORD_ERROR:
      state = { ...state, error: action.payload };
      break;
    case RESET_PROFILE_FLAG:
      state = { ...state, success: null };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default profile;
