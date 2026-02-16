import login_image from "../assets/login_image.svg";
import aero from "../assets/aero.jpg";
import cargo from "../assets/Cargos.svg"
import { LuUser } from "react-icons/lu";
import { SlLock } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import medics_logo from "../assets/medics_logo.svg";
import Footer from "../components/Footer";
import cargoLord from "../assets/cargoLord_logo.png";

const Login = () => {
  let navigate = useNavigate();

  function onCLickLogin() {
    navigate("/dashboard");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }
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

          <div className="flex md:w-[450px] gap-3 items-center bg-[#e6f2fa] px-4 py-3 rounded-2xl">
            <LuUser className="text-2xl text-[#057fc4]" />
            <input
              type="text"
              placeholder="Username"
              name=""
              id=""
              className="border-none outline-none bg-transparent text-black placeholder-black"
            />
          </div>

          <div className="flex md:w-[450px] gap-3 items-center bg-[#e6f2fa] px-4 py-3 rounded-2xl">
            <SlLock className="text-2xl text-[#057fc4]" />
            <input
              type="password"
              placeholder="Password"
              name=""
              id=""
              className="border-none outline-none bg-transparent text-black placeholder-black"
            />
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
