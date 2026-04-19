import React from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

const Step1 = ({
  switchToLogin,
  handleNext,
  handleBack,
  handleGenderSelection,
  errors,
  setErrors,
  userData,
  setUserData,
  step,
}) => {
  return (
    <div>
      {step == 1 && (
        <div>
          <div className="mb-6">
            <User className="bg-[#d85167] rounded-full p-2 h-10 w-10 text-white " />
            <h1 className="text-xl font-semibold mt-3">
              Let us get to know you
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Tell us about yourself so that we can personalize your skin care
              journey.
            </p>
          </div>

          <div className="mb-4">
            <label className="text-sm  font-medium">Your Name</label>
            <input
              className={`w-full px-3 shadow-2xl h-10 mt-2 bg-[#fcf9f7] rounded-lg border ${
                errors.name
                  ? "border-red-500 text-red-500"
                  : "border-black border"
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
              className={`w-full shadow-2xl px-3 h-10 mt-2 bg-[#fcf9f7] rounded-lg border ${
                errors.age
                  ? "border-red-500 text-red-500"
                  : "border-black border"
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
                      ? "bg-[#d85167] text-white "
                      : "bg-[#fcf9f7] text-gray-600 border"
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
            className="w-full  bg-[#d85167] active:scale-90 text-white py-2 rounded-md"
          >
            Continue
          </button>

          <div className=" w-full flex flex-col gap-3  mt-5 ">
            <h1 className="text-md flex justify-center ">
              Already have an account?
            </h1>
            {/* <button
              onClick={() => {
                switchToLogin();
              }}
              className="flex justify-center items-center bg-[#d85167] h-10 rounded-md text-white "
            >
              Sign in
            </button> */}
            <Link to="/" className="flex justify-center items-center bg-[#d85167] h-10 rounded-md text-white ">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1;
