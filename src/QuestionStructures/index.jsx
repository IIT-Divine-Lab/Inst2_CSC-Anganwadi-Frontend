import React, { useCallback, useEffect, useRef, useState } from 'react'
import './style.css'
import { useDispatch, useSelector } from 'react-redux';
import apiUrl from '../apiUrl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { currentQuestion, firstQuestionAnswered, getQuestions, questionAnswered, resetAssessment } from '../redux/actions/assessmentActions';
import { resetUser } from '../redux/actions/userActions';
import { toast } from 'react-toastify';
import ParentContainer from '../Common/ParentContainer';
import Button from '../Common/Button';
import Structure1to4 from './Structure1-4';
import Structure5 from './Structure5';
import Structure6 from './Structure6';
import Tongue from "../Images/tongue.png"
import Agarbatti from "../Images/Agarbatti.png"
import Food from "../Images/Food.png"
import IceBowl from "../Images/IceBowl.png"
import RedBall from "../Images/RedBall.png"
import Speaker from "../Images/Speaker.png"
import Ear from "../Images/ear.png"
import Eyes from "../Images/eyes.png"
import Hand from "../Images/hand.png"
import Nose from "../Images/nose.png"
import Candle from "../Images/candle.png"
import Icecream from "../Images/icecream.png"
import Perfume from "../Images/perfume.png"
import Teddy from "../Images/teddyBear.png"
import DemoSpeaker from "../Images/demoSpeaker.png"
import Structure7 from './Structure7';
import Structure8 from './Structure8';

