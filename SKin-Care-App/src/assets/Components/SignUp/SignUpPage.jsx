import React from "react";
import { useState } from "react";
import { SkipBack } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";




const SignUpPage = ({ switchToLogin }) => {
  const navigate = useNavigate();
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

  // Error Handling

  const handleSkinType = (type) => {
    if (userData.skinType === type) {
      setUserData({ ...userData, skinType: "" });
    } else {
      setUserData({ ...userData, skinType: type });
    }
  };

  const handleSkinProblemSelection = (problem) => {
    let updated = [...(userData.skinProblems || [])];

    if (problem === "No skin problem") {
      // ✅ ONLY this remains
      updated = ["No skin problem"];
    } else {
      // ✅ Remove "No skin problem" if selecting others
      updated = updated.filter((p) => p !== "No skin problem");

      if (updated.includes(problem)) {
        // toggle OFF
        updated = updated.filter((p) => p !== problem);
      } else {
        // toggle ON
        updated.push(problem);
      }
    }

    setUserData({
      ...userData,
      skinProblems: updated,
    });
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
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStep((prev) => prev + 1);
    setErrors(newErrors);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};

  if (!userData.Phone.trim()) {
    newErrors.Phone = "Phone is required";
  }

  if (!userData.password.trim()) {
    newErrors.password = "Password is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        age: userData.age,
        Phone: userData.Phone,
        password: userData.password,
        gender: userData.gender,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message);
      return;
    }

    const userId = result.user_id;

    await fetch("http://127.0.0.1:5000/userdetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        skinType: userData.skinType,
        skinProblems: userData.skinProblems,
      }),
    });

    alert("Signup successful 🎉");

    // ✅ correct navigation
    navigate("/");

  } catch (error) {
    console.error("Error:", error);
  }
};
  return (
    <div className="min-h-screen bg-[#fffaf8]">
      <div  className="max-w-md mx-auto bg-[#fffaf8] rounded-lg py-6">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="w-full max-w-md px-6"
        >
          <Step1
            switchToLogin={switchToLogin}
            handleNext={handleNext}
            handleBack={handleBack}
            handleGenderSelection={handleGenderSelection}
            errors={errors}
            setErrors={setErrors}
            userData={userData}
            setUserData={setUserData}
            step={step}
            setStep={setStep}
          />

          <Step2
            errors={errors}
            setErrors={setErrors}
            handleNext={handleNext}
            handleBack={handleBack}
            userData={userData}
            setUserData={setUserData}
            step={step}
            setStep={setStep}
            handleSkinType={handleSkinType}
          />

          <Step3
            userData={userData}
            setUserData={setUserData}
            step={step}
            setStep={setStep}
            handleSkinProblemSelection={handleSkinProblemSelection}
            errors={errors}
            setErrors={setErrors}
            handleBack={handleBack}
            handleNext={handleNext}
          />

          <Step4
            userData={userData}
            setUserData={setUserData}
            errors={errors}
            setErrors={setErrors}
            handleBack={handleBack}
            step={step}
            setStep={setStep}
          />
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
