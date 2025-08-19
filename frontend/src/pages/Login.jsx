import React from "react";
import Logo from "../assets/FarmLogo.svg";
function Login() {
  return (
    <div className="text-black w-screen  h-screen flex flex-col items-center justify-center ">
      <div className="w-[50%] h-auto shadow-[var(--custom-shadow)] rounded-lg overflow-hidden p-4 bg-white">
        {/* logo */}
        <div className="flex flex-col">
          <img src={Logo} alt="farmLogo" className="w-[150px] h-[35px]" />
          <div className="text-[#ADADAD] text-xs">
            Log in to your account to manage everything
          </div>
        </div>
        <div>
          <form action="">
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" name="" id="username" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="text" name="" id="password" />
            </div>
            <div>
              <div>
                <input type="text" name="" id="" />
                <label htmlFor=""></label>
              </div>
              <div>
                <span>Forgot password?</span>
              </div>
            </div>
            <button>Log In</button>
          </form>
          <div>
            <span>
              Don’t have an account? <span>Sign Up</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
