// components/HorizontalDivider.jsx
import React from 'react';

const HorizontalDivider = () => {
  const items = ["App Design", "Website Design", "Dashboard", "Wireframe", "App Design", "Website Design", "Dashboard", "Wireframe"];
  
  return (
    <>
      <style>
        {`
          @keyframes move {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-move {
            animation: move 8s linear infinite;
          }
        `}
      </style>
      
      <div className="w-full bg-gradient-to-r from-purple-600 to-purple-700 py-4 overflow-hidden">
        <div className="flex animate-move">
          <div className="flex items-center justify-around gap-28 md:gap-28 lg:gap-28">
            {items.map((item, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
              >
                <span className="text-white transition-colors duration-200 text-base md:text-lg font-medium whitespace-nowrap">
                  {item}
                </span>
               
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HorizontalDivider;

