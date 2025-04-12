import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currentQuestion, firstQuestionAnswered, getQuestions, questionAnswered, resetAssessment } from '../../redux/actions/assessmentActions';
import { resetUser } from '../../redux/actions/userActions';
import axios from 'axios';
import apiUrl from '../../apiUrl';
import QuestionContainer from '../../components/QuestionContainer';
import Structure6 from '../../components/Structures/Structure 6';
import Button from '../../components/Button';
import Tongue from "../../assets/Images/tongue.png"
import Agarbatti from "../../assets/Images/Agarbatti.png"
import Food from "../../assets/Images/Food.png"
import IceBowl from "../../assets/Images/IceBowl.png"
import RedBall from "../../assets/Images/RedBall.png"
import Speaker from "../../assets/Images/Speaker.png"
import Ear from "../../assets/Images/ear.png"
import Eyes from "../../assets/Images/eyes.png"
import Hand from "../../assets/Images/hand.png"
import Nose from "../../assets/Images/nose.png"
import Candle from "../../assets/Images/candle.png"
import Icecream from "../../assets/Images/icecream.png"
import Perfume from "../../assets/Images/perfume.png"
import Teddy from "../../assets/Images/teddyBear.png"
import DemoSpeaker from "../../assets/Images/demoSpeaker.png"
import Structure1to4 from '../../components/Structures/Structure1to4';
import Structure8 from '../../components/Structures/Structure8';
import Structure5 from '../../components/Structures/Structure5';

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

const QuestionStructures = () => {
  const user = useSelector(state => state?.user);
  const orientation = useSelector(state => state?.orientation);
  const allQuestions = useSelector(state => state?.allQuestions);
  const counter = useSelector(state => state?.currentQuestion?.counter);
  const questionDet = useSelector(state => state?.allQuestions)?.[counter];
  const questionAnswer = useSelector(state => state?.questionAnswered);
  console.log(questionDet);

  const question = questionDet !== undefined ? questionDet?.question : "";
  const category = questionDet !== undefined ? questionDet?.quesCategory : "";

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const stageRef = useRef(null);

  const [showSubmitLoader, setShowSubmitLoader] = useState("no");
  const [startTime, setStartTime] = useState(undefined);
  const [selected, setSelected] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [activeOption, setActiveOption] = useState();
  const [lastQuestion, setLastQuestion] = useState(typeof (allQuestions) === "object" ? Object.keys(allQuestions).length === 1 ? Object.keys(allQuestions).length - counter : Object.keys(allQuestions).length - counter - 1 : allQuestions?.length === 1 ? allQuestions?.length - counter : allQuestions?.length - counter - 1);

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
    // fullScreenMode();
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

  // eslint-disable-next-line
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

    const dataURL = stageRef.current?.toDataURL()
    setShowGrid(true);

    stageRef.current = null;

    // console.log(stageRef.current?.toDataURL());
    // console.log(dataURL)
    // console.log(JSON.stringify(dataURL))
    // console.log(typeof (JSON.stringify(dataURL)))
    return dataURL
    // return (JSON.stringify(dataURL));
  };

  // Navigate to login if user doesn't exists
  useEffect(() => {
    if (user?.name === undefined) navigate("/");
  });

  // Fetch questions
  useEffect(() => {
    if (user.name !== undefined && ((typeof (allQuestions) === "object" && Object.keys(allQuestions).length === 0) || allQuestions?.length === 0))
      fetchQuestions();
  }, [allQuestions, fetchQuestions, user]);

  return (
    <QuestionContainer>
      {
        question !== undefined ?
          <>
            <div className={`${question.structure === 1 || question.structure === 2 || question.structure === 8 ? 'pt-2 mb-2' : 'pt-16 mb-6 pb-6'} border ${category?.categoryName?.split(" : ")[1].toLowerCase() === 'demo' ? 'border-[#14141459]' : 'border-white'} h-max relative rounded-xl w-full px-[5%]`}>
              {
                question.structure >= 1 && question.structure <= 4 ?
                  <Structure1to4 activeOption={activeOption} setActiveOption={setActiveOption} setStartTime={setStartTime} question={question} />
                  : question.structure === 5 ?
                    <Structure5 selected={selected} handleSelection={handleSelection} setStartTime={setStartTime} question={question} />
                    : question.structure === 6 ?
                      <Structure6 activeOption={activeOption} setActiveOption={setActiveOption} setStartTime={setStartTime} question={question} />
                      : question.structure === 8 ?
                        <Structure8 setStartTime={setStartTime} stageRef={stageRef} showGrid={showGrid} question={question} />
                        :
                        <></>
              }
              {
                category?.categoryName?.split(" : ")[1].toLowerCase() === "demo" ?
                  <div className='absolute text-[#2d8dfe] bg-[#2d8dfe2a] top-2 left-2 text-sm px-2 py-0.5'>
                    Practice Question
                  </div>
                  :
                  <></>
              }
            </div>
            <div className='w-full flex justify-end'>
              {
                lastQuestion !== 0 ?

                  <Button onClick={saveQuestion}>
                    <span>Next</span>
                    <span className='ml-3'>➡</span>
                  </Button> :
                  <Button onClick={submitAssessment}>
                    <span>Submit</span>
                    <span className='ml-3'>✔</span>
                  </Button>
              }
            </div>
          </>
          :
          <>
          </>
      }
    </QuestionContainer >
  )
}

export default QuestionStructures