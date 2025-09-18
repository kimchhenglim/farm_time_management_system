import React, { useState } from "react";
import ConfirmationModal from "../modals/ConfirmationModal";
import Globe from "../assets/globe.svg";
import Plus from "../assets/plus.svg";

import WeekNavigator from "../components/WeekNavigator";
import ShiftModal from "../modals/ShiftModal";
import useRosterStore from "../stores/useRosterStore";
import ConfirmModal from "../modals/ConfirmationModal";
function Dashboard() {
  //create trigger for Modal
  const [isOpen, setIsOpen] = useState(false);
  const { addRoster } = useRosterStore();

  return (
    <div className=" w-full h-full px-4 bg-[#FFFFFF]">
      {/* header */}
      <div className="w-full h-[60px]  flex items-center justify-between ">
        <span className="font-semibold text-[#566074] text-[32px]">
          Staff Roster
        </span>
        <div className="flex items-center gap-4">
          <ConfirmationModal
            propID="publishModal"
            title="Publish this shift?"
            message="Are you sure you want to publish this shift?"
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            submitLabel={
              <div className="flex gap-2.5 ">
                <img src={Globe} alt="blobe" />
                <span className="text-[14px] text-[#566074]">Publish</span>
              </div>
            }
            style="bg-[#F5F5F5] w-[124px] px-[24px] py-[16px] cursor-pointer rounded-[5px] text-white"
            handleSubmit={() => {
              setIsActive((prev) => !prev);
            }}
          />
          {/* create shift button */}
          <button
            className="flex items-center gap-3 justify-center px-[24px] py-[15.5px] bg-[#16A34A] rounded-[5px] cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <img src={Plus} alt="plus+" />{" "}
            <span className="font-semibold text-white">Create new shift</span>
          </button>
        </div>
      </div>
      {/* calendar shift */}
      <div className=" w-full h-[calc(100%-70px)] mt-[10px] pt-[32px] rounded-[15px] shadow-[var(--custom-shadow)]">
        {<WeekNavigator />}
      </div>
      <ShiftModal
        isOpenModal={isOpen}
        setIsOpenModal={setIsOpen}
        title="Create new shift"
        onClose={() => setIsOpen(false)}
        onSubmitFunction={addRoster}
        submitLabel="Create"
      />
      <ConfirmModal
        propID="deleteModal"
        title="Delete this shift?"
        message="Are you sure you want to publish this shift?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        submitLabel={"Delete"}
        style="bg-[#F5F5F5] w-[124px] px-[24px] py-[16px] cursor-pointer rounded-[5px] text-white"
        handleSubmit={() => {
          // setIsActive((prev) => !prev);
        }}
      />
    </div>
  );
}

export default Dashboard;
