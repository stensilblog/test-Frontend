import React, { FC } from "react";

export interface BackgroundSectionProps {
  className?: string;
}

const BackgroundSection: FC<BackgroundSectionProps> = ({
  className = "bg-primary-50 dark:bg-black dark:bg-opacity-20",
}) => {
  return (
    <div
      className={`absolute inset-y-0 w-screen xl:max-w-[1340px] 2xl:max-w-screen-2xl left-1/2 transform -translate-x-1/2 z-0 ${className}`}
    >
      <span className="sr-only hidden">bg</span>
    </div>
  );
};

export default BackgroundSection;
