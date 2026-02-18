import login_image from "../assets/login_image.svg";
import aero from "../assets/aero.jpg";
import cargo from "../assets/Cargos.svg"
import { LuUser } from "react-icons/lu";
import { SlLock } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import cargoLord from "../assets/cargoLord_logo.png";

import axios from "axios";
import { API_URL } from "../Config";
import { useState } from "react";
import Cookies from "js-cookie";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";

const Login = () => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
  email: "",
  password: ""
});

const [error, setError] = useState(null);

  // function onCLickLogin() {
  //   navigate("/dashboard");

  //   window.scrollTo({
  //     top: 0,
  //     behavior: "instant",
  //   });
  // }

    const onCLickLogin = async (e) => {
  e.preventDefault();
  setError(null);

  try {
   const res = await axiosInstance.post(
      `${API_URL}/api/auth/login`,
      formData,
      
    );

     if (res.data.success) {
      localStorage.setItem(
        "cargouser",
        JSON.stringify(res.data.user)
      );
      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("loginTime", Date.now());

      navigate("/dashboard", { replace: true });
    }
  } catch (err) {
    setError(
      err.response?.data?.message || "Login failed"
    );
  }
};

  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

  const handleKeyUp = (event) => {
    setError("");
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility state
  };
const activeClass = "underline font-bold text-blue-600";
const inactiveClass = "hover:underline";

  return (
    <div className="min-h-screen flex flex-col justify-between">

      {/* top */}
      <div className="py-4 md:py-6 flex  items-center justify-center pt-3">
        {/* <p className="font-bold text-md md:text-2xl text-[#057fc4] text-center pt-10">
          CARGO LORD
        </p> */}
        <img className="max-w-md h-auto" src={cargoLord} alt="Cargo Lord logo" />
      </div>

      {/* middle */}
      <div className="flex-1 flex-col-reverse md:flex-row gap-8 px-4 md:px-10 flex items-center flex-wrap-reverse justify-center mt-10 md:mt-10 ">
        <div className="w-full md:w-1/2 md:gap-6 basis-[60%] lg:basis-[50%] flex flex-col items-center justify-center gap-3">
          <p className="text-[#057fc4] font-bold text-md md:text-2xl">
            LOGIN
          </p>

          <div className="relative flex md:w-[450px] gap-3 items-center bg-[#e6f2fa] px-4 py-3 rounded-2xl">
            <LuUser className="text-2xl text-[#057fc4]" />
            <input
              type="email"
              name="email"
              placeholder="Username"
              value={formData.email}
              onChange={handleChange}
              id=""
              className="border-none outline-none bg-transparent text-black placeholder-black"
            />
          </div>

          <div className="relative flex md:w-[450px] gap-3 items-center bg-[#e6f2fa] px-4 py-3 rounded-2xl">
            <SlLock className="text-2xl text-[#057fc4]" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              name="password"
              id=""
               onKeyUp={handleKeyUp}
              className="border-none outline-none bg-transparent text-black placeholder-black"
            />
            <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 cursor-pointer text-gray-600"
                >
                  {showPassword ? (
                    <FaEye className="text-xl" />
                  ) : (
                    <FaEyeSlash className="text-xl" />
                  )}
                </span>
          </div>

          <button
            onClick={onCLickLogin}
            className="font-bold mt-3 text-sm bg-gradient-to-r from-[#057fc4] to-[#1492db] px-10 py-5 rounded-2xl text-white"
          >
            Login Now
          </button>
        </div>

        <div className="w-full md:w-1/2 justify-center hidden md:flex basis-[40%]">
          <img className="w-[80%] max-w-md h-auto rounded-2xl " src={cargo} alt="Cargo Lord Img" />
        </div>
      </div>

      {/* footer */}

      <Footer />
    </div>
  );
};

export default Login;
