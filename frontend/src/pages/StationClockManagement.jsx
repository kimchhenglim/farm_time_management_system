import React, { useState } from "react";
import Clock from "../components/Clock";
import CardStationManagement from "../components/CardStationManagement";

function StationClockManagement() {
  //create the array of Days
  const days = [
    "Sunday",
    "Monday",
    "Tueday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // create the array of Months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  //create the state that get the time
  const [time, setTime] = useState(new Date());
  return (
    <div className="p-10 flex flex-col gap-6 w-full h-full">
      {/* clock */}
      <div className="w-[250px] h-[60px]">
        <Clock />
      </div>
      {/* Header */}
      <div className="w-full h-fit flex flex-col items-center justify-center gap-6">
        <span className="text-xl text-[#566074]">
          {days[time.getDay()] +
            " " +
            time.getDate() +
            " " +
            months[time.getMonth()] +
            " " +
            time.getFullYear()}
        </span>
        <span className="text-5xl">
          Welcome to <span className="text-[#16A34A]">Shed 1</span>
        </span>
      </div>
      {/* Station management functions */}
      <div className="flex items-center justify-between">
        <CardStationManagement
          bg="#16A34A"
          border="none"
          text="Clock-in"
          symbol={
            <svg
              width="150"
              height="150"
              viewBox="0 0 250 188"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M168.457 101.134C173.047 97.1893 173.047 90.8107 168.457 86.908L98.1445 26.4375C94.7754 23.542 89.7461 22.7027 85.3516 24.2554C80.957 25.808 78.125 29.5009 78.125 33.5714V67.1429H23.4375C10.498 67.1429 0 76.1652 0 87.2857V100.714C0 111.835 10.498 120.857 23.4375 120.857H78.125V154.429C78.125 158.499 80.957 162.192 85.3516 163.745C89.7461 165.297 94.7754 164.458 98.1445 161.562L168.457 101.134ZM171.875 161.143C163.232 161.143 156.25 167.144 156.25 174.571C156.25 181.999 163.232 188 171.875 188H203.125C229.004 188 250 169.955 250 147.714V40.2857C250 18.0446 229.004 0 203.125 0H171.875C163.232 0 156.25 6.00089 156.25 13.4286C156.25 20.8563 163.232 26.8571 171.875 26.8571H203.125C211.768 26.8571 218.75 32.858 218.75 40.2857V147.714C218.75 155.142 211.768 161.143 203.125 161.143H171.875Z"
                fill="white"
              />
            </svg>
          }
          text_color="text-white"
        />
        <CardStationManagement
          bg="#16A34A"
          border="none"
          text_color="text-white"
          text="Clock-out"
          symbol={
            <svg
              width="150"
              height="150"
              viewBox="0 0 170 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M104.624 0C117.258 0 127.52 8.96443 127.52 20.0003C127.52 31.0362 117.258 40.0006 104.624 40.0006C91.9904 40.0006 81.7281 31.0362 81.7281 20.0003C81.7281 8.96443 91.9904 0 104.624 0ZM50.2872 74.2869C48.9379 74.2869 47.7522 75.0012 47.2616 76.0727L38.2668 95.6801C35.5684 101.537 27.9637 104.395 21.2584 102.037C14.5532 99.6802 11.2824 93.0372 13.9808 87.18L22.9347 67.5725C27.4321 57.8224 38.2259 51.4294 50.2872 51.4294H90.0688C101.721 51.4294 112.474 56.8223 118.321 65.6082L131.731 85.7157H156.917C164.153 85.7157 170 90.8229 170 97.1444C170 103.466 164.153 108.573 156.917 108.573H131.731C122.409 108.573 113.823 104.252 109.121 97.2159L105.033 91.1086L96.5696 116.252L127.397 124.323C138.723 127.288 144.487 138.252 139.704 147.717L116.563 193.217C113.619 199.003 105.891 201.575 99.3089 199.003C92.7263 196.432 89.7417 189.682 92.6854 183.932L112.801 144.359L73.5919 134.074C60.2223 130.574 52.3314 118.466 55.7249 106.645L65.0059 74.2869H50.328H50.2872ZM47.0163 138.931C52.4541 144.252 59.5682 148.324 67.9497 150.502L69.8713 151.002L67.0502 157.895C64.6789 163.717 60.5085 168.896 55.0708 172.824L21.3811 197.075C15.8206 201.075 7.56177 200.396 2.98259 195.539C-1.59659 190.682 -0.819767 183.467 4.74066 179.467L38.4303 155.217C40.2702 153.895 41.6194 152.181 42.4371 150.252L47.0163 138.931Z"
                fill="white"
              />
            </svg>
          }
        />
        <CardStationManagement
          bg="#F5F5F5"
          border="border-[#16A34A] border-[1px]"
          text_color="text-[#16A34A]"
          text="Break-in"
          symbol={
            <svg
              width="150"
              height="150"
              viewBox="0 0 204 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C12 5.3625 17.3625 0 24 0H156C182.512 0 204 21.4875 204 48C204 74.5125 182.512 96 156 96C156 115.875 139.875 132 120 132H48C28.125 132 12 115.875 12 96V12ZM180 48C180 34.7625 169.238 24 156 24V72C169.238 72 180 61.2375 180 48ZM12 156H156C162.637 156 168 161.363 168 168C168 174.637 162.637 180 156 180H12C5.3625 180 0 174.637 0 168C0 161.363 5.3625 156 12 156Z"
                fill="#16A34A"
              />
            </svg>
          }
        />
        <CardStationManagement
          bg="#F5F5F5"
          border="border-[#16A34A] border-[1px]"
          text_color="text-[#16A34A]"
          text="Break-out"
          symbol={
            <svg
              width="150"
              height="150"
              viewBox="0 0 204 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 158.5H156C161.257 158.5 165.5 162.743 165.5 168C165.5 173.257 161.257 177.5 156 177.5H12C6.74321 177.5 2.5 173.257 2.5 168C2.5 162.743 6.74321 158.5 12 158.5ZM24 2.5H156C181.132 2.5 201.5 22.8682 201.5 48C201.5 73.1318 181.132 93.5 156 93.5H153.5V96C153.5 114.494 138.494 129.5 120 129.5H48C29.5057 129.5 14.5 114.494 14.5 96V12C14.5 6.74321 18.7432 2.5 24 2.5ZM153.5 74.5H156C170.618 74.5 182.5 62.6182 182.5 48C182.5 33.3818 170.618 21.5 156 21.5H153.5V74.5Z"
                stroke="#16A34A"
                stroke-width="5"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}

export default StationClockManagement;
