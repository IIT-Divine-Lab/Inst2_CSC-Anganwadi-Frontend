import React, { useEffect, useRef, useState } from 'react'
import { HiSpeakerWave } from "react-icons/hi2";
import Heading from '../../Heading';
import Body from '../../Body';


const Structure1to4 = ({ setStartTime, setActiveOption, activeOption, question }) => {
  const { structure } = question;
  const questionImageRef = useRef();
  const containerRef = useRef([]);
  const imgRef = useRef([]);

  const playAudio = () => {
    var aud = document.getElementById("audioQues");
    aud.play();
  }

  const getSourceURL = (obj, type = "image") => {
    try {
      if (obj && type === "audio") {
        let blobData = obj;
        if (typeof (obj) === "string") {
          blobData = new Uint8Array(obj.split(","))
        }
        else if (typeof (obj?.filePath) === "object") {
          blobData = new Uint8Array(obj.filePath.data)
        }
        const blob = new Blob([blobData], { type: "audio/mp3" });
        return URL.createObjectURL(blob);
      }
      if (typeof (obj?.filePath) === "object") {
        let bufferURL = URL.createObjectURL(new Blob([new Uint8Array(obj.filePath.data)], { type: "image/png" }))
        return bufferURL;
      }
      return URL.createObjectURL(obj)
    }
    catch (error) {
      return `data:image/png;base64,${obj?.filePath}`
    }
  }

  const adjustImageSize = (img, container, width, height) => {
    if (img.naturalWidth > img.naturalHeight) {
      img.style.width = width; // Landscape style
      img.style.height = height;
    } else {
      img.style.height = height; // Portrait style
      img.style.width = width;
      if (container) container.style.width = 'unset';
    }
    img.style.backgroundColor = "transparent";
  };

  useEffect(() => {
    imgRef.current.forEach((img, index) => {
      const container = containerRef.current[index];
      if (img && container) {
        let src = img.src;
        if (!img.complete) {
          // Show the placeholder while the image is loading
          img.src = ""; // Set src to empty to avoid any display issues
          img.onload = () => {
            // Image has finished loading, adjust based on aspect ratio
            if (img.naturalWidth - img.naturalHeight > 20) {
              adjustImageSize(img, container, "100%", "unset"); // Full width
            } else {
              adjustImageSize(img, container, "auto", "200px"); // Fixed height
            }
          };
          img.src = src; // Re-assign the original source to trigger loading
        } else {
          // Image is already loaded, apply the correct size immediately
          if (img.naturalWidth - img.naturalHeight > 20) {
            adjustImageSize(img, container, "100%", "unset");
          } else {
            adjustImageSize(img, container, "auto", "200px");
          }
        }
      }
    });

    if (questionImageRef.current) {
      if (questionImageRef.current?.complete) {
        let img = questionImageRef.current;
        if (img.naturalWidth - img.naturalHeight > 150) {
          questionImageRef.current.style.height = "auto";
          questionImageRef.current.style.width = structure === 1 ? "300px" : "450px";
        }
        else {
          questionImageRef.current.style.width = window.innerWidth > 1000 ? "20vw" : "45vw";
          questionImageRef.current.style.height = "auto";
        }
      }
      else {
        questionImageRef.current.onload = () => {
          let img = questionImageRef.current;
          if (img?.naturalWidth - img?.naturalHeight > 150) {
            questionImageRef.current.style.width = structure === 1 ? "300px" : "450px";
          }
          else {
            questionImageRef.current.style.width = window.innerWidth > 1000 ? "20vw" : "45vw";
          }
          questionImageRef.current.style.height = "auto";
        }
      }
    }

  }, [question, questionImageRef])

  return (
    <div className=''>
      {
        structure === 1 ?
          <div className='max-h-28 mb-6 w-full flex justify-center'>
            <img
              className='w-auto max-h-[inherit]'
              onLoad={() => setStartTime(Date.now())}
              src={question?.questionImage?.before !== undefined ? getSourceURL(question?.questionImage?.before) : undefined}
              alt=""
            />
          </div>
          :
          <>
          </>
      }
      <Heading>
        {question.questionText}
      </Heading>
      <Body extraClasses="flex-col">
        {
          structure === 1 || structure === 2 ?
            <div>
              <img
                className='w-4/5 flex justify-self-center h-auto border border-[#cacaca] rounded-xl'
                ref={questionImageRef}
                onLoad={() => setStartTime(Date.now())}
                src={question?.questionImage?.after !== undefined ? getSourceURL(question?.questionImage?.after) : undefined}
                alt=""
              />
            </div>
            : question.structure === 4 ?
              <>
                {
                  !question.questionOnlyText && question.questionSound ?
                    <audio loops={false} id='audioQues' onLoad={() => setStartTime(Date.now())} className='audioQues' src={question?.questionSound !== undefined ? getSourceURL(question?.questionSound, "audio") : undefined}></audio>
                    : ""
                }
                <div className='flex items-center mb-10'>
                  {
                    !question.questionOnlyText ?
                      <HiSpeakerWave onClick={playAudio} className='text-6xl bg-[#2d8dfe] p-2.5 text-white rounded-xl cursor-pointer' />
                      : ""
                  }
                  {
                    question.questionSoundText ?
                      <span className='ml-5 text-2xl font-semibold'>{question.questionSoundText}</span>
                      :
                      <span className='text-2xl font-semibold'>{question.questionOnlyText}</span>
                  }
                </div>
              </>
              : <>
              </>
        }
        <div className={`${structure === 1 || structure === 2 ? 'mt-5' :
          ''} portrait:mt-10`}>
          <div className={`grid ${question.totalOptions === 2 ? 'grid-cols-2' : question.totalOptions === 4 ? 'landscape:grid-cols-4 portrait:grid-cols-2' : question.totalOptions === 3 ? 'landscape:grid-cols-3 portrait:grid-cols-2' : ''} gap-5`}>
            {
              Array(question?.totalOptions || 2).fill(0).map((_, index) => {
                return <>
                  <div
                    className={`relative landscape:w-48 portrait:w-64`}
                    key={question.questionText + index}
                    ref={(el) => containerRef.current[index] = el}
                  >
                    <img
                      className={`rounded-3xl w-full border-2 ${activeOption === (index + 1) ? 'border-[#2d8dfe]' : ''}`}
                      onLoad={() => setStartTime(Date.now())}
                      ref={(el) => imgRef.current[index] = el}
                      src={question.option !== undefined ?
                        getSourceURL(question.option[index]) : undefined}
                      alt=''
                    />
                    <input
                      type="radio"
                      className='absolute opacity-0 top-0 h-full w-full'
                      name={"option"}
                      id={"a" + (index + 1)}
                      onClick={() => {
                        if (imgRef.current[index].complete)
                          setActiveOption(index + 1);
                        else
                          console.log(imgRef.current[index].complete)
                      }}
                    />
                  </div>
                </>
              })
            }
          </div>
        </div>
      </Body>
    </div>
  )
}

export default Structure1to4