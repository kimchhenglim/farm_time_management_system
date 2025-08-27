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
function TopNavBar() {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-2 shadow-2xs h-[87px]">
      <div className="flex items-center space-x-6 w-full ">
        {/* Logo */}
        <div className="flex items-center w-[207px] h-[87px]">
          <img src={Logo} alt="Logo" className="object-contain" />
        </div>

        {/* Divider */}
        <div className="self-stretch border-l border-gray-300"></div>

        {/* Search Bar */}
        <form className="flex-1">
          <label htmlFor="default-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search..."
              style={{ backgroundColor: "#F9FBFC" }}
              className="block w-[571px] h-[52px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </form>
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
            <span className="font-bold text-gray-700">User Name</span>
            <span className="text-gray-500">Admin</span>
          </div>
          {/* Dropdown */}
          <button className="text-gray-600">
            <img src={Dropdown} className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

function SideNavBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  console.log(currentPath);
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
  return (
    <div className="flex flex-col h-screen">
      <TopNavBar />
      <div className="flex flex-1 overflow-hidden">
        <SideNavBar />
        <main className="w-screen h-full flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

export default NavigationLayout;
