import React from 'react'
import { Link } from 'react-router-dom'
import { CircleArrowRight } from 'lucide-react'
const SkinCheck = () => {
  return (
    <div className=''>
      <div className='mt-3 app-card-sm px-3 py-4 flex flex-col'>
        <Link to="/skin-log" className="space-y-2">
          <h1 className='text-xs font-semibold'>TODAY'S SKIN</h1>
          <p className='text-sm flex items-center gap-2 text-[#d85167]'>
            Log today's skin condition
            <CircleArrowRight size={20} />
          </p>
        </Link>
      </div>
    </div>
  );
};

export default SkinCheck
