import React, { useState, useRef, useEffect } from "react";
import UploadAvatar from "../assets/uploadAvatar.svg";

function CreateStaffModal({ isOpen, onClose, onSubmit }) {
  const modalRef = useRef(null);

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

  if (!isOpen) return null;

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

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        payload.append(key, value);
      }
    });

    onSubmit(payload);

    setFormData({
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
  };

  return (
    <div
      className="fixed inset-0 bg-[#000000]/40 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* open register staff modal */}
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-[977px] shadow-lg text-[#565656]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-[#566074] mb-4">
          Register New Staff
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Avatar and Upload */}
            <div className="grid grid-cols-2 gap-4 col-span-2 mb-2">
              <div className="flex items-center justify-center gap-3">
                <img
                  src="/path/to/avatar.jpg"
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border border-gray-300"
                />
                <button
                  type="button"
                  className="flex items-center gap-2 bg-[#F5F5F5] text-[#566074] px-4 py-2 rounded-md font-medium cursor-pointer"
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
            <button
              type="submit"
              className="px-4 py-2 bg-[#16A34A] text-white rounded cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStaffModal;
