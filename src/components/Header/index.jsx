import React, { useEffect, useState } from 'react'
import CSClogo from "../../assets/Images/CSClogo.png"
import IITlogo from "../../assets/Images/IITlogo.png"
import { useSelector } from 'react-redux'

const Header = ({ page }) => {
  // eslint-disable-next-line
  const orientation = useSelector(state => state?.orientation);
  const allQuestions = useSelector(state => state?.allQuestions);
  const counter = useSelector(state => state?.currentQuestion?.counter);
  const questionDet = useSelector(state => state?.allQuestions)?.[counter];
  // eslint-disable-next-line
  const question = questionDet !== undefined ? questionDet?.question : "";

  const getQuestionType = (type) => {
    switch (type) {
      case "single": return "Single Choice"
      case "multi": return "Multi Select"
      case "draw": return "Draw"
      default: return "Error"
    }
  }

  return (
    <div className={`w-[90%] mt-5 flex ${page === "login" ? "justify-end px-[5%]" : "justify-between"} items-center max-h-28`}>
      <>
        {
          page !== "login" ?
            <div className='h-full portrait:border portrait:border-[#2d8dfe8a] rounded-xl bg-white w-[80%] landscape:bg-[#2d8dfe1a] flex portrait:flex-col'>
              <div className='flex pt-5 px-5 landscape:w-[30%] landscape:flex-col'>
                <h2 className='landscape:text-lg font-medium'>Question Type : </h2>
                <h6 className='portrait:ml-2 text-[#2d8dfe] landscape:mt-2 font-semibold landscape:text-2xl'>{getQuestionType(question.questionType)}</h6>
              </div>
              <hr className='portrait:hidden w-2 h-full bg-white' />
              <div className='py-4 px-5 landscape:w-[80%]'>
                <h6 className='portrait:hidden font-medium'>Your Progress</h6>
                <h3 className='text-[#2d8dfe] landscape:mt-2 font-semibold landscape:text-2xl'>{(allQuestions && ((counter / allQuestions.length) * 100).toFixed(0)) || 0} % Completed</h3>
                <div className='bg-[#2d8dfe1a] w-full h-1 rounded mt-1'>
                  <div className='h-1 bg-[#2d8dfe]' style={{ width: (allQuestions && (counter / allQuestions.length) * 100) + "%" }}></div>
                </div>

              </div>
            </div>
            : ""
        }
      </>
      <div className='flex h-16 ml-5 w-[15%] min-w-max'>
        <img className='h-full' src={IITlogo} alt="" />
        <img className='h-full ml-5' src={CSClogo} alt="" />
      </div>
    </div>
  )
}

export default Header