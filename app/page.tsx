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

  // Fetch real-time data from InfluxDB via API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/environment');
        const data = await res.json();

        if (Array.isArray(data)) {
          const labels = data.map((d: any) => new Date(d.time).toLocaleTimeString());
          const temperature = data.map((d: any) => d.temperature);
          const humidity = data.map((d: any) => d.humidity);

          setChartData({
            labels,
            temperature,
            humidity
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

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
