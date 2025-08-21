import React, { useEffect, useState } from "react";
import Logo from "../assets/FarmLogo.svg";
import Eye from "../assets/eye.svg";
function Login() {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    const API = import.meta.env.VITE_BASE_API;
    alert(API);
  }, []);
  //submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login successfully!");
  };
  return (
    <div className="text-black w-screen  h-screen flex flex-col items-center justify-center ">
      <div className="w-[35%] h-auto shadow-[var(--custom-shadow)] rounded-2xl overflow-hidden px-12 pt-[56px] pb-10 bg-white">
        {/* logo */}
        <div className="flex flex-col">
          <img src={Logo} alt="farmLogo" className="w-[250px] h-auto" />
          <div className="text-[#ADADAD] text-lg">
            Log in to your account to manage everything
          </div>
        </div>
        <div className="mt-[32px]">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2.5">
              <label htmlFor="username" className="font-medium text-[#566074]">
                Username
              </label>
              <div className="w-full border-[2px] rounded-md flex border-[#ADADAD]">
                <input
                  placeholder="Type your username"
                  type="text"
                  name="username"
                  id="username"
                  className="w-full  border-[#ADADAD] p-4 rounded-md outline-0"
                />
              </div>
            </div>
            <div className="flex flex-col mt-[23px] gap-2.5">
              <label htmlFor="password" className="font-medium text-[#566074]">
                Password
              </label>
              <div className="w-full border-[2px] rounded-md flex border-[#ADADAD]">
                <input
                  type={`${hidden ? "password" : "text"}`}
                  name=""
                  placeholder="Type your password"
                  id="password"
                  className="w-[90%]  border-[#ADADAD] p-4 rounded-md outline-0"
                />
              </div>
            </div>
            <div className="mt-[32px] flex justify-between items-center">
              <div className="flex items-center justify-center gap-2 text-[#ADADAD]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox rounded-xs size-[18px] border-[#ADADAD]  checked:bg-[#16A34A] checked:text-white"
                />
                <label htmlFor="">Show password</label>
              </div>
              <div className="text-blue-500 underline">
                <span className="font-medium">Forgot password?</span>
              </div>
            </div>
            <button
              className="w-full bg-[#16A34A] py-[20px] text-xl mt-[32px] font-bold text-white rounded-md cursor-pointer"
              type="submit"
            >
              Log In
            </button>
          </form>
          <div className="mt-[32px] flex flex-col gap-[32px] items-center">
            <div className="w-full h-[1px] bg-[#E8E8E8]"></div>
            <span className="text-[#ADADAD]">
              Don’t have an account?{" "}
              <span className="text-[#16A34A] underline fot-">Sign Up</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
