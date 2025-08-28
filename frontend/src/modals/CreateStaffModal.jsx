import React, { useEffect, useRef, useState } from "react";
import ConfirmModal from "./ConfirmationModal";
import UploadAvatar from "../assets/uploadAvatar.svg";
import Avatar from "../assets/avatar.svg";
function CreateStaffModal({ isOpenModal, setIsOpenModal, onClose }) {
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const [isConfirm, setIsConfirm] = useState(false);
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
    location: "",
    avatar: null,
  });

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

  const resetForm = () => {
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
      location: "",
      avatar: null,
    });
  };

  const submitFormData = () => {
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        payload.append(key, value);
      }
    });

    // console.log("Form Data Submitted:", formData);
    onSubmit(payload);
    resetForm();
    setIsOpenModal(false);
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validateForm = () => {
    //required fields
    const requiredFields = [
      "biometricId",
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "email",
      "phoneNumber",
      "address",
      "role",
      "contractType",
      "payRate",
      "location",
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        alert(`${field} is required.`);
        return false;
      }
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    return true;
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
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-[#566074] mb-4">
          Register Staff
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validateForm()) {
              setIsConfirm(true);
              document.getElementById("confirm_modal").showModal();
            }
          }}
        >
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
                  onChange={handleAvatarChange}
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
                  type="text"
                  name="biometricId"
                  value={formData.biometricId}
                  onChange={handleChange}
                  className="border border-[#ADADAD] px-3 py-2 rounded"
                  required
                />
              </div>
            </div>

            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
                required
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
                min="1900-01-01"
                max={new Date().toISOString().split("T")[0]}
                required
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
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                pattern="^0[23478]\d{8}$|^04\d{8}$"
                placeholder="e.g., 0452345678"
                className="border border-[#ADADAD] px-3 py-2 rounded"
                required
              />
            </div>

            {/* Address */}
            <div className="flex flex-col col-span-2">
              <label className="text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
                required
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
                required
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
                required
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
                type="text"
                name="payRate"
                value={formData.payRate}
                onChange={handleChange}
                placeholder="$/hr"
                className="border border-[#ADADAD] px-3 py-2 rounded"
                required
              />
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="border border-[#ADADAD] px-3 py-2 rounded"
                required
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
              onClick={() => {
                resetForm();
                onClose();
              }}
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

        <ConfirmModal
          propID="confirm_modal"
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          title="Confirm edits"
          message="Are you sure all information are correct?"
          handleSubmit={submitFormData}
          setIsOpenModal={setIsConfirm}
        />
      </div>
    </div>
  );
}

export default CreateStaffModal;
