"use client";

import React, { useEffect, useState } from "react";
import BackToTop from "./BackToTop";
import IFrameSolat from "./IFrameSolat";
import Footer from "./Footer";
import RecentRead from "./RecentRead";
import SideContent from "./SideContent";

interface IPropsLayout {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<IPropsLayout> = (props: IPropsLayout) => {
  const { children, className } = props;

  return (
    <div className={`relative min-h-screen bg-primary-gray ${className}`}>
      <div className="h-[300px] bg-primary w-full absolute z-10 -top-5 rounded-b-xl overflow-hidden">
        <img src="/star-1.svg" alt="" className="absolute w-44 h-44 -top-5" />
        <img
          src="/star-2.svg"
          alt=""
          className="absolute w-[450px] h-[450px] -right-5 -bottom-20"
        />
      </div>
      <div className="relative z-50">
        <div className="max-w-[1060px] mx-auto w-full pb-7 relative z-30 top-0 left-0 right-0">
          {children}
        </div>
      </div>
      <Footer />
      <BackToTop />

      <SideContent />
    </div>
  );
};

export default MainLayout;
