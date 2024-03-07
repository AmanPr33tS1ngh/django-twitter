import * as AuthType from "../AuthTypes/AuthTypes";

const initialState = {
  isAuthenticated: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AuthType.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
      };
    case AuthType.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default reducer;
