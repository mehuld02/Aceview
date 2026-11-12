import React from 'react';
import loadingscreen from '../assets/Logo.png';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center">
        {/* You can use an SVG spinner, an image, or simple text */}
        <img src={loadingscreen} alt="" className='w-20 h-20'/>
        <p className="mt-4 text-lg">Loading Your Experience...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;