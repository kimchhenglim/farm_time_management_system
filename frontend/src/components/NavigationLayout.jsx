import React, { useState } from "react";
import Logo from "../assets/FarmLogo.svg";
import Bell from "../assets/bell.svg";
import Dropdown from "../assets/dropdown.svg";

function TopNavBar() {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-2 shadow h-[87px]">
      <div className="flex items-center space-x-6 w-full max-w-[700px]">
        {/* Logo */}
        <div className="flex items-center w-[314px] h-[87px]">
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
        <div className="flex items-center space-x-3">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="h-10 w-10 rounded-full"
          />
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
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm">
      <nav className="flex flex-col pt-6 s64pace-y-2 px-4">
        <button className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium">
          Roster
        </button>
        <button className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium">
          Staff Management
        </button>
        <button className="text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium">
          Report
        </button>
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
        <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default NavigationLayout;
