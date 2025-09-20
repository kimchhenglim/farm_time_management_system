import React, { useRef, useState } from "react";
import UploadAvatar from "../assets/uploadAvatar.svg";
import Avatar from "../assets/avatar.svg";
import toast from "react-hot-toast";

function CreateStaffModal({ isOpenModal, setIsOpenModal, onClose, onSubmit }) {
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
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

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpenModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prev) => ({ ...prev, avatar: file }));
  };

  const resetForm = () => {
    setFormData({
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
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "dob",
      "gender",
      "email",
      "mobileNumber",
      "address",
      "role",
      "contractType",
      "payRate",
      "location",
    ];

    const newErrors = {};

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
      }
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.payRate <= 0) {
      newErrors.payRate = "Pay rate must be greater than 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = async () => {
    // Validate form first
    if (!validateForm()) return;

    // Prepare payload
    const payload = {
      cardId: formData.cardId || null,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: "12345678",
      mobileNumber: formData.mobileNumber.startsWith("0")
        ? "+61" + formData.mobileNumber.slice(1)
        : formData.mobileNumber,
      dob: formData.dob.split("-").reverse().join("/"),
      gender: formData.gender,
      address: formData.address,
      role: formData.role,
      isActive: formData.isActive,
      contractType: formData.contractType,
      payRate: parseFloat(formData.payRate),
      location: formData.location,
    };

    try {
      setIsLoading(true);
      await onSubmit(payload);
      setIsLoading(false);
      resetForm();
      setIsOpenModal(false);

      toast.success("Staff registered successfully!");
    } catch (err) {
      setIsLoading(false);

      toast.error(
        err?.response?.data?.message ||
          "Failed to register staff. Please try again."
      );
      console.error("Staff registration error:", err);
    }
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#000000]/40 flex items-center justify-center z-60"
      onMouseDown={handleCloseModal}
    >
      <div
        className="bg-white rounded-lg p-6 w-[977px] shadow-lg text-[#565656] z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-[#566074] mb-4">
          Register Staff
        </h2>
        <form>
          <div className="grid grid-cols-2 gap-4">
            {/* Avatar & Biometric ID */}
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
              <div className="flex flex-col justify-center">
                <label className="text-sm font-medium mb-1">Biometric ID</label>
                <input
                  type="text"
                  name="cardId"
                  value={formData.cardId}
                  onChange={handleChange}
                  className="border border-[#ADADAD] px-3 py-2 rounded"
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
                onChange={(e) => {
                  handleChange(e);
                  setErrors({ ...errors, firstName: null });
                }}
                className={`border px-3 py-2 rounded ${
                  errors.firstName ? "border-red-500" : "border-[#ADADAD]"
                }`}
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.firstName}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => {
                  handleChange(e);
                  setErrors({ ...errors, lastName: null });
                }}
                className={`border px-3 py-2 rounded ${
                  errors.lastName ? "border-red-500" : "border-[#ADADAD]"
                }`}
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.lastName}
                </span>
              )}
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={(e) => {
                  handleChange(e);
                  setErrors({ ...errors, dob: null });
                }}
                className={`border px-3 py-2 rounded ${
                  errors.dob ? "border-red-500" : "border-[#ADADAD]"
                } calendar-black`}
                min="1900-01-01"
                max={new Date().toISOString().split("T")[0]}
              />
              {errors.dob && (
                <span className="text-red-500 text-xs mt-1">{errors.dob}</span>
              )}
            </div>

            {/* Gender */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={(e) => {
                  handleChange(e);
                  setErrors({ ...errors, gender: null });
                }}
                className={`border px-3 py-2 rounded ${
                  errors.gender ? "border-red-500" : "border-[#ADADAD]"
                }`}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.gender}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => {
                  handleChange(e);
                  setErrors({ ...errors, email: null });
                }}
                className={`border px-3 py-2 rounded ${
                  errors.email ? "border-red-500" : "border-[#ADADAD]"
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData((prev) => ({ ...prev, mobileNumber: val }));
                  setErrors({ ...errors, mobileNumber: null });
                }}
                placeholder="e.g., 0452345678"
                className={`border px-3 py-2 rounded ${
                  errors.mobileNumber ? "border-red-500" : "border-[#ADADAD]"
                }`}
              />
              {errors.mobileNumber && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.mobileNumber}
                </span>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col col-span-2">
              <label className="text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) => {
                  handleChange(e);
                  setErrors({ ...errors, address: null });
                }}
                className={`border px-3 py-2 rounded ${
                  errors.address ? "border-red-500" : "border-[#ADADAD]"
                }`}
              />
              {errors.address && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.address}
                </span>
              )}
            </div>

            {/* Role */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={(e) => {
                  handleChange(e);
                  setErrors({ ...errors, role: null });
                }}
                className={`border px-3 py-2 rounded ${
                  errors.role ? "border-red-500" : "border-[#ADADAD]"
                }`}
              >
                <option value="">Select Role</option>
                <option value="STAFF">Staff</option>
              </select>
              {errors.role && (
                <span className="text-red-500 text-xs mt-1">{errors.role}</span>
              )}
            </div>

            {/* Contract Type */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Contract Type</label>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={(e) => {
                  handleChange(e);
                  setErrors({ ...errors, contractType: null });
                }}
                className={`border px-3 py-2 rounded ${
                  errors.contractType ? "border-red-500" : "border-[#ADADAD]"
                }`}
              >
                <option value="">Select Contract</option>
                <option value="FULLTIME">Full-Time</option>
                <option value="PARTTIME">Part-Time</option>
                <option value="CASUAL">Casual</option>
              </select>
              {errors.contractType && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.contractType}
                </span>
              )}
            </div>

            {/* Pay Rate */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Pay Rate</label>
              <input
                type="number"
                name="payRate"
                value={formData.payRate}
                onChange={(e) => {
                  handleChange(e);
                  setErrors({ ...errors, payRate: null });
                }}
                placeholder="$/hr"
                className={`border px-3 py-2 rounded ${
                  errors.payRate ? "border-red-500" : "border-[#ADADAD]"
                }`}
              />
              {errors.payRate && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.payRate}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={(e) => {
                  handleChange(e);
                  setErrors({ ...errors, location: null });
                }}
                className={`border px-3 py-2 rounded ${
                  errors.location ? "border-red-500" : "border-[#ADADAD]"
                }`}
              >
                <option value="">Select Location</option>
                <option value="Shed 1">Shed 1</option>
                <option value="Shed 2">Shed 2</option>
                <option value="Shed 3">Shed 3</option>
                <option value="Shed 4">Shed 4</option>
              </select>
              {errors.location && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.location}
                </span>
              )}
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
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded cursor-pointer ${
                isLoading ? "bg-gray-400" : "bg-[#16A34A] text-white"
              }`}
              onClick={handleSaveClick}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStaffModal;
