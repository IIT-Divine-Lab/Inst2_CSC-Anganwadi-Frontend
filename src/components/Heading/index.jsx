import React from 'react'

const Heading = (props) => {
  return (
    <div>
      <h3 className='text-center text-2xl'>
        {props.children}
      </h3>
    </div>
  )
}

export default Heading