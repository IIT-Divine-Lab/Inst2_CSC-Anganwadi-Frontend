import ActionTypes from "../constants/action-types";

export const loadingReducer = (state = true, { type, payload }) => {
   switch (type) {
      case ActionTypes.TOGGLE_LOADING:
         return payload;
      default:
         return state;
   }
}