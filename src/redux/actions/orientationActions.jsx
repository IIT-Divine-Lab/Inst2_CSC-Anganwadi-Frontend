import ActionTypes from "../constants/action-types"

const toggleOrientation = () => {
   return {
      type: ActionTypes.ORIENTATION,
      payload: window.innerHeight > window.innerWidth ? "portrait" : "landscape"
   }
}

export default toggleOrientation