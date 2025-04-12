import React from 'react'

const Heading = (props) => {
  return (
    <div>
      <h3 className='text-center text-2xl font-black'>
        {props.children}
      </h3>
    </div>
  )
}

export default Heading