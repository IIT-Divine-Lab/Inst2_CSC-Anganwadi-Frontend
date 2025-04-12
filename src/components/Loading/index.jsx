import React from 'react'
import { TbRefresh } from "react-icons/tb";

const Loading = ({ size = 100 }) => {
  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <TbRefresh className='animate-spin' color='#2d8dfe' size={100} />
    </div>
  )
}

export default Loading