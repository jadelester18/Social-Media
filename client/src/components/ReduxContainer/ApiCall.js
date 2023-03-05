import axios from "axios";
import { loginStart, loginSuccess, loginFailure, logout } from "./UserReducer";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`http://localhost:5000/api/user/login`, user);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailure());
  }
};

export const VerifyEmail = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(
      "http://localhost:5000/api/user/verify/email",
      user
    );
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailure());
  }
};

// export const signup = async (dispatch, user) => {
//   dispatch(loginStart());
//   try {
//     const res = await axios.post(
//       "http://localhost:5000/api/user/register/user",
//       user
//     );
//     dispatch(loginSuccess(res.data));
//   } catch (error) {
//     const errorMessage = error.response.data.message;
//     dispatch(loginFailure(errorMessage));
//   }
// };
