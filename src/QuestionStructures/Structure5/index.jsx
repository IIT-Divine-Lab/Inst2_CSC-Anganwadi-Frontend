import React, { useEffect, useRef, useState } from 'react'
import Heading from '../../Common/Heading'
import "./style.css"

const Structure5 = ({ setStartTime, question, selected, handleSelection }) => {
   const [column, setColumn] = useState(0);
   const optionContainerRef = useRef([]);

   const getSourceURL = (obj, type = "image") => {
      try {
         if (typeof (obj?.filePath) === "object") {
            let bufferURL = URL.createObjectURL(new Blob([new Uint8Array(obj.filePath.data)], { type: "image/png" }))
            return bufferURL;
         }
         return URL.createObjectURL(obj);
      }
      catch (error) {
         return `data:image/png;base64,${obj?.filePath}`
      }
   }

   useEffect(() => {
      if (column === 0) {
         let quotient = Math.ceil(question.totalOptions / 5);
         setColumn(quotient);
      }
      if (question.totalOptions === 8) {
         for (let i = 0; i < question.totalOptions; i++) {
            optionContainerRef.current.children[i].children[0].style.width = "180px";
            optionContainerRef.current.children[i].children[0].style.height = "180px";
         }
      }
      // else if (question.totalOptions === 10) {
      //    [2, 3, 6, 7, 10].forEach((val) => {
      //       optionContainerRef.current.children[val - 1].children[0].style.width = "120px";
      //       optionContainerRef.current.children[val - 1].children[0].style.height = "120px";
      //    })
      // }
   }, [column, question])

   return (
      <>
         <Heading>
            {question.questionText}
         </Heading>
         <div className='s5optionContainer' ref={optionContainerRef} style={{ gridTemplateColumns: `repeat(${column},1fr)` }}>
            {
               Array.from({ length: question.totalOptions }, (_, index) => (
                  <div className='s5option' key={index}>
                     <div onClick={() => handleSelection("o" + (index + 1))}>
                        <img
                           onLoad={() => setStartTime(Date.now())}
                           src={question.option !== undefined ? getSourceURL(question.option[index]) : undefined}
                           className={selected.includes("o" + (index + 1)) ? 'selected' : 'unselected'}
                           alt=""
                        />
                     </div>
                  </div>
               ))
               // question.option.map((option, index) => {
               // })
            }
         </div>
      </>
   )
}

export default Structure5