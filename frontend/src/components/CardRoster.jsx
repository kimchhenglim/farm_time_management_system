import React, { useState } from "react";
import ShiftModal from "../modals/ShiftModal";
import useRosterStore from "../stores/useRosterStore";
import ConfirmShiftModal from "../modals/ConfirmShiftModal";
function CardRoster({
  rosterID,
  employeeName,
  station,
  time,
  index,
  columnIndex,
  date,
  payRate,
  type,
  totalHour,
  employeeId,
}) {
  const { editRoster } = useRosterStore();
  //pre-define color for shift
  const stationColors = {
    "Shed 1": "bg-[#D1EEEC] text-[#19A598]",
    "Shed 2": "bg-[#FFD0E0] text-[#C41651]",
    "Shed 3": "bg-[#C8EDFD] text-[#1773E0]",
  };

  const handleCreateShift = () => {
    console.log("Shift created ✅");
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const onHandleEdit = () => {
    const elem = document.activeElement;
    if (elem) elem.blur();
    const nameParts = (employeeName || "").split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const convertTo24Hour = (time12h) => {
      if (!time12h) return "";
      const [time, modifier] = time12h.split(" ");
      if (!time || !modifier) return time12h;
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    };

    const [startTime, endTime] = time.split(" - ").map(convertTo24Hour);

    const shiftData = {
      rosterId: rosterID,
      firstName,
      lastName,
      contractType: type,
      payRate,
      station,
      startTime,
      endTime,
      id: employeeId,
      date,
      totalHour,
      employeeId,
    };
    setSelectedShift(shiftData);
    setIsOpen(true);
  };

  const handleEditSubmit = async (formValues) => {
    await editRoster({
      rosterId: rosterID,
      employeeId: formValues.staffId,
      station: formValues.station,
      startTime: formValues.startTime,
      endTime: formValues.endTime,
      date,
      staffName: formValues.staffName,
      type,
      payRate,
      totalHour,
    });
    setIsOpen(false);
  };
  const onHandleDelete = () => {
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
    setIsConfirm(true);
    // deleteRoster(rosterID);
  };

  return (
    <div
      className={`${
        columnIndex === 6
          ? "dropdown dropdown-left dropdown-center w-full"
          : "dropdown dropdown-right dropdown-center w-full "
      }`}
      key={index}
    >
      <div
        tabIndex={0}
        role="button"
        className={` w-full h-[70px] p-2 flex flex-col gap-2 justify-center ${stationColors[station]}  rounded-[5px] cursor-pointer`}
      >
        <span className=" font-semibold text-[14px]">{employeeName}</span>
        <div className="flex gap-2 items-center">
          <span className=" font-medium 2xl:text-[10px] xl:text-[10px]">
            {time}
          </span>
          <div className="w-[3px] h-[3px] rounded-full bg-[#19A598] "></div>
          <span className="italic xl:text-[10px]">{station}</span>
        </div>
      </div>
      {/* popup */}
      <ul
        tabIndex={0}
        id="pop1"
        className={`dropdown-content menu bg-base-100 rounded-box z-1 w-44  p-2  shadow-[var(--custom-shadow)] ${
          columnIndex === 6 ? "mr-2" : "ml-2"
        }`}
      >
        <li onClick={() => onHandleEdit()}>
          <a className="flex gap-3 items-center">
            <svg
              width="15"
              height="15"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.7848 0.828029L12.0308 2.58173L17.4178 7.96783L19.1718 6.21412C19.7031 5.68684 20 4.96817 20 4.21826C20 3.46835 19.7031 2.74968 19.1718 2.2224L17.7772 0.828029C17.2499 0.29684 16.5311 0 15.781 0C15.031 0 14.3122 0.29684 13.7848 0.828029ZM10.7066 3.9058L2.29987 12.3072C1.88188 12.7251 1.57718 13.2485 1.41702 13.8187L0.0341331 18.8103C-0.0557153 19.1345 0.034133 19.486 0.276333 19.7243C0.518533 19.9625 0.866207 20.0563 1.19044 19.9664L6.18289 18.5799C6.75323 18.4197 7.27279 18.119 7.69468 17.6972L16.0935 9.29189L10.7066 3.9058Z"
                fill="#566074"
              />
            </svg>
            Edit this shift
          </a>
        </li>
        <li onClick={() => onHandleDelete()}>
          <a className="flex gap-3 items-center">
            <svg
              width="15"
              height="15"
              viewBox="0 0 14 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.27187 0.705114L4 1.54545H1C0.446875 1.54545 0 2.00587 0 2.57576C0 3.14564 0.446875 3.60606 1 3.60606H13C13.5531 3.60606 14 3.14564 14 2.57576C14 2.00587 13.5531 1.54545 13 1.54545H10L9.72812 0.705114C9.59062 0.283333 9.20937 0 8.77812 0H5.22188C4.79063 0 4.40937 0.283333 4.27187 0.705114ZM13 5.15152H1L1.65938 15.5544C1.70938 16.3689 2.36562 17 3.15625 17H10.8438C11.6344 17 12.2906 16.3689 12.3406 15.5544L13 5.15152Z"
                fill="#566074"
              />
            </svg>
            Delete this shift
          </a>
        </li>
      </ul>

      <ShiftModal
        isOpenModal={isOpen}
        setIsOpenModal={setIsOpen}
        title="Edit new shift"
        submitLabel="Edit"
        onClose={() => setIsOpen(false)}
        data={selectedShift}
        onSubmitFunction={handleEditSubmit}
      />
      <ConfirmShiftModal
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        rosterID={rosterID}
      />
    </div>
  );
}

export default CardRoster;
