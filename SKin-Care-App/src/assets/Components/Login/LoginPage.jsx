import { React, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
    const response = await fetch("http://127.0.0.1:5000/login", {
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
      <div className="max-w-md mx-auto bg-[#fffaf8] rounded-lg py-6">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="max-w-md  w-full"
        >
          <h1 className="text-2xl font-semibold mt-5 px-5 ">
            Enter Login details
          </h1>
          <div className="flex flex-col mt-10 gap-2 w-full px-5  ">
            <label className="text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your Mobile number"
              className={`w-full shadow-2xl bg-[#fcf9f7] mt-2 px-3 h-10 rounded-lg border ${
                errors.Phone
                  ? "border-red-500 text-red-500"
                  : "border-black border"
              }`}
              value={loginDetails.Phone}
              onChange={(e) => {
                setLoginDetails({ ...loginDetails, Phone: e.target.value });
                setErrors((prev) => ({ ...prev, Phone: "" }));
              }}
            />
            {errors.Phone && (
              <p className="text-red-500 text-sm mt-1">{errors.Phone}</p>
            )}
            <label className="text-sm  font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className={`w-full shadow-2xl bg-[#ffffff] mt-2 px-3 h-10 rounded-lg border  ${
                errors.password
                  ? "border-red-500 text-red-500"
                  : "border-black border"
              }`}
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
            <button
              type="submit"
              className="w-full flex items-center justify-center  bg-[#d85167] h-10 rounded-md text-white text-lg"
              onSubmit={() => {

              }}
            >
              Login
            </button>
          </div>
        </form>
        <div className=" w-full flex flex-col gap-3 px-5 mt-5 ">
          <h1 className="text-md flex justify-center ">
            Don't have an account?
          </h1>
                  <Link to="/signup" className="flex justify-center items-center bg-[#d85167] h-10 rounded-md text-white ">
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
