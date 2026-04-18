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
            <div className="flex flex-col mt-10 gap-2 w-full">
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className={`w-full shadow-2xl px-3 h-10  bg-[#fcf9f7]  rounded-lg border ${
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
              <label className="text-sm mt-5 font-medium">Password</label>
              <input
                type="password"
                placeholder="set your password"
                className={`w-full shadow-2xl px-3 h-10  bg-[#fcf9f7] border rounded-lg ${
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
                className="flex px-2 items-center border-black  h-9 rounded-lg bg-gray-50 text-gray-600 border active:scale-95"
              >
                {" "}
                <SkipBack />{" "}
              </button>
              <button
                type="submit"
                className="flex-1 h-9 rounded-lg items-center  text-md px-  text-white border active:scale-95 bg-[#d85167]"
              >
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
