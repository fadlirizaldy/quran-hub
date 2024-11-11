import React, { useEffect, useState } from "react";
import IFrameSolat from "./IFrameSolat";
import RecentRead from "./RecentRead";

export interface IVisible {
  solatSchedule: boolean;
  archived: boolean;
}

const SideContent = () => {
  const [isDataArchived, setIsDataArchived] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<IVisible>({
    solatSchedule: false,
    archived: false,
  });

  useEffect(() => {
    // Check if 'archived' data exists in localStorage and parse it if available
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("archived");

      if (storedData) {
        try {
          setIsDataArchived(true);
        } catch (error) {
          setIsDataArchived(false);
        }
      }
    }
  }, []);

  return (
    <div>
      <IFrameSolat isVisible={isVisible} setIsVisible={setIsVisible} />
      {isDataArchived && (
        <RecentRead isVisible={isVisible} setIsVisible={setIsVisible} />
      )}
    </div>
  );
};

export default SideContent;
