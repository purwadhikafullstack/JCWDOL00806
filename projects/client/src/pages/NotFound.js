import React from "react";

const NotFound = () => {
  return (
    <div
      className="flex flex-col justify-center 
            items-center h-screen px-3"
    >
      <div
        className="flex flex-col justify-center 
                items-center"
      >
        <h1 className="font-bold text-6xl">404</h1>
        <div className="mt-5 text-3xl text-center max-w-[500px]">Not Found</div>
        <p></p>
      </div>
    </div>
  );
};

export default NotFound;
