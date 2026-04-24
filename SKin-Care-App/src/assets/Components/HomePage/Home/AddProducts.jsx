import React from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

const AddProducts = () => {
  return (
    <div className='px-3 mt-5 '>
      <Link to="/products">
      <div className=' py-3  w-full bg-white rounded-lg flex flex-col shadow-2xl mb-10 justify-center items-center'>
        <Plus />
        <h1> Add Products</h1>
      </div>
      </Link>
    </div>
  )
}

export default AddProducts
