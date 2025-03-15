import React, { Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import LoadingDetail from './loading';
import { AyatRefsProvider } from '@/context/AyatRefsContext';

const DetailLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <MainLayout>
      <AyatRefsProvider>
        <Suspense fallback={<LoadingDetail />}>{children}</Suspense>
      </AyatRefsProvider>
    </MainLayout>
  );
};

export default DetailLayout;
