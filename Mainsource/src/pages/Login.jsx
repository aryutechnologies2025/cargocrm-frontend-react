import login_image from "../assets/login_image.svg";
import aero from "../assets/aero.jpg";
import cargo from "../assets/Cargos.svg"
import { LuUser } from "react-icons/lu";
import { SlLock } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Footer from "../components/Footer";
import cargoLord from "../assets/cargoLord_logo.png";
import axios from "axios";
import { API_URL} from "../Config";
import {CAPCHA_URL } from "../Config";
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
  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const validateLoginForm = () => {
    let errors = {};

    if (!formData.email.trim()) {
      errors.email = "Username (Email) is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    // console.log("Captcha value:", value);
  };


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

    // Validate username & password first
    if (!validateLoginForm()) return;

    // Check captcha
    if (!captchaValue) {
      setError("Please verify that you are not a robot.");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `${API_URL}/api/auth/login`,
        formData
      );

      if (res.data.success) {
        localStorage.setItem("cargouser", JSON.stringify(res.data.user));
        localStorage.setItem("admin_token", res.data.token);
        localStorage.setItem("loginTime", Date.now());

        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1 w-[450px]">
                {formErrors.email}
              </p>
            )}

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

          <ReCAPTCHA
            // sitekey="6LdBR6wqAAAAAKiqjNXKIxWOyBtdn3Vx_-MdRc8-" //local
           sitekey={CAPCHA_URL} //live
            onChange={handleCaptchaChange}
          />
          {error && (
           <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          

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
