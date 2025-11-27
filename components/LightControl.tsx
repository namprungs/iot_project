"use client";

import { useState } from 'react';
// import { database } from '@/lib/firebase';
// import { ref, set } from 'firebase/database';

interface LightControlProps {
  isOn: boolean;
  onToggle: (newState: boolean) => void;
}

export default function LightControl({ isOn, onToggle }: LightControlProps) {
  const handleToggle = () => {
    const newState = !isOn;
    onToggle(newState);

    // Firebase write example:
    // set(ref(database, 'indoor/light_status'), newState);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Room Light</h2>
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
          isOn ? 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)]' : 'bg-gray-300'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <button
        onClick={handleToggle}
        className={`px-6 py-2 rounded-full font-medium text-white transition-colors ${
          isOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isOn ? 'Turn OFF' : 'Turn ON'}
      </button>
      <p className="mt-2 text-sm text-gray-500">
        Status: <span className="font-bold">{isOn ? 'ON' : 'OFF'}</span>
      </p>
    </div>
  );
}
