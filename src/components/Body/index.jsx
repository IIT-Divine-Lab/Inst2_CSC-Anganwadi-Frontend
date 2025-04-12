import React, { useEffect, useState } from 'react'

const Body = (props) => {
  return (
    <div className={`my-10 flex justify-center items-center portrait:flex-col ${props.extraClasses}`}>
      {props.children}
    </div>
  )
}

export default Body