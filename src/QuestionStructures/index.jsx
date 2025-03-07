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
import Loading from '../Loading';

const QuestionStructures = () => {
   const [selected, setSelected] = useState([]);
   // State to control visibility of layers (e.g., grid lines or others you may want to exclude)
   const [showGrid, setShowGrid] = useState(true);
   const [showSubmitLoader, setShowSubmitLoader] = useState("no");
   const [startTime, setStartTime] = useState(undefined);
   const stageRef = useRef(null);
   const navigate = useNavigate()
   const user = useSelector(state => state?.user);
   const allQuestions = useSelector(state => state?.allQuestions);
   const counter = useSelector(state => state?.currentQuestion?.counter);
   const questionDet = useSelector(state => state?.allQuestions)?.[counter];
   const question = questionDet !== undefined ? questionDet?.question : "";

   const questionAnswer = useSelector(state => state?.questionAnswered);
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
   const exitFullScreenMode = () => {
      if (document.exitFullscreen) {
         document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
         document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
         document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) { // IE/Edge
         document.msExitFullscreen();
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
      const timeTaken = Date.now() - startTime;
      let answer;
      if (activeOption === undefined && question.questionType === "single") {
         toast.info("Please select an answer", {
            autoClose: 1500,
            theme: "colored",
            hideProgressBar: true
         })
         return;
      }
      if (selected.length === 0 && question.questionType === "multi") {
         toast.info("Please select an answer", {
            autoClose: 1500,
            theme: "colored",
            hideProgressBar: true
         })
         return;
      }
      if (question.structure !== 8) {
         if (question.questionType === "single")
            answer = {
               quesId: questionDet._id,
               quesCategory: questionDet.quesCategory,
               AnswerMarked: "o" + activeOption,
               timeTaken
            }
         else {
            let a = []
            for (let i = 0; i < selected.length; i++) {
               a.push(selected[i])
            }
            answer = {
               quesId: questionDet._id,
               quesCategory: questionDet.quesCategory,
               AnswerMarked: a,
               timeTaken
            }
         }
      }
      else {
         let answerImageDrawn = await handleSaveAsImage();
         answer = {
            quesId: questionDet._id,
            quesCategory: questionDet.quesCategory,
            AnswerMarked: answerImageDrawn,
            timeTaken
         }
      }
      if (questionAnswer.questions.length === 0) {
         dispatch(firstQuestionAnswered(user._id, answer));
      }
      else {
         dispatch(questionAnswered(answer));
      }
      fullScreenMode();
      console.log("\n Counter", counter);
      dispatch(currentQuestion(counter + 1));
      setLastQuestion(typeof (allQuestions) === "object" ? Object.keys(allQuestions).length - counter - 2 : allQuestions?.length - counter - 2);
      console.log("\n Time in Milliseconds", timeTaken);
      console.log("\n Time in h:m:s", + Math.floor((timeTaken % (24 * 3600000)) / 3600000) + " hours : " + Math.floor((timeTaken % 3600000) / 60000) + " minutes : " + Math.floor((timeTaken % 60000) / 1000) + " seconds : " + timeTaken % 1000 + " milliseconds");
      setStartTime();
      setActiveOption();
      setSelected([]);
   }

   const submitAssessment = async () => {
      const endTime = Date.now();
      setShowSubmitLoader("Submitting");
      let answer;
      if (activeOption === undefined && question.questionType === "single") {
         toast.info("Please select an answer", {
            autoClose: 1500,
            theme: "colored",
            hideProgressBar: true
         })
         return;
      }
      if (selected.length === 0 && question.questionType === "multi") {
         toast.info("Please select an answer", {
            autoClose: 1500,
            theme: "colored",
            hideProgressBar: true
         })
         return;
      }
      if (question.structure !== 8) {
         if (question.questionType === "single")
            answer = {
               quesId: questionDet._id,
               quesCategory: questionDet.quesCategory,
               AnswerMarked: "o" + activeOption,
               timeTaken: endTime - startTime
            }
         else {
            let a = []
            for (let i = 0; i < selected.length; i++) {
               a.push(selected[i])
            }
            answer = {
               quesId: questionDet._id,
               quesCategory: questionDet.quesCategory,
               AnswerMarked: a,
               timeTaken: endTime - startTime
            }
         }
      }
      else {
         let answerImageDrawn = await handleSaveAsImage();
         answer = {
            quesId: questionDet._id,
            quesCategory: questionDet.quesCategory,
            AnswerMarked: answerImageDrawn,
            timeTaken: endTime - startTime
         }
      }
      if (questionAnswer?.questions.length === 0) {
         dispatch(firstQuestionAnswered(user._id, answer));
      }
      else if (questionAnswer?.questions.length !== allQuestions?.length) {
         dispatch(questionAnswered(answer));
      }
      console.log(answer);
      console.log(endTime, startTime);
      setStartTime();

      await axios.post(apiUrl + "result", { userId: user._id, questions: [...questionAnswer.questions, answer] })
         .then(async ({ data }) => {
            console.log(data);
            await axios.patch(apiUrl + "user/" + user._id, {
               assessId: data.question._id
            })
               .then(() => {
                  setShowSubmitLoader("Submitted. Please wait...");
                  setTimeout(() => {
                     setShowSubmitLoader("no");
                     exitFullScreenMode();
                     setActiveOption();
                     dispatch(resetUser())
                     dispatch(resetAssessment())
                  }, 2000);
               })
               .catch(({ message }) => {
                  setShowSubmitLoader("no");
                  toast(message, {
                     type: "error",
                     autoClose: 3000,
                     theme: "colored",
                     hideProgressBar: true
                  })
               })
         })
         .catch(({ message }) => {

            setShowSubmitLoader("no");
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
      if (user?.name === undefined) navigate("/");
   });

   useEffect(() => {
      if (user.name !== undefined && ((typeof (allQuestions) === "object" && Object.keys(allQuestions).length === 0) || allQuestions?.length === 0))
         fetchQuestions();
   }, [allQuestions, fetchQuestions, user]);

   const [lastQuestion, setLastQuestion] = useState(typeof (allQuestions) === "object" ? Object.keys(allQuestions).length === 1 ? Object.keys(allQuestions).length - counter : Object.keys(allQuestions).length - counter - 1 : allQuestions?.length === 1 ? allQuestions?.length - counter : allQuestions?.length - counter - 1);
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
   // console.log(typeof (allQuestions));
   // console.log(typeof (allQuestions) === "object");
   // console.log(((typeof (allQuestions) === "object" ? (counter / Object.keys(allQuestions).length) : (counter / allQuestions.length)) + "%"));
   return (
      <ParentContainer>
         <div style={{ width: "100%", height: "4px", borderRadius: "10px", backgroundColor: "red" }}>
            <div style={{ width: (typeof (allQuestions) === "object" ? ((counter / Object.keys(allQuestions).length) * 100).toFixed(0) : ((counter / allQuestions.length) * 100).toFixed(0)) + "%", height: "100%", borderRadius: "10px", backgroundColor: "blue" }}>
            </div>
         </div>
         <div style={{ width: "100%", textAlign: "right", fontSize: "20px", height: "max-content", fontWeight: "600", color: "#aaa" }}>
            {question?.questionType}
            {
               questionDet?.quesCategory?.categoryName && questionDet?.quesCategory?.categoryName.includes("Demo") ?
                  <span>
                     Demo
                  </span>
                  : ""
            }
         </div>
         {
            question !== undefined ?
               <>
                  <div style={{ height: "87vh", paddingTop: "5vh" }}>
                     {
                        question.structure >= 1 && question.structure <= 4 ?
                           <Structure1to4 setStartTime={setStartTime} question={question} activeOption={activeOption} setActiveOption={setActiveOption} />
                           : question.structure === 5 ?
                              <Structure5 setStartTime={setStartTime} question={question} selected={selected} handleSelection={handleSelection} />
                              : question.structure === 6 ?
                                 <Structure6 setStartTime={setStartTime} question={question} activeOption={activeOption} setActiveOption={setActiveOption} />
                                 : question.structure === 7 ?
                                    <Structure7 setStartTime={setStartTime} question={question} leftColumn={questionDet?.quesCategory?.categoryName && questionDet?.quesCategory?.categoryName.includes("AAA") ? leftColumn.Demo : leftColumn.Ques} rightColumn={questionDet?.quesCategory?.categoryName && questionDet?.quesCategory?.categoryName.includes("AAA") ? rightColumn.Demo : rightColumn.Ques} handleSelection={handleSelection} />
                                    : question.structure === 8 ?
                                       <Structure8 setStartTime={setStartTime} stageRef={stageRef} showGrid={showGrid} question={question} />
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
         {
            showSubmitLoader !== "no" ?
               <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", position: "absolute", top: 0, backgroundColor: "#ffffffa2", width: "100%" }}>
                  <Loading width={150} height="unset" color="#ff0000" />
                  <span>{showSubmitLoader}</span>
               </div>
               :
               <></>
         }
      </ParentContainer>
   )
}

export default QuestionStructures