import React, { useState } from "react";
import Logo from "../assets/FarmLogo.svg";
import Bell from "../assets/bell.svg";
import Dropdown from "../assets/dropdown.svg";
import Calendar from "../assets/calendar.svg";
import User from "../assets/user.svg";
import Report from "../assets/report.svg";
import Calendar_active from "../assets/calendar-active.svg";
import User_active from "../assets/users-active.svg";
import Report_active from "../assets/report-active.svg";
import Ellipse from "../assets/Ellipse.svg";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
function TopNavBar({ fullName, email, token }) {
  //import from useAuthStore
  const { logout } = useAuthStore();
  return (
    <header className="flex items-center justify-between bg-white px-6 py-2 shadow-2xs h-[87px]">
      <div className="flex items-center space-x-6 w-full ">
        {/* Logo */}
        <div className="flex items-center w-[207px] h-[87px]">
          <img src={Logo} alt="Logo" className="object-contain" />
        </div>

        {/* Divider */}
        <div className="self-stretch border-l border-gray-300"></div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <button className="relative">
          <span>
            <img src={Bell} alt="Bell" className="w-6 h-6 object-contain" />
          </span>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Section */}
        <div className="flex items-center w-[200px] gap-4">
          <img src={Ellipse} alt="Profile" className="h-10 w-10 rounded-full" />
          <div className="flex flex-col text-sm">
            <span className="font-bold text-gray-700">{fullName} </span>
            <span className="text-gray-500">Admin</span>
          </div>
          {/* Dropdown */}
          <div className=" dropdown dropdown-end">
            <button tabIndex={0} className="text-gray-600 cursor-pointer">
              <img src={Dropdown} className="w-6 h-6" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-[#F9FBFC] text-black rounded-box z-10 w-52 p-2 shadow-lg mt-1 ring ring-gray-500"
            >
              <li
                className="hover:bg-gray-300 rounded-sm"
                onClick={() => {
                  logout(email, token);
                }}
              >
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

function SideNavBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm border-t-[2px] ">
      <nav className="flex flex-col pt-6 s64pace-y-2 ">
        <Link
          to="/"
          className={`w-full hover:bg-[#F0FDF4] ${
            currentPath === "/"
              ? "border-l-[4px] border-[#16A34A] bg-[#F0FDF4]"
              : ""
          }`}
        >
          <button
            className={`flex items-center gap-2.5 h-[76px] text-left px-[24px]  py-2 rounded-lg   font-medium cursor-pointer ${
              currentPath === "/" ? "text-[#16A34A]" : "text-gray-700"
            }`}
          >
            <img
              src={currentPath === "/" ? Calendar_active : Calendar}
              alt="Calendar"
            />
            Roster
          </button>
        </Link>
        <Link
          to="/staff-management"
          className={`w-full hover:bg-[#F0FDF4] ${
            currentPath === "/staff-management"
              ? "border-l-[4px] border-[#16A34A] bg-[#F0FDF4]"
              : ""
          }`}
        >
          <button
            className={`flex items-center gap-2.5 h-[76px] text-left px-[24px]  py-2 rounded-lg   font-medium cursor-pointer ${
              currentPath === "/staff-management"
                ? "text-[#16A34A]"
                : "text-gray-700"
            }`}
          >
            <img
              src={currentPath === "/staff-management" ? User_active : User}
              alt="staff"
            />{" "}
            Staff Management
          </button>
        </Link>
        <Link
          to="/report"
          className={`w-full hover:bg-[#F0FDF4] ${
            currentPath === "/report"
              ? "border-l-[4px] border-[#16A34A] bg-[#F0FDF4] "
              : ""
          }`}
        >
          <button
            className={`flex items-center gap-2.5 h-[76px] text-left px-[24px]  py-2 rounded-lg   font-medium cursor-pointer ${
              currentPath === "/report" ? "text-[#16A34A]" : "text-gray-700"
            }`}
          >
            <img
              src={currentPath === "/report" ? Report_active : Report}
              alt="report"
              className=""
            />
            Report
          </button>
        </Link>
        <Link
          to="/payroll"
          className={`w-full hover:bg-[#F0FDF4] ${
            currentPath === "/payroll"
              ? "border-l-[4px] border-[#16A34A] bg-[#F0FDF4] "
              : ""
          }`}
        >
          <button
            className={`flex items-center gap-2.5 h-[76px] text-left px-[24px]  py-2 rounded-lg   font-medium cursor-pointer ${
              currentPath === "/payroll" ? "text-[#16A34A]" : "text-gray-700"
            }`}
          >
            {currentPath === "/payroll" ? (
              <svg
                fill="#16A34A"
                width="30px"
                height="30px"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#16A34A"
                stroke-width="23.552"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M371.2 426.667c0-42.667-34.133-76.8-72.533-76.8s-76.8 34.133-76.8 76.8 34.133 76.8 72.533 76.8 76.8-34.133 76.8-76.8zm-106.667 0c0-17.067 12.8-34.133 29.867-34.133s34.133 17.067 34.133 34.133-12.8 34.133-29.867 34.133-34.133-17.067-34.133-34.133zm217.6 93.866c-42.667 0-72.533 34.133-72.533 76.8s34.133 76.8 72.533 76.8 72.533-34.133 72.533-76.8c0-46.933-34.133-76.8-72.533-76.8zm0 106.667c-17.067 0-29.867-12.8-29.867-34.133 0-17.067 12.8-34.133 29.867-34.133S512 571.734 512 593.067c0 17.067-12.8 34.133-29.867 34.133zm12.8-234.667c-8.533-8.533-21.333-8.533-29.867 0l-209.067 217.6c-8.533 8.533-8.533 21.333 0 29.867 4.267 4.267 8.533 4.267 12.8 4.267s12.8-4.267 17.067-8.533l209.067-217.6c8.533 0 8.533-17.067 0-25.6z"></path>
                  <path d="M644.267 64H128c-34.133 0-64 29.867-64 64v810.667C64 951.467 72.533 960 85.333 960s21.333-8.533 21.333-21.333V128c0-12.8 8.533-21.333 21.333-21.333h516.267c12.8 0 21.333 8.533 21.333 21.333v810.667c0 12.8 8.533 21.333 21.333 21.333s21.333-8.533 21.333-21.333V128c4.267-34.133-25.6-64-64-64zm247.466 196.267H742.4c-12.8 0-21.333 8.533-21.333 21.333s8.533 21.333 21.333 21.333h149.333c12.8 0 21.333 8.533 21.333 21.333v614.4c0 12.8 8.533 21.333 21.333 21.333s21.333-8.533 21.333-21.333v-614.4c4.267-34.133-25.6-64-64-64z"></path>
                </g>
              </svg>
            ) : (
              <svg
                fill="#000000"
                width="30px"
                height="30px"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
                stroke-width="23.552"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M371.2 426.667c0-42.667-34.133-76.8-72.533-76.8s-76.8 34.133-76.8 76.8 34.133 76.8 72.533 76.8 76.8-34.133 76.8-76.8zm-106.667 0c0-17.067 12.8-34.133 29.867-34.133s34.133 17.067 34.133 34.133-12.8 34.133-29.867 34.133-34.133-17.067-34.133-34.133zm217.6 93.866c-42.667 0-72.533 34.133-72.533 76.8s34.133 76.8 72.533 76.8 72.533-34.133 72.533-76.8c0-46.933-34.133-76.8-72.533-76.8zm0 106.667c-17.067 0-29.867-12.8-29.867-34.133 0-17.067 12.8-34.133 29.867-34.133S512 571.734 512 593.067c0 17.067-12.8 34.133-29.867 34.133zm12.8-234.667c-8.533-8.533-21.333-8.533-29.867 0l-209.067 217.6c-8.533 8.533-8.533 21.333 0 29.867 4.267 4.267 8.533 4.267 12.8 4.267s12.8-4.267 17.067-8.533l209.067-217.6c8.533 0 8.533-17.067 0-25.6z"></path>
                  <path d="M644.267 64H128c-34.133 0-64 29.867-64 64v810.667C64 951.467 72.533 960 85.333 960s21.333-8.533 21.333-21.333V128c0-12.8 8.533-21.333 21.333-21.333h516.267c12.8 0 21.333 8.533 21.333 21.333v810.667c0 12.8 8.533 21.333 21.333 21.333s21.333-8.533 21.333-21.333V128c4.267-34.133-25.6-64-64-64zm247.466 196.267H742.4c-12.8 0-21.333 8.533-21.333 21.333s8.533 21.333 21.333 21.333h149.333c12.8 0 21.333 8.533 21.333 21.333v614.4c0 12.8 8.533 21.333 21.333 21.333s21.333-8.533 21.333-21.333v-614.4c4.267-34.133-25.6-64-64-64z"></path>
                </g>
              </svg>
            )}
            Payroll
          </button>
        </Link>
      </nav>
    </aside>
  );
}

function NavigationLayout({ children }) {
  const { authUser } = useAuthStore();
  console.log(authUser);
  return (
    <div className="flex flex-col h-screen w-screen">
      {authUser && (
        <TopNavBar
          fullName={`${authUser?.body.firstName || ""} ${
            authUser?.body.lastName || ""
          }`}
          email={authUser?.body.email}
          token={authUser?.body.loginToken}
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        {authUser && <SideNavBar />}
        <main className="w-screen h-full flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

export default NavigationLayout;