const QuestionStructures = () => {
   const [selected, setSelected] = useState([]);
   // State to control visibility of layers (e.g., grid lines or others you may want to exclude)
   const [showGrid, setShowGrid] = useState(true);
   const stageRef = useRef(null);
   const navigate = useNavigate()
   const user = useSelector(state => state.user);
   const allQuestions = useSelector(state => state.allQuestions);
   const counter = useSelector(state => state.currentQuestion.counter);
   const questionDet = useSelector(state => state.allQuestions)[counter];
   const question = questionDet !== undefined ? questionDet.question : "";

   const questionAnswer = useSelector(state => state.questionAnswered);
   const dispatch = useDispatch();

   const leftColumn = {
      Demo: [
         {
            val: "त्वचा",
            src: Hand
         },
         {
            val: "आंख",
            src: Eyes
         },
         {
            val: "कान",
            src: Ear
         },
         {
            val: "नाक",
            src: Nose
         },
         {
            val: "जीभ",
            src: Tongue
         }
      ],
      Ques: [
         {
            val: "जीभ",
            src: Tongue
         },
         {
            val: "आंख",
            src: Eyes
         },
         {
            val: "कान",
            src: Ear
         },
         {
            val: "त्वचा",
            src: Hand
         },
         {
            val: "नाक",
            src: Nose
         }
      ]
   }
   const rightColumn = {
      Demo: [
         {
            val: "Candle",
            src: Candle
         },
         {
            val: "IceCream",
            src: Icecream
         },
         {
            val: "Perfume",
            src: Perfume
         },
         {
            val: "Teddy",
            src: Teddy
         },
         {
            val: "Speaker",
            src: DemoSpeaker
         }
      ],
      Ques: [
         {
            val: "Ball",
            src: RedBall
         },
         {
            val: "Jalebi",
            src: Food
         },
         {
            val: "Agarbatti",
            src: Agarbatti
         },
         {
            val: "Ice",
            src: IceBowl
         },
         {
            val: "Speaker",
            src: Speaker
         }
      ]
   }

   const fullScreenMode = () => {
      const element = document.documentElement;
      if (element.requestFullscreen) {
         element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { // For Firefox
         element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { // For Safari
         element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { // For IE/Edge
         element.msRequestFullscreen();
      }
   }

   const fetchQuestions = useCallback(async () => {
      await axios.post(apiUrl + "assessment/agewise", { ageGroup: user.age })
         .then(({ data }) => {
            console.log(data);
            dispatch(getQuestions(data.questions));
            dispatch(currentQuestion(0));
         })
         .catch(({ message }) => {
            toast(message, {
               type: "error",
               autoClose: 3000,
               theme: "colored",
               hideProgressBar: true
            })
         })
   }, [dispatch, user]);

   const saveQuestion = async () => {

      let answer;
      if (activeOption === undefined && question.questionType === "single") return;
      if (selected.length === 0 && question.questionType === "multi") return;
      if (question.structure !== 8) {
         if (question.questionType === "single")
            answer = {
               quesId: questionDet._id,
               quesCategory: questionDet.quesCategory,
               AnswerMarked: "o" + activeOption
            }
         else {
            let a = []
            for (let i = 0; i < selected.length; i++) {
               a.push(selected[i])
            }
            answer = {
               quesId: questionDet._id,
               quesCategory: questionDet.quesCategory,
               AnswerMarked: a
            }
         }
      }
      else {
         let answerImageDrawn = await handleSaveAsImage();
         answer = {
            quesId: questionDet._id,
            quesCategory: questionDet.quesCategory,
            AnswerMarked: answerImageDrawn
         }
      }
      if (questionAnswer.questions.length === 0) {
         dispatch(firstQuestionAnswered(user._id, answer));
      }
      else {
         dispatch(questionAnswered(answer));
      }
      fullScreenMode();
      dispatch(currentQuestion(counter + 1));
      setLastQuestion(allQuestions.length - counter - 2);
      setActiveOption();
      setSelected([]);
   }

   const submitAssessment = async () => {
      let answer;
      if (activeOption === undefined && question.questionType === "single") return;
      if (selected.length === 0 && question.questionType === "multi") return;
      if (question.structure !== 8) {
         if (question.questionType === "single")
            answer = {
               quesId: questionDet._id,
               quesCategory: questionDet.quesCategory,
               AnswerMarked: "o" + activeOption
            }
         else {
            let a = []
            for (let i = 0; i < selected.length; i++) {
               a.push(selected[i])
            }
            answer = {
               quesId: questionDet._id,
               quesCategory: questionDet.quesCategory,
               AnswerMarked: a
            }
         }
      }
      else {
         let answerImageDrawn = await handleSaveAsImage();
         answer = {
            quesId: questionDet._id,
            quesCategory: questionDet.quesCategory,
            AnswerMarked: answerImageDrawn
         }
      }
      if (questionAnswer.questions.length === 0) {
         dispatch(firstQuestionAnswered(user._id, answer));
      }
      else if (questionAnswer.questions.length !== allQuestions.length) {
         dispatch(questionAnswered(answer));
      }
      console.log(questionAnswer);

      await axios.post(apiUrl + "result", { userId: user._id, questions: [...questionAnswer.questions, answer] })
         .then(async ({ data }) => {
            await axios.patch(apiUrl + "user/" + user._id, {
               assessId: data.question._id
            })
               .then(() => {
                  setActiveOption();
                  dispatch(resetUser())
                  dispatch(resetAssessment())
               })
         })
         .catch(({ message }) => {
            toast(message, {
               type: "error",
               autoClose: 3000,
               theme: "colored",
               hideProgressBar: true
            })
         })
   }

   // works if structure 5th is in use
   const handleSelection = (str) => {
      let newSelection = [];
      if (selected.includes(str)) {
         newSelection = selected.filter((value) => value !== str)
      }
      else {
         newSelection = [...selected, str];
      }
      console.log(newSelection);
      setSelected(newSelection);
   }

   useEffect(() => {
      if (user.name === undefined) navigate("/");
   });

   useEffect(() => {
      if (allQuestions.length === 0 && user.name !== undefined)
         fetchQuestions();
   }, [allQuestions, fetchQuestions, user]);

   const [lastQuestion, setLastQuestion] = useState(allQuestions.length === 1 ? allQuestions.length - counter : allQuestions.length - counter - 1);
   const [activeOption, setActiveOption] = useState();


   function dataURLToBlob(dataURL) {
      // Split the data URL to get the base64 string
      const [prefix, base64Data] = dataURL.split(',');
      const byteString = atob(base64Data); // Decode the base64 data

      // Create an array of bytes
      const byteArray = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
         byteArray[i] = byteString.charCodeAt(i);
      }

      // Determine the MIME type from the prefix (e.g., "image/png")
      const mimeType = prefix.match(/:(.*?);/)[1];

      // Create and return a Blob object
      return new Blob([byteArray], { type: mimeType });
   }

   const handleSaveAsImage = async () => {
      // Show all layers (without grid lines) before saving
      setShowGrid(false);

      // Use a timeout to allow the state change to reflect in the UI

      // eslint-disable-next-line
      const dataURL = dataURLToBlob(stageRef.current?.toDataURL());
      setShowGrid(true);

      // console.log(stageRef.current?.toDataURL());
      // console.log(dataURL)
      // console.log(JSON.stringify(dataURL))
      // console.log(typeof (JSON.stringify(dataURL)))
      return stageRef.current?.toDataURL()
      // return (JSON.stringify(dataURL));
   };

   return (
      <ParentContainer>
         <div style={{ width: "100%", textAlign: "right", fontSize: "20px", height: "max-content", fontWeight: "600", color: questionDet?.quesCategory?.categoryName && questionDet?.quesCategory?.categoryName.includes("Demo") ? "#aaa" : "#fff" }}>
            Demo
         </div>
         {
            question !== undefined ?
               <>
                  <div style={{ height: "87vh", paddingTop: "5vh" }}>
                     {
                        question.structure >= 1 && question.structure <= 4 ?
                           <Structure1to4 question={question} activeOption={activeOption} setActiveOption={setActiveOption} />
                           : question.structure === 5 ?
                              <Structure5 question={question} selected={selected} handleSelection={handleSelection} />
                              : question.structure === 6 ?
                                 <Structure6 question={question} activeOption={activeOption} setActiveOption={setActiveOption} />
                                 : question.structure === 7 ?
                                    <Structure7 question={question} leftColumn={questionDet?.quesCategory?.categoryName && questionDet?.quesCategory?.categoryName.includes("AAA") ? leftColumn.Demo : leftColumn.Ques} rightColumn={questionDet?.quesCategory?.categoryName && questionDet?.quesCategory?.categoryName.includes("AAA") ? rightColumn.Demo : rightColumn.Ques} handleSelection={handleSelection} />
                                    : question.structure === 8 ?
                                       <Structure8 stageRef={stageRef} showGrid={showGrid} question={question} />
                                       : ""
                     }
                  </div>
                  <div style={{ height: "7vh" }}>
                     {
                        lastQuestion !== 0 ?
                           <Button className='submitBtn' onClick={saveQuestion}>Next</Button>
                           :
                           <Button className='submitBtn' onClick={submitAssessment}>Submit</Button>
                     }
                  </div>
               </>
               : <></>
         }
      </ParentContainer>
   )
}

export default QuestionStructures