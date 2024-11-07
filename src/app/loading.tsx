import React from "react";

const LoadingLayout = () => {
  return (
    <div className="w-full flex justify-center mt-10">
      <svg
        className="animate-spin h-7 w-7 mr-3 bg-secondary text-center"
        viewBox="0 0 24 24"
      ></svg>
    </div>
  );
};

export default LoadingLayout;
