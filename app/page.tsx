"use client";

import { useState, useEffect } from 'react';
import EnvironmentChart from '@/components/EnvironmentChart';
import LightControl from '@/components/LightControl';
// import { database } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';

export default function Dashboard() {
  const [lightStatus, setLightStatus] = useState(false);
  const [chartData, setChartData] = useState<{
    labels: string[];
    temperature: number[];
    humidity: number[];
  }>({
    labels: [],
    temperature: [],
    humidity: []
  });

  // Simulate real-time data updates
  useEffect(() => {
    // In a real app, you would listen to Firebase here:
    // const starCountRef = ref(database, 'indoor/environment_log');
    // onValue(starCountRef, (snapshot) => {
    //   const data = snapshot.val();
    //   // Process data for chart...
    // });

    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString();

      // Simulate sensor readings
      const newTemp = 25 + Math.random() * 2 - 1; // 24-26 degrees
      const newHum = 60 + Math.random() * 5 - 2.5; // 57.5-62.5 %

      setChartData(prev => {
        const newLabels = [...prev.labels, timeLabel].slice(-10); // Keep last 10 points
        const newTemps = [...prev.temperature, newTemp].slice(-10);
        const newHums = [...prev.humidity, newHum].slice(-10);

        return {
          labels: newLabels,
          temperature: newTemps,
          humidity: newHums
        };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Smart Room Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Light Control Panel */}
        <div className="md:col-span-1">
          <LightControl
            isOn={lightStatus}
            onToggle={setLightStatus}
          />

          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Current Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature:</span>
                <span className="font-bold text-gray-800">
                  {chartData.temperature.length > 0
                    ? chartData.temperature[chartData.temperature.length - 1].toFixed(1)
                    : '--'} °C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Humidity:</span>
                <span className="font-bold text-gray-800">
                  {chartData.humidity.length > 0
                    ? chartData.humidity[chartData.humidity.length - 1].toFixed(1)
                    : '--'} %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Panel */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <EnvironmentChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
