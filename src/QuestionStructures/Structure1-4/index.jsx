import React, { useEffect, useRef } from 'react'
import "./style.css"
import { HiSpeakerWave } from "react-icons/hi2";
import Heading from '../../Common/Heading'
import Body from '../../Common/Body';

const Structure1to4 = ({ setStartTime, setActiveOption, activeOption, question }) => {

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

   const questionImageRef = useRef();

   useEffect(() => {
      imgRef.current.forEach((img, index) => {
         const container = containerRef.current[index];
         if (img && container) {
            // Set placeholder dimensions initially
            img.style.width = "180px";
            img.style.height = "250px";
            img.style.backgroundColor = "lightgray"; // Light gray background for placeholder

            let src = img.src;
            if (!img.complete) {
               // Show the placeholder while the image is loading
               img.src = ""; // Set src to empty to avoid any display issues
               img.onload = () => {
                  // Image has finished loading, adjust based on aspect ratio
                  if (img.naturalWidth - img.naturalHeight > 20) {
                     adjustImageSize(img, container, "100%", "unset"); // Full width
                  } else {
                     adjustImageSize(img, container, "auto", "250px"); // Fixed height
                  }
               };
               img.src = src; // Re-assign the original source to trigger loading
            } else {
               // Image is already loaded, apply the correct size immediately
               if (img.naturalWidth - img.naturalHeight > 20) {
                  adjustImageSize(img, container, "100%", "unset");
               } else {
                  adjustImageSize(img, container, "auto", "250px");
               }
            }
         }
      });

      if (questionImageRef.current) {
         if (questionImageRef.current?.complete) {
            let img = questionImageRef.current;
            if (img.naturalWidth - img.naturalHeight > 150) {
               questionImageRef.current.style.height = "auto";
               questionImageRef.current.style.width = "500px";
            }
            else {
               questionImageRef.current.style.width = "35vh";
               questionImageRef.current.style.height = "auto";
            }
         }
         else {
            questionImageRef.current.onload = () => {
               let img = questionImageRef.current;
               if (img?.naturalWidth - img?.naturalHeight > 150) {
                  questionImageRef.current.style.height = "auto";
                  questionImageRef.current.style.width = "500px";
               }
               else {
                  questionImageRef.current.style.width = "35vh";
                  questionImageRef.current.style.height = "auto";
               }
            }
         }
      }

   }, [question, questionImageRef])

   return (
      <>
         {
            question.structure === 1 ?
               <div>
                  <img className='quesImageBefore' onLoad={() => setStartTime(Date.now())} src={question?.questionImage?.before !== undefined ? getSourceURL(question?.questionImage?.before) : undefined} alt="" />
               </div>
               :
               <>
               </>
         }
         <Heading>
            {question.questionText}
         </Heading>
         <Body>
            {
               question.structure === 1 || question.structure === 2 ?
                  <div>
                     <img ref={questionImageRef} onLoad={() => setStartTime(Date.now())} className='quesImageAfter' src={question?.questionImage?.after !== undefined ? getSourceURL(question?.questionImage?.after) : undefined} alt="" />
                  </div>
                  : question.structure === 4 ?
                     <>
                        {
                           !question.questionOnlyText && question.questionSound ?
                              <audio loops={false} id='audioQues' onLoad={() => setStartTime(Date.now())} className='audioQues' src={question?.questionSound !== undefined ? getSourceURL(question?.questionSound, "audio") : undefined}></audio>
                              : ""
                        }
                        <div className='audioContainer'>
                           {
                              !question.questionOnlyText ?
                                 <HiSpeakerWave onClick={playAudio} className='speaker' />
                                 : ""
                           }
                           {
                              question.questionSoundText ?
                                 <span style={{ marginLeft: "10px" }}>{question.questionSoundText}</span>
                                 :
                                 <span>{question.questionOnlyText}</span>
                           }
                        </div>
                     </>
                     : <>
                     </>
            }
            <div className="quesOptionContainer">
               <div className='rowContainer'>
                  {
                     Array(question?.totalOptions || 2).fill(0).map((_, index) => {
                        return <div key={question.questionText + index} style={question.totalOptions === 3 && index === 2 ? { gridColumn: "1/3", justifySelf: "center" } : {}} className="optionContainer" ref={(el) => containerRef.current[index] = el}>
                           <img onLoad={() => setStartTime(Date.now())} ref={(el) => imgRef.current[index] = el} src={question.option !== undefined ? getSourceURL(question.option[index]) : undefined} alt='' className={activeOption !== (index + 1) ? "option" : "option optionActive"} />
                           <input type="radio" name={"q" + (index + 1)} id={"a" + (index + 1)} className='chooseOption' onClick={() => { if (imgRef.current[index].complete) setActiveOption(index + 1); else console.log(imgRef.current[index].complete) }} />
                        </div>
                     })
                  }
               </div>
            </div>
         </Body>
      </>
   )
}

export default Structure1to4