import React from "react";

const skinTypes = ["Oily", "Dry", "Normal", "Combination"];

const Step2 = ({
  handleNext,
  handleBack,
  step,
  userData,
  setUserData,
  errors,
  setErrors,
  handleSkinType,
}) => {
  return (
    <div>
      {step === 2 && (
        <div className="py-5">
          <h1 className="font-md text-2xl px-5">Select Skin Type</h1>
          <div className="flex flex-col   py-7  gap-5">
            {skinTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  handleSkinType(type);
                  setErrors((prev) => ({ ...prev, skinType: "" }));
                }}
                className={`w-full shadow-2xl h-12 flex justify-start items-center px-5 rounded-xl text-md border border-black  ${
                  userData.skinType === type
                    ? "bg-[#d85167] text-white  "
                    : "bg-[#fcf9f7] text-gray-600"
                } ${errors.skinType ? "border-red-500" : ""}`}
              >
                {type}
              </button>
            ))}
          </div>
          {errors.skinType && (
            <p className="text-red-500 mb-10  text-sm ">{errors.skinType}</p>
          )}
          <div className="flex justify-between  gap-5 ">
            <button
              onClick={() => {
                handleBack();
              }}
              type="button"
              className="flex-1  h-9 rounded-full bg-gray-50 text-gray-600 border border-black active:scale-95 "
            >
              Back
            </button>
            <button
              onClick={() => {
                handleNext();
              }}
              type="button"
              className="flex-1 h-9 rounded-full  text-white border active:scale-95 bg-[#d85167]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2;
