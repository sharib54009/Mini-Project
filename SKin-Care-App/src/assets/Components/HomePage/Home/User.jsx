import React from 'react'

const User = ({ userName }) => {

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className='flex flex-col px-4'>
      <h1 className="text-lg   font-semibold">
      {getGreeting()}
      
    </h1>
    <span className="text-gray-500 font-bold text-xl"> {userName} 👋</span>
    </div>
  );
};

export default User
