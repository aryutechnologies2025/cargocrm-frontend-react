import { LuUser } from "react-icons/lu";
import { SlLock } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Footer from "../components/Footer";
import { API_URL } from "../Config";
import { CAPCHA_URL } from "../Config";
import { useState } from "react";
import Cookies from "js-cookie";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import cargo from "../assets/logimg.jpg";
import cargoLogo from "../assets/cargoLord_logo.png"

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
      errors.email = "Email is required";
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
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden ">


      {/* middle */}
      <div className="flex flex-1 flex-col md:flex-row overflow-y-auto">
        <div className="hidden md:block md:w-1/2 h-screen">
          <img
            src={cargo}
            alt="Cargo"
            className="w-full h-full object-cover p-3"
          />
        </div>

        <div className="w-full md:w-1/2 md:gap-6 basis-[60%] lg:basis-[50%] flex flex-col items-center justify-center gap-3">
          <div className="mb-24 md:mb-10">
            <img className="w-full h-auto" src={cargoLogo} alt="Cargo Lord Logo" />
          </div>
          <div className="gap-2 mb-5 items-center flex flex-col">
            <p className="text-[#000000] font-bold md:mb-5 text-md md:text-lg">
              LOG IN
            </p>

            <div className="md:w-[400px] mb-3">
              <div className="shadow-sm relative flex items-center gap-3 bg-[#b8b8b8] px-4 py-5 rounded-lg">
                <LuUser className="text-xl text-white" />

                <input
                  type="email"
                  name="email"
                  placeholder="Username"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 w-full border-none outline-none bg-transparent text-white placeholder-white"
                />
              </div>

              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="md:w-[400px] mb-3">
              <div className="shadow-sm relative flex items-center gap-3 bg-[#b8b8b8] px-4 py-5 rounded-lg">
                <SlLock className="text-xl text-white" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="flex-1 w-full border-none outline-none bg-transparent text-white placeholder-white pr-10"
                />

                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 cursor-pointer text-white"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.password}
                </p>
              )}
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
              className="font-bold mt-3 text-sm bg-gradient-to-r from-[#ff7930] to-[#fa803d] px-5 py-2 md:px-14 md:py-4 rounded-lg text-white"
            >
              Log In
            </button>
          </div>

          <ReCAPTCHA
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


      </div>

      {/* footer */}

      <Footer />
    </div>
  );
};

export default Login;
