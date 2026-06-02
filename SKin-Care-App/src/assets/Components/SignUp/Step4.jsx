import React from "react";
import { SkipBack } from "lucide-react";

const Step4 = ({
  userData,
  setUserData,
  errors,
  setErrors,
  handleBack,
  step,
  setStep,
}) => {
  return (
    <div>
      {step === 4 && (
        <div>
          <div className="py-5">
            <h1 className="font-md px-3 text-2xl">Create your account</h1>
            <div className="flex flex-col mt-10 gap-3 w-full">
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className={`app-input ${errors.Phone ? "border-red-500 text-red-500" : ""}`}
                value={userData.Phone}
                onChange={(e) => {
                  setUserData({ ...userData, Phone: e.target.value });
                  setErrors((prev) => ({ ...prev, Phone: "" }));
                }}
              />
              {errors.Phone && (
                <p className="text-red-500 text-sm">{errors.Phone}</p>
              )}
              <label className="text-sm mt-5 font-medium">Password</label>
              <input
                type="password"
                placeholder="Set your password"
                className={`app-input ${errors.password ? "border-red-500 text-red-500" : ""}`}
                value={userData.password}
                onChange={(e) => {
                  setUserData({ ...userData, password: e.target.value });
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div className="flex gap-2 mt-8">
              <button
                type="button"
                onClick={() => {
                  handleBack();
                }}
                className="app-button app-button-secondary flex items-center gap-2 h-11"
              >
                <SkipBack />
              </button>
              <button type="submit" className="app-button app-button-primary flex-1 h-11">
                Start your Skin Care Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4;
