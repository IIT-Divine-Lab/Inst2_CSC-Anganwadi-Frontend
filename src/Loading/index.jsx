import React from 'react'
import ReactLoading from 'react-loading';

const Loading = ({ color, height, width }) => {
   return (
      <div style={{ height: height ? height : "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
         <ReactLoading type={"spinningBubbles"} color={color ? color : "#162d3a"} width={width ? width : 100} />
      </div>
   )
}

export default Loading