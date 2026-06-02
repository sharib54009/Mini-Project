import React from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

const AddProducts = () => {
  return (
    <div className='px-3 mt-5'>
      <Link to="/products">
        <div className='app-card-sm py-4 w-full flex flex-col justify-center items-center gap-2'>
          <Plus />
          <h1 className='text-base font-semibold'>Add Products</h1>
        </div>
      </Link>
    </div>
  );
};

export default AddProducts
