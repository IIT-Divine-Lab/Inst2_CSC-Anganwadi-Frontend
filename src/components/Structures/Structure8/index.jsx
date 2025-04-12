import React, { useEffect, useRef, useState } from 'react'
import "./style.css"
import Heading from '../../Heading';
import Body from '../../Body';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';
import { ImUndo } from "react-icons/im";
import { FiTrash2 } from "react-icons/fi";

const Structure8 = ({ setStartTime, question, showGrid, stageRef }) => {
  const [lines, setLines] = useState([]);
  const [redoLines, setRedoLines] = useState([]); // Track lines for redo
  const [cursorPosition, setCursorPosition] = useState({ x: -10, y: -10 }); // initial off-canvas
  const isDrawing = useRef(false);

  const stageWidth = 350;
  const stageHeight = 350;
  const gridSize = 30;

  const handleStartDrawing = (e) => {
    e.evt.preventDefault(); // Prevent default touch actions
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], stroke: '#ff0000' }]);
    setRedoLines([]); // Clear redo stack on new draw action
  };

  const handleDraw = (e) => {
    e.evt.preventDefault(); // Prevent default touch actions
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    setCursorPosition(point); // Update cursor position

    if (!isDrawing.current) return;

    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point?.x, point?.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseEnter = (e) => {
    // Update cursor position when the mouse enters the Stage
    const point = e.target.getStage().getPointerPosition();
    setCursorPosition(point);
  };

  const handleMouseLeave = () => {
    // Hide cursor by moving it off the canvas when the mouse leaves the Stage
    setCursorPosition({ x: -10, y: -10 });
  };

  const handleEndDrawing = (e) => {
    e.evt.preventDefault(); // Prevent default touch actions
    isDrawing.current = false;
  };

  // Undo function
  const handleUndo = () => {
    if (lines.length === 0) return;
    const lastLine = lines.pop();
    setRedoLines([...redoLines, lastLine]); // Save last line for redo
    setLines(lines.concat());
  };

  // Redo function
  // eslint-disable-next-line
  const handleRedo = () => {
    if (redoLines.length === 0) return;
    const lastRedoLine = redoLines.pop();
    setLines([...lines, lastRedoLine]);
  };

  const handleEraseAll = () => {
    setRedoLines([]);
    setLines([]);
  }

  useEffect(() => {
    handleEraseAll()
  }, [question])

  // Gridlines function
  const renderGridLines = () => {
    const lines = [];
    for (let i = 0; i <= stageWidth / gridSize; i++) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * gridSize, 0, i * gridSize, stageHeight]}
          stroke="#ddd"
          strokeWidth={2}
        />
      );
    }
    for (let j = 0; j <= stageHeight / gridSize; j++) {
      lines.push(
        <Line
          key={`h-${j}`}
          points={[0, j * gridSize, stageWidth, j * gridSize]}
          stroke="#ddd"
          strokeWidth={2}
        />
      );
    }
    return lines;
  };

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

  return (
    <>
      <Heading>
        {question.questionText}
      </Heading>
      <Body>
        <div>
          <img onLoad={() => setStartTime(Date.now())} style={{ height: "300px", width: "auto" }} className='quesImageAfter' src={question.questionImage.after !== undefined ? getSourceURL(question.questionImage.after) : undefined} alt="" />
        </div>
        <div className='landscape:ml-10 portrait:mt-10' style={{ position: "relative" }}>
          <Stage
            width={stageWidth}
            height={stageHeight}
            onLoad={() => setStartTime(Date.now())}
            onMouseDown={handleStartDrawing}
            onMousemove={handleDraw}
            onMouseup={handleEndDrawing}
            onTouchStart={handleStartDrawing}
            onTouchMove={handleDraw}
            onTouchEnd={handleEndDrawing}
            onMouseEnter={handleMouseEnter} // Show cursor on enter
            onMouseLeave={handleMouseLeave} // Hide cursor on leave
            ref={stageRef}
            style={{ zIndex: 98 }}
          >
            <Layer listening={false}>
              {/* Gridlines */}
              {showGrid && renderGridLines()}
              {/* Border */}
              <Rect
                x={0}
                y={0}
                width={stageWidth}
                height={stageHeight}
                stroke="black"
                strokeWidth={5}
              />
            </Layer>
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.stroke}
                  strokeWidth={6}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              ))}
              <Circle
                x={cursorPosition?.x}
                y={cursorPosition?.y}
                radius={5} // Adjust for desired cursor size
                fill="#f00" // Customize color as desired
                opacity={0.7} // Slight transparency for better visibility
                listening={false} // Ensure it's not interactive
              />
            </Layer>
          </Stage>
          <div style={{ position: "absolute", top: "5px", right: "5px", zIndex: "99", display: "flex" }}>
            <ImUndo className={lines.length ? 'active actionBtn' : 'actionBtn'} onClick={() => { if (lines) handleUndo(); }} />
            <ImUndo className={redoLines.length ? 'active actionBtn middle' : 'actionBtn middle'} onClick={() => { if (redoLines) handleRedo(); }} />
            <FiTrash2 className={lines.length || redoLines.length ? 'active actionBtn' : 'actionBtn'} onClick={() => { if (lines.length || redoLines.length) handleEraseAll(); }} />
          </div>
        </div>
      </Body>
    </>
  )
}

export default Structure8