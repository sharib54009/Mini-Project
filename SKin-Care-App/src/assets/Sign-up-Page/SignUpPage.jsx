import React from "react";
import { User, SkipBack } from "lucide-react";
import { useState } from "react";

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    gender: "",
    skinType: "",
    skinProblems: [],
    Phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const skinTypes = ["Oily", "Dry", "Normal", "Combination"];

  const skinProblems = [
    "Acne",
    "Dark Spots / Pigmentation",
    "Dryness",
    "Oiliness",
    "Dull Skin",
    "Blackheads / Whiteheads",
    "Sensitive Skin",
    "Uneven Skin Tone",
  ];

  // Error Handling

  const handleSkinType = (type) => {
    if (userData.skinType === type) {
      setUserData({ ...userData, skinType: "" });
    } else {
      setUserData({ ...userData, skinType: type });
    }
  };

  const handleSkinProblemSelection = (problem) => {
    if (userData.skinProblems.includes(problem)) {
      setUserData({
        ...userData,
        skinProblems: userData.skinProblems.filter((p) => p !== problem),
      });
    } else {
      setUserData({
        ...userData,
        skinProblems: [...userData.skinProblems, problem],
      });
    }
  };

  const handleGenderSelection = (type) => {
    if (userData.gender === type) {
      setUserData({ ...userData, gender: "" });
    } else {
      setUserData({ ...userData, gender: type });
    }
  };

  const handleNext = () => {
    let newErrors = {};

    if (step === 1) {
      if (!userData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!userData.age.trim()) {
        newErrors.age = "Age is required";
      } else if (isNaN(userData.age)) {
        newErrors.age = "Age Must be a number";
      } else if (userData.age < 10) {
        newErrors.age = "Age must be at least 10";
      } else if (userData.age > 100) {
        newErrors.age = "Age must be less than 100";
      }
      if (!userData.gender) {
        newErrors.gender = "Gender is required";
      }
    } else if (step === 2) {
      if (!userData.skinType) {
        newErrors.skinType = "Skin type is required";
      }
    } else if (step === 3) {
      if (userData.skinProblems.length === 0) {
        newErrors.skinProblems =
          "Please select at least one skin problem before proceeding.";
      }
    }  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

setStep((prev) => prev + 1);    setErrors(newErrors);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const showUserInfo = () => {
    return userData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

  if (!userData.Phone.trim()) {
    newErrors.Phone = "Phone number is required";
  } else if(isNaN(userData.Phone)){
    newErrors.Phone = "Phone number must be number"
  } else if(userData.Phone.trim().length < 10){
    newErrors.Phone = "Phone number must be of 10 digits"
  }

  if (!userData.password.trim()) {
    newErrors.password = "Password is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  console.log("FINAL DATA:", userData);
    

   
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
                <User className="bg-[#ff1d43] rounded-full p-2 h-10 w-10 text-white " />
                <h1 className="text-xl font-semibold mt-3">
                  Lets get to know you
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Tell us about yourself so that we can personalize your skin
                  care journey.
                </p>
              </div>

              <div className="mb-4">
                <label className="text-sm  font-medium">Your Name</label>
                <input
                  className={`w-full px-3 shadow-2xl h-10 mt-2 bg-gray-50 rounded-lg border ${
                    errors.name
                      ? "border-red-500 text-red-500"
                      : "border-black border-1.5"
                  }`}
                  type="text"
                  placeholder="Enter your Name"
                  value={userData.name}
                  onChange={(e) => {
                    setUserData({ ...userData, name: e.target.value });
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Age</label>
                <input
                  className={`w-full shadow-2xl px-3 h-10 mt-2 bg-gray-50 rounded-lg border ${
                    errors.age
                      ? "border-red-500 text-red-500"
                      : "border-black border-1.5"
                  }`}
                  type="number"
                  placeholder="Enter your Age"
                  value={userData.age}
                  onChange={(e) => {
                    setUserData({ ...userData, age: e.target.value });
                    setErrors((prev) => ({ ...prev, age: "" }));
                  }}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Gender</p>
                <div className="flex gap-3">
                  {["Male", "Female", "Other"].map((type) => (
                    <button
                      onClick={() => {
                        handleGenderSelection(type);
                        setErrors((prev) => ({ ...prev, gender: "" }));
                      }}
                      key={type}
                      type="button"
                      className={`flex-1  h-9 rounded-full ${
                        userData.gender === type
                          ? "bg-[#ff1d43] text-white "
                          : "bg-gray-50 text-gray-600 border"
                      } ${errors.gender ? "border-red-500" : "border-black"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>

              <button
                onClick={() => {
                  handleNext();
                }}
                type="button"
                className="w-full  bg-[#ff1d43] active:scale-90 text-white py-2 rounded-md"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="py-5">
              <h1 className="font-semibold text-2xl px-5">Select Skin Type</h1>
              <div className="flex flex-col   py-7  gap-5">
                {skinTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleSkinType(type)}
                    className={`w-full shadow-2xl h-12 flex justify-start items-center px-5 rounded-xl text-md border ${
                      userData.skinType === type
                        ? "bg-[#ff1d43] text-white border-gray-900 "
                        : "bg-gray-50 text-gray-600"
                    } ${errors.skinType ? "border-red-500" : "border-gray-600"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.skinType && (
                <p className="text-red-500 mb-10  text-sm ">
                  {errors.skinType}
                </p>
              )}
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
              <h1 className="font-semibold px-5 text-2xl">
                Select Skin Problems
              </h1>
              <div className="flex gap-3 flex-wrap py-5">
                {skinProblems.map((problem) => (
                  <button
                    key={problem}
                    type="button"
                    onClick={() => handleSkinProblemSelection(problem)}
                    className={`w-full shadow-2xl h-12 flex justify-start items-center px-5 rounded-xl text-md border 
                 ${
                   userData.skinProblems.includes(problem)
                     ? "bg-[#ff1d43] text-white border-gray-900"
                     : "bg-gray-50 text-gray-600"
                 } ${errors.skinProblems ? "border-red-500" : "border-gray-600"}`}
                  >
                    {problem}
                  </button>
                ))}
                {errors.skinProblems && (
                  <p className="text-red-500  text-sm ">
                    {errors.skinProblems}
                  </p>
                )}

                <div className="flex w-full gap-8">
                  <button
                    onClick={() => {
                      handleBack();
                    }}
                    type="button"
                    className="flex-1   h-9 rounded-full bg-gray-50 text-gray-600 border active:scale-95 "
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
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="py-5">
                <h1 className="font-semibold px-5 text-2xl">
                  Create your account
                </h1>
                <div className="flex flex-col mt-10 gap-2 w-full px-5 shadow-2xl rounded-2xl py-10">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className={`w-full shadow-2xl px-3 h-10  bg-gray-50  rounded-lg border ${
                      errors.Phone
                        ? "border-red-500 text-red-500 border"
                        : "border-black "
                    }`}
                    value={userData.Phone}
                    onChange={(e) => {
                      setUserData({ ...userData, Phone: e.target.value });
                      setErrors((prev) => ({ ...prev, Phone: "" }));
                    }}
                  ></input>
                  {errors.Phone && (
                    <p className="text-red-500  text-sm ">{errors.Phone}</p>
                  )}
                  <label className="text-sm mt-10 font-medium">Password</label>
                  <input
                    type="password"
                    placeholder="set your password"
                    className={`w-full shadow-2xl px-3 h-10  bg-gray-50 border rounded-lg ${
                      errors.password
                        ? "border-red-500 text-red-500 border"
                        : "border-black"
                    }`}
                    value={userData.password}
                    onChange={(e) => {
                      setUserData({ ...userData, password: e.target.value });
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    
                  ></input>
                  {errors.password && (
                    <p className="text-red-500  text-sm ">{errors.password}</p>
                  )}
                </div>
                <div className="flex gap-2 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      handleBack();
                    }}
                    className="flex px-2 items-center  h-9 rounded-full bg-gray-50 text-gray-600 border active:scale-95"
                  >
                    {" "}
                    <SkipBack />{" "}
                  </button>
                  <button
                  type="submit"
                    
                    className="flex-1 h-9 rounded-full  text-white border active:scale-95 bg-[#ff1d43]"
                  >
                      
                    Start your Skin Care Journey
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* {step === 5 && (
            <div>
              <div className="flex flex-col bg-gray-200 px-3 py-10 rounded-2xl shadow-2xl gap-  ">
                <h1 className="font-semibold px-5 text-2xl">
                  Your Information
                </h1>
                <div className="py-5 gap-3 flex flex-col">
                  <p className="text-md font-semibold">
                    Name : {userData.name}
                  </p>
                  <p className="text-md font-semibold">age : {userData.age}</p>
                  <p className="text-md font-semibold">
                    Gender : {userData.gender}
                  </p>
                  <p className="text-md font-semibold">
                    Skin Type : {userData.skinType}
                  </p>
                  <p className="text-md font-semibold">
                    Skin Problems :{userData.skinProblems.join(", ")}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-10 bg-[#ff1d43] active:scale-90 text-white py-2 rounded-md"
              >
                Continue
              </button>
            </div>
          )} */}
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
