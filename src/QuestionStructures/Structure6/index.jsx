import React from 'react'
import './style.css'
import Heading from '../../Common/Heading'
import Body from '../../Common/Body'

const Structure6 = ({ activeOption, setActiveOption, question }) => {

   const getSourceURL = (obj) => {
      try {
         console.log(obj);
         if (obj !== undefined) {
            if (typeof (obj?.filePath) === "object") {
               let bufferURL = URL.createObjectURL(new Blob([new Uint8Array(obj.filePath.data)], { type: "image/png" }))
               return bufferURL;
            }
            return URL.createObjectURL(obj);
         }
         return undefined
      }
      catch (error) {
         console.log("Error", error);
         return `data:image/png;base64,${obj?.filePath}`
      }
   }
   return (
      <>
         <Heading>
            {question.questionText}
         </Heading>
         <Body>
            <div>
               <img className='quesImage' src={question?.questionImage?.after !== undefined ? getSourceURL(question?.questionImage?.after) : undefined} alt="" />
            </div>
            <div className="s2OptionImage">
               <img src={question.answerImage !== undefined ? getSourceURL(question.answerImage) : undefined} alt="" />
               <div className="options">
                  <img className='egg' src={activeOption === 1 ? question.option[0] !== undefined ? getSourceURL(question.option[0]) : undefined : question.option[1] !== undefined ? getSourceURL(question.option[1]) : undefined} alt="" onClick={() => setActiveOption(1)} />
                  <img className='egg' src={activeOption === 2 ? question.option[0] !== undefined ? getSourceURL(question.option[0]) : undefined : question.option[1] !== undefined ? getSourceURL(question.option[1]) : undefined} alt="" onClick={() => setActiveOption(2)} />
                  <img className='egg' src={activeOption === 3 ? question.option[0] !== undefined ? getSourceURL(question.option[0]) : undefined : question.option[1] !== undefined ? getSourceURL(question.option[1]) : undefined} alt="" onClick={() => setActiveOption(3)} />
                  <img className='egg' src={activeOption === 4 ? question.option[0] !== undefined ? getSourceURL(question.option[0]) : undefined : question.option[1] !== undefined ? getSourceURL(question.option[1]) : undefined} alt="" onClick={() => setActiveOption(4)} />
               </div>
            </div>
         </Body>
      </>
   )
}

export default Structure6