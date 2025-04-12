import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { answeredQuesReducer, assessmentReducer, currQuesReducer } from "./assessmentReducer";
import { loadingReducer } from "./loadingReducer";
import { orientationReducer } from "./orientationReducer";
// import familyTreeReducer from "./familytree";

const AllReducer = combineReducers({
   user: userReducer,
   allQuestions: assessmentReducer,
   currentQuestion: currQuesReducer,
   questionAnswered: answeredQuesReducer,
   loading: loadingReducer,
   orientation: orientationReducer
})

export default AllReducer