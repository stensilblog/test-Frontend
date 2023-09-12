"use client";

import React, { FC, useRef } from "react";
import SubSingleContentDemo from "./SubSingleContentDemo";
import SectionSubscribe3 from "@/components/SectionSubscribe3/SectionSubscribe3";

export interface SingleContentProps {
    data: any;
}

const SubSingleContent: FC<SingleContentProps> = ({ data }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div className="nc-SingleContent space-y-5">
        {/* ENTRY CONTENT */}
        <div
          id="single-entry-content"
          className="prose lg:prose-lg !max-w-screen-md mx-auto dark:prose-invert"
          ref={contentRef}
        >
          <SubSingleContentDemo data={data} />
        </div>

      </div>
      <div className="container">
        <SectionSubscribe3 className="pt-16 pb-2 lg:pt-28" />
      </div>
    </div>
  );
};

export default SubSingleContent;
