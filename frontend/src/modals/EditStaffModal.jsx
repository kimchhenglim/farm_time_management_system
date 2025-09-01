import React, { useEffect, useRef, useState } from "react";
import ConfirmModal from "./ConfirmationModal";
import UploadAvatar from "../assets/uploadAvatar.svg";
import Avatar from "../assets/avatar.svg";
function EditStaffModal({ isOpenModal, setIsOpenModal, onClose }) {
  const modalRef = useRef(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    biometricId: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: "",
    role: "",
    contractType: "",
    payRate: "",
    task: "",
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
    console.log(formData);
    setIsOpenModal(false);
    // const payload = new FormData();
    // Object.entries(formData).forEach(([key, value]) => {
    //   if (value !== null) {
    //     payload.append(key, value);
    //   }
    // });

    // onSubmit(payload);

    // setFormData({
    //   biometricId: "",
    //   firstName: "",
    //   lastName: "",
    //   dateOfBirth: "",
    //   gender: "",
    //   email: "",
    //   phoneNumber: "",
    //   address: "",
    //   role: "",
    //   contractType: "",
    //   payRate: "",
    //   task: "",
    //   avatar: null,
    // });
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
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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
                <option value="Technician">Technician</option>
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
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Casual">Casual</option>
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
              <label className="text-sm font-medium mb-1">Task</label>
              <select
                name="task"
                value={formData.task}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
              >
                <option value="">Select Task</option>
                <option value="Sensor Calibration">Sensor Calibration</option>
                <option value="System Check">System Check</option>
                <option value="Equipment Diagnostics">
                  Equipment Diagnostics
                </option>
                <option value="Sensor Data Review">Sensor Data Review</option>
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
