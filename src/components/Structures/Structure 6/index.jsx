import React from 'react'
import Heading from '../../Heading'
import Body from '../../Body'

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

const Structure6 = ({ setStartTime, activeOption, setActiveOption, question }) => {
  return (
    <div>
      <Heading>
        {question?.questionText}
      </Heading>
      <Body>
        <div className='flex justify-center h-full w-auto'>
          <img
            onLoad={() => setStartTime(Date.now())}
            className='portrait:w-full h-auto w-full'
            src={question?.questionImage?.after !== undefined ? getSourceURL(question?.questionImage?.after) : undefined}
            alt=""
          />
        </div>
        <div className='w-auto important(w-auto) relative flex flex-row items-center justify-center h-80 portrait:mt-8 landscape:ml-8'>
          <img
            src={question.answerImage !== undefined ? getSourceURL(question.answerImage) : undefined}
            alt=""
            className='h-full'
          />
          <div
            className='absolute landscape:w-[53%] portrait:w-[60%] flex flex-wrap left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          >
            {
              [1, 2, 3, 4].map((_, index) => {
                return <img
                  key={index}
                  onLoad={() => setStartTime(Date.now())}
                  className='w-12 landscape:even:ml-[4.2rem] m-6 portrait:odd:ml-[3rem] portrait:even:ml-[4.5rem] cursor-pointer'
                  src={activeOption === index ? question.option[0] !== undefined ? getSourceURL(question.option[0]) : undefined : question.option[1] !== undefined ? getSourceURL(question.option[1]) : undefined}
                  alt=""
                  onClick={() => setActiveOption(index)}
                />
              })
            }
          </div>
        </div>
      </Body>
    </div>
  )
}

export default Structure6