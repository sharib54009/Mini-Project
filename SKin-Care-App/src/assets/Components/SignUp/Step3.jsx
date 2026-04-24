import React from "react";

const skinProblems = [
  "Acne",
  "Dark Spots / Pigmentation",
  "Dryness",
  "Oiliness",
  "Dull Skin",
  "Blackheads / Whiteheads",
  "Sensitive Skin",
  "Uneven Skin Tone",
  "No skin problem",
];

const Step3 = ({
  userData,
  setUserData,
  handleSkinProblemSelection,
  step,
  setStep,
  errors,
  setErrors,
  handleNext,
  handleBack,
}) => {
  return (
    <div>
      {step === 3 && (
        <div>
          <h1 className="font-md px-3 text-2xl">Select Skin Problems</h1>
          <div className="flex gap-3 flex-wrap py-5">
            {skinProblems.map((problem) => (
              <button
                key={problem}
                type="button"
                onClick={() => {
                  handleSkinProblemSelection(problem);
                  setErrors((prev) => ({ ...prev, skinProblems: "" }));
                }}
                className={`w-full shadow-2xl h-12 flex justify-start items-center px-5 rounded-xl text-md border border-black 
                 ${
                   userData.skinProblems.includes(problem)
                     ? "  bg-[#d85167] text-white "
                     : "bg-[#fcf9f7] text-gray-600"
                 } ${errors.skinProblems ? "border-red-500" : ""}`}
              >
                {problem}
              </button>
            ))}
            {errors.skinProblems && (
              <p className="text-red-500  text-sm ">{errors.skinProblems}</p>
            )}

            <div className="flex w-full gap-8">
              <button
                onClick={() => {
                  handleBack();
                }}
                type="button"
                className="flex-1   h-9 rounded-full border-black bg-[#fcf9f7] text-gray-600 border active:scale-95 "
              >
                Back
              </button>
              <button
                onClick={() => {
                  handleNext();
                }}
                type="button"
                className="flex-1 h-9 rounded-full  text-white border active:scale-95 bg-[#d85167] "
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3;
