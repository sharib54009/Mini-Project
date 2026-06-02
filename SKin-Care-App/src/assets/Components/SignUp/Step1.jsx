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
            <label className="text-sm font-medium">Your Name</label>
            <input
              className={`app-input mt-2 ${errors.name ? "border-red-500 text-red-500" : ""}`}
              type="text"
              placeholder="Enter your name"
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
              className={`app-input mt-2 ${errors.age ? "border-red-500 text-red-500" : ""}`}
              type="number"
              placeholder="Enter your age"
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
                  className={`flex-1 h-11 app-pill ${
                    userData.gender === type
                      ? "app-pill-selected"
                      : "bg-[var(--surface-soft)] text-gray-600"
                  } ${errors.gender ? "border-red-500" : ""}`}
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
            className="app-button app-button-primary w-full"
          >
            Continue
          </button>

          <div className="w-full flex flex-col gap-3 mt-5">
            <h1 className="text-md flex justify-center">Already have an account?</h1>
            <Link to="/" className="app-button app-button-primary w-full justify-center text-center">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1;
