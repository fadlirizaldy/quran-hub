import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { IVisible } from "./SideContent";

interface IFrameSolatProps {
  isVisible: IVisible;
  setIsVisible: React.Dispatch<React.SetStateAction<IVisible>>;
}

const IFrameSolat = ({ isVisible, setIsVisible }: IFrameSolatProps) => {
  return (
    <div
      className={`fixed top-1/4 z-[60] flex transition-all ${
        isVisible.solatSchedule ? "left-0" : "-left-[182px]"
      }`}
    >
      <iframe
        style={{ width: "182px", height: "358px", border: "1px solid #ddd" }}
        scrolling="no"
        src="https://www.islamicfinder.org/prayer-widget/"
      >
        {" "}
      </iframe>
      <div
        className="w-10 h-10 bg-secondary cursor-pointer rounded-r-lg flex justify-center items-center"
        onClick={() =>
          setIsVisible((prev) => ({
            archived: false,
            solatSchedule: !prev.solatSchedule,
          }))
        }
      >
        <Icon
          icon="fluent:building-mosque-24-filled"
          className="text-white text-2xl"
        />
      </div>
    </div>
  );
};

export default IFrameSolat;
