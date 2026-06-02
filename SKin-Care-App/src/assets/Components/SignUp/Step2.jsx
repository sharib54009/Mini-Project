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
          <div className="flex flex-col py-7 gap-4">
            {skinTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  handleSkinType(type);
                  setErrors((prev) => ({ ...prev, skinType: "" }));
                }}
                className={`w-full h-12 flex items-center px-5 rounded-2xl text-md transition ${
                  userData.skinType === type
                    ? "app-button app-button-primary"
                    : "app-button app-button-secondary"
                } ${errors.skinType ? "border-red-500" : ""}`}
              >
                {type}
              </button>
            ))}
          </div>
          {errors.skinType && (
            <p className="text-red-500 mb-10 text-sm">{errors.skinType}</p>
          )}
          <div className="flex justify-between gap-5">
            <button
              onClick={() => {
                handleBack();
              }}
              type="button"
              className="app-button app-button-secondary flex-1 h-11"
            >
              Back
            </button>
            <button
              onClick={() => {
                handleNext();
              }}
              type="button"
              className="app-button app-button-primary flex-1 h-11"
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
