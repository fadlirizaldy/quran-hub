import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    if (!isVisible) return;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 transition-all ${
        isVisible
          ? "opacity-100 cursor-pointer"
          : "opacity-0 translate-y-3 cursor-default"
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className={`bg-secondary text-white p-2 rounded-full shadow-lg hover:bg-primary focus:outline-none cursor-default`}
      >
        <Icon icon="ph:arrow-up-bold" />
      </button>
    </div>
  );
};

export default BackToTop;
