import React, { useRef } from 'react'
import Heading from '../../Heading'
import Body from '../../Body'

const Structure5 = ({ setStartTime, question, selected, handleSelection }) => {
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
  return (
    <div className=''>
      <Heading>
        {question?.questionText}
      </Heading>
      <Body extraClasses="my-5">
        <div className={`grid landscape:gap-x-4 landscape:gap-y-2 ${question.totalOptions === 8 ? 'landscape:grid-cols-4 portrait:grid-rows-4' : 'landscape:grid-cols-5 portrait:grid-rows-5'} landscape:grid-rows-2 landscape:grid-flow-col portrait:gap-x-2 portrait:gap-y-4 portrait:grid-cols-2 portrait:grid-flow-row`}>
          {
            Array.from({ length: question.totalOptions }, (_, index) => (
              <div className='flex justify-center items-center' key={index}>
                <div className='max-w-40' onClick={() => handleSelection("o" + (index + 1))}>
                  <img
                    onLoad={() => setStartTime(Date.now())}
                    src={question.option !== undefined ? getSourceURL(question.option[index]) : undefined}
                    className={`${selected.includes("o" + (index + 1)) ? 'rounded-[2rem] border-[#2d8dfe]' : 'border-white'} w-full h-full border-4`}
                    alt=""
                  />
                </div>
              </div>
            ))
            // question.option.map((option, index) => {
            // })
          }
        </div>
      </Body>
    </div>
  )
}

export default Structure5