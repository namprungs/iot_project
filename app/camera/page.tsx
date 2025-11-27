"use client";

import { useState } from 'react';

export default function CameraPage() {
  // Default to a common MJPEG stream URL pattern, user can change it
  const [streamUrl, setStreamUrl] = useState('http://raspberrypi.local:8080/?action=stream');
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Real-time Camera Feed</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="stream-url" className="block text-sm font-medium text-gray-700 mb-2">
            Camera Stream URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="stream-url"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="http://<IP_ADDRESS>:8080/?action=stream"
            />
            <button
              onClick={() => setIsConnected(!isConnected)}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isConnected ? 'Stop' : 'Connect'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the URL of your Raspberry Pi MJPEG stream (e.g., from mjpg-streamer or Motion).
          </p>
        </div>

        <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center relative">
          {isConnected ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={streamUrl}
              alt="Live Camera Feed"
              className="w-full h-full object-contain"
              onError={() => {
                alert('Failed to load stream. Please check the URL and ensure the camera server is running.');
                setIsConnected(false);
              }}
            />
          ) : (
            <div className="text-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p>Camera is disconnected</p>
            </div>
          )}

          {isConnected && (
            <div className="absolute top-4 right-4">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
