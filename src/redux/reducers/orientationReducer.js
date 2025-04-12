import ActionTypes from "../constants/action-types";

export const orientationReducer = (state = window.innerHeight > window.innerWidth ? "portrait" : "landscape", { type, payload }) => {
   switch (type) {
      case ActionTypes.ORIENTATION:
         return payload;
      default:
         return state;
   }
}