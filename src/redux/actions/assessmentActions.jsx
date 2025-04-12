import ActionTypes from "../constants/action-types";

export const getQuestions = (questions) => {
   return {
      type: ActionTypes.GET_QUESTIONS_AGE_WISE,
      payload: questions
   }
}

export const resetAssessment = () => {
   return {
      type: ActionTypes.CLEAR_ALL
   }
}

export const currentQuestion = (counter) => {
   return {
      type: ActionTypes.CURRENT_QUESTION,
      payload: counter
   }
}

export const questionAnswered = (question) => {
   return {
      type: ActionTypes.QUESTIONS_ANSWERED,
      payload: question
   }
}

export const firstQuestionAnswered = (userId, questions) => {
   return {
      type: ActionTypes.FIRST_QUESTION_ANSWERED,
      payload: {
         userId,
         questions
      }
   }
}