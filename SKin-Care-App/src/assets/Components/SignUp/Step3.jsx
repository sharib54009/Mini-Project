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
          <div className="flex flex-col gap-4 py-5">
            {skinProblems.map((problem) => (
              <button
                key={problem}
                type="button"
                onClick={() => {
                  handleSkinProblemSelection(problem);
                  setErrors((prev) => ({ ...prev, skinProblems: "" }));
                }}
                className={`w-full h-12 flex items-center px-5 rounded-2xl text-md transition ${
                  userData.skinProblems.includes(problem)
                    ? "app-button app-button-primary"
                    : "app-button app-button-secondary"
                } ${errors.skinProblems ? "border-red-500" : ""}`}
              >
                {problem}
              </button>
            ))}
            {errors.skinProblems && (
              <p className="text-red-500 text-sm">{errors.skinProblems}</p>
            )}

            <div className="flex w-full gap-4">
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
        </div>
      )}
    </div>
  );
};

export default Step3;
