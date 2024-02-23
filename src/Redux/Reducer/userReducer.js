// defining the initial state of the user

const initialState = {
  user: {}, // initial state is the object having user property which is an empty object
};

// defining the Reducer function
const userReducer = (state = initialState, action) => {
  if (action.type === "LOGIN_SUCCESS") {
    return {
      ...state,
      user: action.payload, // updating the user property with the state being passed in the "payload"
    };
  }
  if (action.type === "LOGIN_FAILURE") {
    return {
      ...initialState, // in case of unsuccessful login we are simply returning the initial state
    };
  }
  return state; // simply returning the unchanged current state
};

export default userReducer;
