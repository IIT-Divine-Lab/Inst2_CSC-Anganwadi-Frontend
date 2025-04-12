import ActionTypes from "../constants/action-types"

const toggleLoading = (loadingState) => {
   return {
      type: ActionTypes.TOGGLE_LOADING,
      payload: loadingState
   }
}

export default toggleLoading