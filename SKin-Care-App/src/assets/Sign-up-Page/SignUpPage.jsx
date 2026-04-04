import React from "react";
import { User } from "lucide-react";
import { useState } from "react";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [userData, setUserData] = useState([]);

 
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userInfo = { name, age, gender };
    setUserData([...userData, userInfo]);
    const updatedData = setData.push(userInfo)

    const data =  localStorage.setItem("userData", JSON.stringify(updatedData));
    const getData = JSON.parse(localStorage.getItem("userData"));
    console.log(getData)
    console.log("Form submitted")
    setName("");
    setAge("");
    setGender("");

  }
  return (
    <div className="min-h-screen bg-white pt-6">
      <form onSubmit={(e) => {
        handleSubmit(e)
      }} className="w-full max-w-md px-6">
        
        {/* Header */}
        <div className="mb-6">
          <User className="bg-[#ff1d43] rounded-full p-2 h-10 w-10 text-white" />
          <h1 className="text-xl font-semibold mt-3">
            Lets get to know you
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tell us about yourself so that we can personalize your skin care journey.
          </p>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm font-medium">Your Name</label>
          <input
            className="w-full px-3 h-10 mt-2 bg-gray-50 text-gray-900 rounded-lg border"
            type="text"
            placeholder="Enter your Name"
            value= {name}
            onChange={(e) => {
            setName(e.target.value)
          }} 
          />
        </div>

        {/* Age */}
        <div className="mb-4">
          <label className="text-sm font-medium">Age</label>
          <input
            className="w-full px-3 h-10 mt-2 bg-gray-50 text-gray-900 rounded-lg border"
            type="text"
            placeholder="Enter your Age"
            value={age}
            onChange={(e) => {
            setAge(e.target.value)
          }} 
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Gender</p>
          <div className="flex gap-3">
            <button onClick={() => setGender("Male")} type="button" className="flex-1 h-9 rounded-full bg-gray-50 text-gray-600 border active:scale-95">
              Male
            </button>
            <button onClick={() => setGender("Female")} type="button" className="flex-1 h-9 rounded-full bg-gray-50 text-gray-600 border active:scale-95">
              Female
            </button>
            <button onClick={() => setGender("Other")} type="button" className="flex-1 h-9 rounded-full bg-gray-50 text-gray-600 border active:scale-95">
              Other
            </button>
          </div>
        </div>

        {/* Button */}
        <button type="submit" className="w-full bg-[#ff1d43] active:scale-90 text-white py-2 rounded-md">
          Continue
        </button>

      </form>
    </div>
  );
};

export default SignUpPage;