'use client';

import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useRef,
} from 'react';

interface AyatRefsContextType {
  ayatRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  handleScrollToItem: (ayatNumber: number) => void;
}
const AyatRefsContext = createContext<AyatRefsContextType>({
  ayatRefs: [] as any,
  handleScrollToItem: () => {},
});

export function AyatRefsProvider({ children }: { children: ReactNode }) {
  const ayatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScrollToItem = (ayatNumber: number): void => {
    if (ayatRefs.current[ayatNumber]) {
      ayatRefs.current[ayatNumber].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AyatRefsContext.Provider value={{ ayatRefs, handleScrollToItem }}>
      {children}
    </AyatRefsContext.Provider>
  );
}

export function useAyatRefs() {
  return useContext(AyatRefsContext);
}
