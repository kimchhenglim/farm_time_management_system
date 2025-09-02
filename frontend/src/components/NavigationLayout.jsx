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
function TopNavBar({ fullName }) {
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
              <li className="hover:bg-gray-300 rounded-sm">
                <a>Logout</a>
              </li>
              <li className="hover:bg-gray-300 rounded-sm">
                <a>Settings</a>
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
          to="/roster"
          className={`w-full hover:bg-[#F0FDF4] ${
            currentPath === "/roster"
              ? "border-l-[4px] border-[#16A34A] bg-[#F0FDF4]"
              : ""
          }`}
        >
          <button
            className={`flex items-center gap-2.5 h-[76px] text-left px-[24px]  py-2 rounded-lg   font-medium cursor-pointer ${
              currentPath === "/roster" ? "text-[#16A34A]" : "text-gray-700"
            }`}
          >
            <img
              src={currentPath === "/roster" ? Calendar_active : Calendar}
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
      </nav>
    </aside>
  );
}

function NavigationLayout({ children }) {
  const { authUser } = useAuthStore();
  console.log(authUser);
  return (
    <div className="flex flex-col h-screen">
      {authUser && (
        <TopNavBar
          fullName={`${authUser?.body.firstName || ""} ${
            authUser?.body.lastName || ""
          }`}
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
