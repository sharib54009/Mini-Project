import React from "react";
import { User } from "lucide-react";
import { useState } from "react";

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    gender: "",
    skinType: "",
    skinProblems: [],
  });

  const skinTypes = ["Oily", "Dry", "Normal", "Combination"];

  const handleSkinType = (type) => {
   if(userData.skinType === type){
    setUserData({...userData, skinType:""})
   }
   else{
    setUserData({...userData, skinType: type})
   }
  };

  const skinProblems = [
  "Acne",
  "Dark Spots / Pigmentation",
  "Dryness",
  "Oiliness",
  "Dull Skin",
  "Blackheads / Whiteheads",
  "Sensitive Skin",
  "Uneven Skin Tone"
];

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleGenderSelection = (type) => {
    if(userData.gender === type ) {
      setUserData({...userData, gender:""})
    } else {
      setUserData({...userData, gender:type})
    }
  }

  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userData);
    setUserData({
      name: "",
      age: "",
      gender: "",
      skinType: "",
    });

    // const userInfo = { name, age, gender };
    // setUserData([...userData, userInfo]);

    // const data =  localStorage.setItem("userData", JSON.stringify([...userData, userInfo]));
    // const getData = JSON.parse(localStorage.getItem("userData"));
    // console.log(getData)
    // console.log("Form submitted")
    // setName("");
    // setAge("");
    // setGender("");
  };
  return (
    <div className="min-h-screen bg-white ">
      <div className="max-w-md mx-auto bg-white rounded-lg py-6">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="w-full max-w-md px-6"
        >
          {step == 1 && (
            <div>
              <div className="mb-6">
                <User className="bg-[#ff1d43] rounded-full p-2 h-10 w-10 text-white" />
                <h1 className="text-xl font-semibold mt-3">
                  Lets get to know you
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Tell us about yourself so that we can personalize your skin
                  care journey.
                </p>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Your Name</label>
                <input
                  className="w-full px-3 h-10 mt-2 bg-gray-50 text-gray-900 rounded-lg border"
                  type="text"
                  placeholder="Enter your Name"
                  value={userData.name}
                  onChange={(e) => {
                    setUserData({ ...userData, name: e.target.value });
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Age</label>
                <input
                  className="w-full px-3 h-10 mt-2 bg-gray-50 text-gray-900 rounded-lg border"
                  type="text"
                  placeholder="Enter your Age"
                  value={userData.age}
                  onChange={(e) => {
                    setUserData({ ...userData, age: e.target.value });
                  }}
                />
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Gender</p>
                <div className="flex gap-3">
                  {["Male", "Female", "Other"].map((type) => (
                    <button
                    onClick={() => handleGenderSelection(type)}
                    key={type}
                    type="button"
                    className={`flex-1 h-9 rounded-full ${userData.gender === type ? "bg-[#ff1d43] text-white border-gray-900 border-2"
                        : "bg-gray-50 text-gray-600"}`}>{type}</button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  handleNext();
                }}
                type="button"
                className="w-full bg-[#ff1d43] active:scale-90 text-white py-2 rounded-md"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="py-6">
              <h1 className="font-semibold text-2xl px-5">Select Skin Type</h1>
              <div className="flex flex-col   py-10 gap-5">
                {skinTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => 
                      handleSkinType(type)
                    }
                    className={`w-full h-12 flex justify-start items-center px-5 rounded-xl text-md border ${
                      userData.skinType === type
                        ? "bg-[#ff1d43] text-white border-gray-900 border-2"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex justify-between  gap-5 ">
                <button
                  onClick={() => {
                    handleBack();
                  }}
                  type="button"
                  className="flex-1  h-9 rounded-full bg-gray-50 text-gray-600 border active:scale-95 "
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    handleNext();
                  }}
                  type="button"
                  className="flex-1 h-9 rounded-full  text-white border active:scale-95 bg-[#ff1d43] "
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="font-semibold px-5 text-2xl">Select Skin Problems</h1>
              {skinProblems.map((problem) => (
                <button 
                 key = "problem"
                 type ="button"
                 
                 className="">

                 </button>
              )) }
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
