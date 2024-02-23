// here we are going to define the actions which are going to take place in our application

const loginSuccess = (user) => {
  return {
    type: "LOGIN_SUCCESS",
    payload: user,
  };
};

const loginFailure = () => {
  return {
    type: "LOGIN_FAILURE",
  };
};

export { loginFailure, loginSuccess };
