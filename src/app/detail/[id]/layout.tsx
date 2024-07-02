import MainLayout from "@/components/MainLayout";
import React from "react";

const DetailLayout = ({ children }: { children: React.ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default DetailLayout;
