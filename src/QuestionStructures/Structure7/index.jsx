import React, { useEffect, useRef, useState } from 'react'
import Heading from '../../Common/Heading';

const Structure7 = ({ setStartTime, leftColumn, rightColumn, question, handleSelection }) => {

   const colors = [
      {
         color: "#4a94c3",
         bgCol: "#a2d5f2"
      },
      {
         color: "#5ea785",
         bgCol: "#b2e7c8"
      },
      {
         color: "#e08d60",
         bgCol: "#ffd7ba"
      },
      {
         color: "#a97bc3",
         bgCol: "#e7cffd"
      },
      {
         color: "#c4a945",
         bgCol: "#fff4b8"
      },
   ]

   const [selectedLeft, setSelectedLeft] = useState(null);
   const [matches, setMatches] = useState([]);
   const [matchedLeft, setMatchedLeft] = useState([]);
   const [matchedRight, setMatchedRight] = useState([])

   const leftRefs = useRef([]);
   const rightRefs = useRef([]);
   const containerRef = useRef();

   const handleLeftClick = (item) => {
      if (!((matchedLeft.findIndex(val => val.val === item.val) + 1) !== 0)) {
         setSelectedLeft(item);
      }
      else {
         setMatchedLeft(matchedLeft.filter((val) => val.val !== item.val))
         let right = matches.filter((val) => val.left.val === item.val)[0].right;
         handleSelection(`${item.val}-${right}`);
         setMatchedRight(matchedRight.filter((val) => val !== right));
         setMatches(matches.filter((val) => val.left.val !== item.val));
         setSelectedLeft(item);
      }
   };
   const handleRightClick = (item) => {
      if (selectedLeft && !matchedRight.includes(item)) {
         const leftIndex = leftColumn.findIndex((val) => val.val === selectedLeft.val);
         const rightIndex = rightColumn.findIndex((val) => val.val === item);

         const leftRect = leftRefs.current[leftIndex].getBoundingClientRect();
         const rightRect = rightRefs.current[rightIndex].getBoundingClientRect();

         const containerRect = containerRef.current.getBoundingClientRect();

         const leftCenter = {
            x: leftRect.right - containerRect.left, // Adjusted relative to container
            y: leftRect.top + leftRect.height / 2 - containerRect.top,
         };
         const rightCenter = {
            x: rightRect.left - containerRect.left, // Adjusted relative to container
            y: rightRect.top + rightRect.height / 2 - containerRect.top,
         };

         // Store the match with coordinates
         handleSelection(`${selectedLeft.val}-${item}`);
         setMatches([...matches, { left: selectedLeft, right: item, leftCenter, rightCenter }]);
         setMatchedLeft([...matchedLeft, selectedLeft]);
         setMatchedRight([...matchedRight, item]);
         setSelectedLeft(null);
      }
   }

   useEffect(() => {
      if (question) {
         setMatchedLeft([]);
         setMatchedRight([]);
         setMatches([]);
         setSelectedLeft(null);
      }
   }, [question])

   return (
      <>
         <Heading>
            {question.questionText}
         </Heading>
         <div style={{ display: 'flex', flexDirection: "column", padding: '20px' }}>
            <div style={{ display: "flex" }}>
               <div style={{
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column"
               }}>
                  {leftColumn.map((item, index) => {
                     return <div
                        key={index}
                        ref={(el) => (leftRefs.current[index] = el)}
                        onClick={() => handleLeftClick(item)}
                        style={{
                           backgroundColor: ((matchedLeft.findIndex(val => val.val === item.val) + 1) !== 0) ? colors[index].bgCol : 'transparent',
                           border: (selectedLeft?.val === item.val || matchedLeft.findIndex(val => val.val === item.val) + 1 !== 0) ? '3px solid ' + colors[index].color : '3px solid black',
                           fontSize: "28px",
                           textAlign: "center",
                           width: "250px",
                           padding: '10px',
                           cursor: "pointer",
                           borderRadius: "10px",
                           fontWeight: "600",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "flex-end",
                           margin: "25px 0"
                        }}
                     >
                        <div style={{
                           display: "flex",
                           justifyContent: "center",
                           minWidth: "70%",
                           height: "85px",
                           width: "auto"
                        }}>
                           <img onLoad={() => setStartTime(Date.now())} src={item.src} alt={item.val} />
                        </div>
                        <span style={{
                           marginLeft: "10px",
                           minWidth: "30%"
                        }}>
                           {item.val}
                        </span>
                     </div>
                  })}
               </div>

               <div style={{ position: "relative", width: '100px' }} ref={containerRef}>
                  <svg style={{ position: 'absolute', top: 0, left: 0, width: '100px', height: '100%' }}>
                     {
                        matches.map((match, index) => (
                           <line
                              key={index}
                              x1={match.leftCenter.x}
                              y1={match.leftCenter.y}
                              x2={match.rightCenter.x}
                              y2={match.rightCenter.y}
                              stroke={colors[leftColumn.findIndex((val) => val.val === matches[matches.findIndex((val) => val.right === match.right)]?.left.val)]?.color}
                              strokeWidth="2"
                           />
                        ))}
                  </svg>
               </div>

               <div style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
               }}>
                  {rightColumn.map((item, index) => {
                     return <div
                        key={index}
                        ref={(el) => (rightRefs.current[index] = el)}
                        onClick={() => handleRightClick(item.val)}
                        style={{
                           backgroundColor: matchedRight.includes(item.val) ? colors[leftColumn.findIndex((val) => val.val === matches[matches.findIndex((val) => val.right === item.val)]?.left.val)]?.bgCol : 'white',
                           border: matchedRight.includes(item.val) ? '3px solid' + colors[leftColumn.findIndex((val) => val.val === matches[matches.findIndex((val) => val.right === item.val)]?.left.val)]?.color : '3px solid black',
                           fontSize: "28px",
                           textAlign: "center",
                           width: "250px",
                           padding: '10px',
                           margin: "25px 0",
                           cursor: "pointer",
                           borderRadius: "10px",
                           fontWeight: "600",
                           display: "flex",
                           flexDirection: "column"
                        }}
                     >
                        <div style={{
                           display: "flex",
                           justifyContent: "center",
                           alignItems: "center",
                           height: "85px",
                           width: "auto"
                        }}>
                           <img onLoad={() => setStartTime(Date.now())} style={{ height: "100%" }} src={item.src} alt={item.val} />
                        </div>
                     </div>
                  })}
               </div>
            </div>
         </div>
      </>
   )
}

export default Structure7