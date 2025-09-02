import React, { useEffect, useRef, useState } from "react";
import ConfirmModal from "./ConfirmationModal";
import UploadAvatar from "../assets/uploadAvatar.svg";
import Avatar from "../assets/avatar.svg";
import { useParams } from "react-router-dom";
function EditStaffModal({ isOpenModal, setIsOpenModal, onClose, staffInfo }) {
  const modalRef = useRef(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const { staffID } = useParams();

  console.log(staffInfo);
  const [formData, setFormData] = useState({
    employeeId: staffInfo?.employeeId,
    biometricId: staffInfo?.employeeId,
    firstName: staffInfo?.firstName,
    lastName: staffInfo?.lastName,
    dateOfBirth: staffInfo?.dob,
    gender: staffInfo?.gender || "",
    email: staffInfo?.email,
    phoneNumber: staffInfo?.mobileNumber,
    address: staffInfo?.address,
    role: staffInfo?.role || "",
    contractType: staffInfo?.contractType || "",
    payRate: staffInfo?.payRate,
    location: staffInfo?.location,
    avatar: null,
  });

  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (
  //       modalRef.current &&
  //       !modalRef.current.contains(e.target) &&
  //       isConfirm
  //     ) {
  //       onClose();
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [onClose]);

  if (!isOpenModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Data", formData);
    setIsOpenModal(false);
  };
  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      console.log(e.target.className);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#000000]/40 flex items-center justify-center z-60"
      onMouseDown={handleCloseModal}
    >
      {/* open register staff modal */}
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-[977px] shadow-lg text-[#565656] z-10"
      >
        <h2 className="text-xl font-semibold text-[#566074] mb-4">
          Edit Staff
        </h2>
        <div>
          <div className="grid grid-cols-2 gap-4">
            {/* Avatar and Upload */}
            <div className="grid grid-cols-2 gap-4 col-span-2 mb-2">
              <div className="flex items-center justify-center gap-3">
                <img
                  src={Avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border border-gray-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  // onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  className="flex items-center gap-2 bg-[#F5F5F5] text-[#566074] px-4 py-2 rounded-md font-medium cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <img src={UploadAvatar} alt="Upload Avatar" />
                  Upload Avatar
                </button>
              </div>
              {/* Biometric ID */}
              <div className="flex flex-col justify-center">
                <label className="text-sm font-medium mb-1">Biometric ID</label>
                <input
                  name="biometricId"
                  value={formData.biometricId}
                  disabled
                  onChange={handleChange}
                  className="border border-[#ADADAD] px-3 py-2 rounded"
                />
              </div>
            </div>

            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                {/* should have male not MALE */}
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Phone Number</label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col col-span-2">
              <label className="text-sm font-medium mb-1">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
              >
                <option value="">Select Role</option>
                <option value="STAFF">Staff</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Field Engineer">Field Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
            </div>

            {/* Contract Type */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Contract Type</label>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
              >
                <option value="">Select Contract</option>
                <option value="FULLTIME">Full-Time</option>
                <option value="PARTTIME">Part-Time</option>
                <option value="CASUAL">Casual</option>
              </select>
            </div>

            {/* Pay Rate */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Pay Rate</label>
              <input
                name="payRate"
                value={formData.payRate}
                onChange={handleChange}
                placeholder="$/hr"
                className="border border-[#ADADAD] px-3 py-2 rounded"
              />
            </div>

            {/* Task */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Location</label>
              <select
                name="task"
                value={formData.location}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
              >
                <option value="">Select Location</option>
                <option value="Shed 1">Shed 1</option>
                <option value="Shed 2">Shed 2</option>
                <option value="Shed 3">Shed 3</option>
                <option value="Shed 4">Shed 4</option>
              </select>
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
              propID="my_modal_7"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              title="Confirm edits"
              message="Are you sure all information are correct?"
              handleSubmit={handleSubmit}
              setIsOpenModal={setIsOpenModal}
              submitLabel="Save"
            />
          </div>
        </div>
      </div>
      {/* popup */}
    </div>
  );
}

export default EditStaffModal;
