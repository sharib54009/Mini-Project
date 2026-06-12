import { React, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api/api";

const LoginPage = ({ switchToSignUp }) => {

  const navigate = useNavigate();

  const [loginDetails, setLoginDetails] = useState({
    Phone: "",
    password: "",
  });



  const [errors, setErrors] = useState({});
 const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};

  // ✅ VALIDATION FIRST
  if (!loginDetails.Phone.trim()) {
    newErrors.Phone = "Phone is required";
  } else if (isNaN(loginDetails.Phone)) {
    newErrors.Phone = "Phone must be a number";
  } else if (loginDetails.Phone.trim().length !== 10) {
    newErrors.Phone = "Phone must be 10 digits";
  }

  if (!loginDetails.password.trim()) {
    newErrors.password = "Password is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; // ❌ STOP HERE
  }

  // ✅ ONLY IF VALID → CALL API
  try {
    const response = await apiFetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Phone: loginDetails.Phone,
        password: loginDetails.password,
      }),
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      const userId = result.user_id;

      localStorage.setItem("userId", userId); // ✅ important
      navigate("/home");
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="min-h-screen bg-[#fffaf8]">
      <div className="max-w-md mx-auto bg-[#fffaf8] rounded-3xl py-6 shadow-lg border border-gray-200">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="max-w-md w-full"
        >
          <h1 className="text-2xl font-semibold mt-5 px-5">Enter Login details</h1>
          <div className="flex flex-col mt-10 gap-3 w-full px-5">
            <label className="text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your mobile number"
              className={`app-input mt-2 ${errors.Phone ? "border-red-500 text-red-500" : ""}`}
              value={loginDetails.Phone}
              onChange={(e) => {
                setLoginDetails({ ...loginDetails, Phone: e.target.value });
                setErrors((prev) => ({ ...prev, Phone: "" }));
              }}
            />
            {errors.Phone && (
              <p className="text-red-500 text-sm mt-1">{errors.Phone}</p>
            )}
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className={`app-input mt-2 ${errors.password ? "border-red-500 text-red-500" : ""}`}
              value={loginDetails.password}
              onChange={(e) => {
                setLoginDetails({ ...loginDetails, password: e.target.value });
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="mt-5 px-5">
            <button type="submit" className="app-button app-button-primary w-full text-lg">
              Login
            </button>
          </div>
        </form>
        <div className="w-full flex flex-col gap-3 px-5 mt-5">
          <h1 className="text-md flex justify-center">Don't have an account?</h1>
          <Link to="/signup" className="app-button app-button-primary w-full justify-center text-center">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
