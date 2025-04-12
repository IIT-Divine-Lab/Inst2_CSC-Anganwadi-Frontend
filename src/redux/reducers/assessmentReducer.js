import ActionTypes from "../constants/action-types";

export const assessmentReducer = (state = [], { type, payload }) => {
   switch (type) {
      case ActionTypes.GET_QUESTIONS_AGE_WISE:
         if (payload === undefined) return [];
         return payload;
      case ActionTypes.CLEAR_ALL:
         return [];
      default:
         return state;
   }
}

export const currQuesReducer = (state = { counter: 0 }, { type, payload }) => {
   switch (type) {
      case ActionTypes.CURRENT_QUESTION:
         return { counter: payload };
      case ActionTypes.CLEAR_ALL:
         return { counter: 0 };
      default:
         return state;
   }
}

export const answeredQuesReducer = (state = { userId: "", questions: [] }, { type, payload }) => {
   // console.log(payload);
   switch (type) {
      case ActionTypes.FIRST_QUESTION_ANSWERED:
         return { userId: payload.userId, questions: [payload.questions] }
      case ActionTypes.QUESTIONS_ANSWERED:
         return { ...state, questions: [...state.questions, payload] }
      case ActionTypes.CLEAR_ALL:
         return { userId: "", questions: [] };
      default:
         return state;
   }
}