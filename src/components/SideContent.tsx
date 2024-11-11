import React, { useEffect, useState } from "react";
import IFrameSolat from "./IFrameSolat";
import RecentRead from "./RecentRead";
import { useDataContext } from "@/context/DataArchivedContext";

export interface IVisible {
  solatSchedule: boolean;
  archived: boolean;
}

const SideContent = () => {
  const { data } = useDataContext();
  const [isDataArchived, setIsDataArchived] = useState(false);

  useEffect(() => {
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
  }, [data]);

  const [isVisible, setIsVisible] = useState<IVisible>({
    solatSchedule: false,
    archived: false,
  });

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
