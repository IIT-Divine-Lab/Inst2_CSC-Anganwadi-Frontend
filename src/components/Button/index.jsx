import React from 'react'

const Button = (props) => {
  return (
    <div className={`bg-[#2d8dfe] cursor-pointer font-semibold text-xl rounded-lg text-white h-12 flex items-center w-max px-10 ${props.className}`} onClick={props.onClick}>
      {props.children}
    </div>
  )
}

export default Button