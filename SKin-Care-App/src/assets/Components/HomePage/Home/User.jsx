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
      <h1 className="text-3xl font-bold tracking-tight leading-tight">
        {getGreeting()}
      </h1>
      <span className="text-gray-500 text-lg mt-2 font-medium">{userName} 👋</span>
    </div>
  );
};

export default User
