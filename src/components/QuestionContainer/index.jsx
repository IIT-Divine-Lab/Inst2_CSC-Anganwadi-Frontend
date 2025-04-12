import React from 'react'
import Header from '../Header';

const QuestionContainer = (props) => {

  return (
    <div className='h-screen w-full flex justify-evenly items-center flex-col'>
      <Header />
      <div className='w-[90%] portrait:min-h-[900px] pt-5 flex items-center flex-col' style={{ height: "calc(100% - 7rem)" }}>
        {props.children}
      </div>
    </div>
  )
}

export default QuestionContainer