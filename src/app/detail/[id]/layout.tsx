import React, { Suspense } from "react";
import MainLayout from "@/components/MainLayout";
import LoadingDetail from "./loading";

const DetailLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingDetail />}>{children}</Suspense>
    </MainLayout>
  );
};

export default DetailLayout;
