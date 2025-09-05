import React, { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";
import useStaffStore from "../stores/useStaffStore";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmationModal";
import Filter from "../assets/filter.svg";
import DropDown from "../assets/dropdown.svg";
import Avatar from "../assets/avatar.svg";
import Search from "../assets/search.svg";
function ShiftModal({ isOpenModal, setIsOpenModal, onClose, title }) {
  const modalRef = useRef(null);
  //create selectedUser to help with assign user
  const [selectedUser, setSelectedUser] = useState(null);
  const { editStaffDetail } = useStaffStore();
  // console.log(staffInfo);
  const [formData, setFormData] = useState({
    cardId: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    mobileNumber: "",
    address: "",
    role: "",
    contractType: "",
    payRate: "",
    location: "",
    avatar: null,
    isActive: true,
  });
  const staffList = [
    {
      id: 1,
      name: "Chingsien Ly",
      type: "Full-time",
      payRate: "32",
      selected: true,
    },
    {
      id: 2,
      name: "Masanori Isono",
      type: "Part-time",
      payRate: "32",
      selected: false,
    },
    {
      id: 3,
      name: "Eri Higuchi",
      type: "Casual",
      payRate: "32",
      selected: false,
    },
    {
      id: 4,
      name: "Yudou Han",
      type: "Casual",
      payRate: "32",
      selected: false,
    },
    {
      id: 5,
      name: "Kimchheng Lim",
      type: "Casual",
      payRate: "32",
      selected: false,
    },
  ];

  if (!isOpenModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      console.log(e.target.className);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsOpenModal(false);
  };

  return (
    <div
      className="fixed inset-0 bg-[#000000]/40 flex items-center justify-center z-60"
      onMouseDown={handleCloseModal}
    >
      {/* open register staff modal */}
      <div className="bg-white rounded-lg p-6 relative w-[977px] shadow-lg text-[#565656] z-10">
        <h2 className="text-xl font-semibold text-[#566074] mb-4">{title}</h2>
        {/* <div className="h-[1px] w-full bg-[#ADADAD] px-[-24px] absolute top-[60px] left-0"></div> */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 flex flex-col gap-8">
              <div className="w-full flex gap-8 items-center">
                <img src={Avatar} className="size-[100px]" alt="avatar" />
                {selectedUser ? (
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[24px] font-semibold text-[#566074]">
                      Chingsien Ly
                    </span>
                    <span className="text-[#ADADAD]">
                      Full-time Pay rate: $32/hrs
                    </span>
                  </div>
                ) : (
                  <button className="p-2 bg-[#F5F5F5] h-[41px] w-[112px] rounded-[5px] font-medium text-[#566074] border-[#DEDEDE] border-[1px] border-solid">
                    Assign staff
                  </button>
                )}
              </div>
              {/* form */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-[10px]">
                  <label htmlFor="date" className="text-[#565656] font-medium">
                    Date
                  </label>
                  <input
                    type="date"
                    placeholder="Type here"
                    className="input bg-white placeholder:text-[#ADADAD] border-[1px] border-[#ADADAD] rounded-[5px] w-full"
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <label
                    htmlFor="location"
                    className="text-[#565656] font-medium"
                  >
                    Location
                  </label>
                  <select
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="border border-[#ADADAD] px-3 py-2 rounded"
                  >
                    <option value="">Select Location</option>
                    <option value="Shed 1">Shed 1</option>
                    <option value="Shed 2">Shed 2</option>
                    <option value="Shed 3">Shed 3</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-[36px]">
                  <div className="flex flex-col gap-[10px]">
                    <label
                      htmlFor="startTime"
                      className="text-[#565656] font-medium"
                    >
                      Start time
                    </label>
                    <input
                      type="time"
                      className="input bg-white placeholder:text-[#ADADAD] border-[1px] border-[#ADADAD] rounded-[5px] w-full"
                      id="startTime"
                      name="startTime"
                    />
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <label
                      htmlFor="startTime"
                      className="text-[#565656] font-medium"
                    >
                      End time
                    </label>
                    <input
                      type="time"
                      className="input bg-white placeholder:text-[#ADADAD] border-[1px] border-[#ADADAD] rounded-[5px] w-full"
                      id="endTime"
                      name="endTime"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* active Staff */}
            <div className="p-4 flex flex-col gap-[16px] border-l-[1px] border-[#ADADAD]">
              <div className="flex items-center justify-between">
                <span className="text-[20px] font-semibold text-[#566074]">
                  Active Staff
                </span>
                <div className="flex gap-[8px] p-2 bg-[#F5F5F5] rounded-[5px] cursor-pointer">
                  <img src={Filter} alt="Filter" className="size-[20px]" />
                  <img src={DropDown} alt="dropdown" className="size-[20px]" />
                </div>
              </div>
              <label className="w-full h-[50px] border-[#E8E8E8] border p-2 rounded-[5px] flex items-center">
                {/* search */}
                <div className="flex items-center gap-[10px] w-full">
                  <img src={Search} alt="search" className="size-[15px]" />
                  <input
                    type="text"
                    className="outline-none w-full"
                    name="search"
                    id="search"
                    placeholder="Search..."
                  />
                </div>
              </label>
              <div className="w-full h-[300px] overflow-y-auto flex flex-col ">
                {/* list of user */}
                {staffList?.map((staff, index) => {
                  return (
                    <div
                      key={index}
                      className="p-2 flex gap-[14px] items-center"
                    >
                      <img src={Avatar} alt="avatar" className="size-[60px]" />
                      <div className="flex flex-col">
                        <span className="Masanori Isono text-[14px] font-semibold">
                          {staff.name}
                        </span>
                        <span className="text-[12px] text-[#ADADAD]">
                          {staff.type +
                            " " +
                            "Pay rate: " +
                            "$" +
                            staff.payRate +
                            "/hr"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded text-[#565656] cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>

            <ConfirmModal
              propID="createShift"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              title="Confirm create shift"
              message="Are you sure all information are correct?"
              handleSubmit={handleSubmit}
              submitLabel="Create shift"
            />
          </div>
        </div>
      </div>
      {/* popup */}
    </div>
  );
}

export default ShiftModal;
