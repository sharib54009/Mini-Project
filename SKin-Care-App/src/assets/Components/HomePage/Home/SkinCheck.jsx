import React from 'react'
import { Link } from 'react-router-dom'
import { CircleArrowRight } from 'lucide-react'
const SkinCheck = () => {
  return (
    <div className='px-3 '> 
      <div  className='mt-3  bg-white rounded-lg px-3 py-4 flex flex-col shadow-gray shadow-2xl'>
        <Link to="/skin-log">
      <h1 className='text-xs font-semibold'>TODAY'S SKIN</h1>
      <p className='text-sm flex gap-2 text-pink-500 '>Log today's skin condition <CircleArrowRight size={20} /></p>
      </Link>
      </div>
    </div>
  )
}

export default SkinCheck
