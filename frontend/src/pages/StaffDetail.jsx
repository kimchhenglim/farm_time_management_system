import React, { useState } from "react";
import { Link } from "react-router-dom";
import Edit from "../assets/edit.svg";
import Avatar from "../assets/avatar.svg";
import Email from "../assets/email.svg";
import Phone from "../assets/phone.svg";
import Home from "../assets/home.svg";
import ConfirmationModal from "../modals/ConfirmationModal";
import EditStaffModal from "../modals/EditStaffModal";
function StaffDetail() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="w-full h-[calc(100%)] p-4">
      {/* header */}
      <div className="w-full h-[60px] text-[#ADADAD] flex items-center justify-between">
        <div className="breadcrumbs text-2xl cursor-pointer">
          <ul>
            <li className="">
              <Link to="/staff-management">Staff List</Link>
            </li>
            <li className="text-[#566074]">Staff detail</li>
          </ul>
        </div>
        <div className="flex gap-[20px]">
          <button
            className="bg-[#16A34A] text-white font-medium px-[24px] py-[16px] flex items-center gap-2.5 rounded-sm cursor-pointer"
            onClick={() => {
              setIsOpenModal(true);
            }}
          >
            <img src={Edit} alt="edit" /> Edit this staff
          </button>
          {isActive ? (
            <ConfirmationModal
              propID="confirm1"
              title="Confirm Registration"
              message="Are you sure you want to register this staff?"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              submitLabel="Mark as Inactive"
              style="bg-[#F5F5F5] px-[24px] py-[16px] cursor-pointer rounded-sm"
              handleSubmit={() => {
                setIsActive((prev) => !prev);
              }}
            />
          ) : (
            <button
              className="bg-[#daf1e1] px-[24px] py-[16px] cursor-pointer text-[#16A34A] rounded-sm"
              onClick={() => {
                setIsActive((prev) => !prev);
              }}
            >
              Mark as Active
            </button>
          )}
        </div>
      </div>
      {/* content */}
      <div className="mt-[20px]  w-full h-[calc(100%-82px)] flex gap-[36px] ">
        <div className="w-[30%] h-full bg-white">
          <div className="h-[40%] w-full flex flex-col items-center justify-center mt-[28px] gap-[15px]">
            <img src={Avatar} alt="avatar" className="size-[120px]" />
            <div className="flex flex-col justify-center items-center w-[190px] gap-[8px]">
              <span className="text-[#566074] text-lg">Firstname Lastname</span>
              <div className="flex gap-3 items-center justify-center text-sm">
                <span className=" text-[#16A34A] w-[40px] flex items-center justify-center">
                  FT101
                </span>
                {isActive ? (
                  <span className="text-[#16A34A] p-2 bg-[#F0FDF4] rounded-4xl w-[80px] flex items-center justify-center">
                    Active
                  </span>
                ) : (
                  <span className="text-[#566074] p-2 bg-[#F5F5F5] rounded-4xl w-[80px] flex items-center justify-center">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[20px]">
            <div className="text-[#8D8D8D] flex flex-col gap-1.5 ml-[32px] mt-[20px]">
              <div>
                Gender: <span className="text-[#8D8D8D] font-thin">Male</span>
              </div>
              <div>
                DOB:{" "}
                <span className="text-[#8D8D8D] font-thin">
                  23th September 1989
                </span>
              </div>
              <div>
                Role: <span className="text-[#16A34A] font-thin">Employee</span>
              </div>
              <div>
                Task:{" "}
                <span className="text-[#16A34A] font-thin">Cut grass</span>
              </div>
              <div>
                Contract:{" "}
                <span className="text-[#16A34A] font-thin">Part-time</span>
              </div>
              <div>
                Pay rate:{" "}
                <span className="text-[#16A34A] font-thin">$30.00</span>
              </div>
            </div>
            {/* line */}
            <div className="bg-gray-50 h-[1px] w-[80%]"></div>
            {/* social */}
            <div className="text-[#566074] ml-[32px] flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <img src={Email} alt="email" className="w-[20px]" />
                <a href="">example@gmail.com</a>
              </div>
              <div className="flex items-center gap-1.5">
                <img src={Phone} alt="phone" className="w-[20px]" />
                0449210924
              </div>
              <div className="flex items-center gap-1.5">
                <img src={Home} alt="home" className="w-[20px]" />
                123 Grote St, Adelaide SA 5000
              </div>
            </div>
          </div>
        </div>
        <div className="w-[70%] h-full"></div>
      </div>
      {isOpenModal && (
        <EditStaffModal
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          onClose={() => {
            setIsOpenModal(false);
          }}
        />
      )}
    </div>
  );
}

export default StaffDetail;
