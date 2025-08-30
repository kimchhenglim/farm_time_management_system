import React, { useEffect, useState } from "react";
import Logo from "../assets/FarmLogo.svg";
import useAuthStore from "../stores/useAuthStore";
import { toast } from "react-hot-toast";
function Login() {
  const [hidden, setHidden] = useState(true);
  // call useAuthStore
  const { login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const validation = () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your Email!");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    } else if (!formData.password) {
      toast.error("Password is required");
      return false;
    } else if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };
  // useEffect(() => {}, []);
  //submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    //create the success to store bool of validation
    const success = validation();
    if (success) {
      login(formData);
    }
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
              <label htmlFor="email" className="font-medium text-[#566074]">
                Email
              </label>
              <div className="w-full border-[2px] rounded-md flex border-[#ADADAD]">
                <input
                  placeholder="Type your email"
                  type="text"
                  name="email"
                  id="email"
                  className="w-full  border-[#ADADAD] p-4 rounded-md outline-0"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col mt-[23px] gap-2.5">
              <label htmlFor="password" className="font-medium text-[#566074]">
                Password
              </label>
              <div className="w-full border-[2px] rounded-md flex border-[#ADADAD]">
                <input
                  type={`${hidden ? "text" : "text"}`}
                  name=""
                  placeholder="Type your password"
                  id="password"
                  className="w-[90%]  border-[#ADADAD] p-4 rounded-md outline-0"
                  alue={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
              disabled={isLoggingIn}
            >
              {!isLoggingIn ? (
                "Log In"
              ) : (
                <span className="loading loading-spinner loading-sm cursor-not-allowed"></span>
              )}
            </button>
          </form>
          <div className="mt-[32px] flex flex-col gap-[32px] items-center"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
