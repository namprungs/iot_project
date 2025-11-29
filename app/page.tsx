"use client";

import { useState, useEffect } from "react";
import { onValue, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";
import LightControl from "@/components/LightControl";
import EnvironmentChart from "@/components/EnvironmentChart";

type IndoorState = {
  lightOn: boolean;
  temperature: number | null;
  humidity: number | null;
  loading: boolean;
};

const initialIndoorState: IndoorState = {
  lightOn: false,
  temperature: null,
  humidity: null,
  loading: true,
};

type ChartData = {
  labels: string[];
  temperature: number[];
  humidity: number[];
};

const initialChartData: ChartData = {
  labels: [],
  temperature: [],
  humidity: [],
};

export default function Dashboard() {
  const [indoor, setIndoor] = useState<IndoorState>(initialIndoorState);
  const [chartData, setChartData] = useState<ChartData>(initialChartData);

  // 1) ฟัง realtime จาก Firebase แค่ "ที่เดียว"
  useEffect(() => {
    const indoorRef = ref(database, "indoor");

    const unsubscribe = onValue(indoorRef, (snapshot) => {
      const val = snapshot.val() as
        | {
            light_status?: boolean;
            temperature?: number;
            humidity?: number;
          }
        | null;

      if (!val) {
        setIndoor(initialIndoorState);
        return;
      }

      setIndoor({
        lightOn: Boolean(val.light_status),
        temperature:
          typeof val.temperature === "number" ? val.temperature : null,
        humidity:
          typeof val.humidity === "number" ? val.humidity : null,
        loading: false,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 2) ใช้ InfluxDB → ดึง historical data มาใส่ chart
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/environment");
        if (!res.ok) {
          console.error("Failed to fetch environment history", res.status);
          return;
        }



        const data: { time: string; temperature: number; humidity: number }[] =
          await res.json();

        const labels = data.map((d) =>
          new Date(d.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        const temperature = data.map((d) => d.temperature);
        const humidity = data.map((d) => d.humidity);

        setChartData({ labels, temperature, humidity });
      } catch (err) {
        console.error("Error fetching environment history", err);
      }
    };

    fetchHistory(); // initial
    const interval = setInterval(fetchHistory, 5000); // refresh ทุก 5 วินาที (แล้วแต่ต้องการ)

    return () => clearInterval(interval);
  }, []);

  // 3) กด toggle → อัปเดต Firebase + optimistic update UI
  const handleToggleLight = async () => {
    if (indoor.loading) return; // ยังโหลดไม่เสร็จ อย่าเพิ่งกด

    const previous = indoor.lightOn;
    const next = !previous;

    setIndoor((prev) => ({ ...prev, lightOn: next }));

    try {
      await set(ref(database, "indoor/light_status"), next);
    } catch (error) {
      console.error("Unable to update light state in Firebase:", error);
      setIndoor((prev) => ({ ...prev, lightOn: previous }));
    }
  };

  const formattedTemperature =
    indoor.temperature !== null
      ? `${indoor.temperature.toFixed(1)} °C`
      : "-- °C";

  const formattedHumidity =
    indoor.humidity !== null ? `${indoor.humidity.toFixed(1)} %` : "-- %";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Smart Room Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Light Control Panel */}
        <div className="md:col-span-1">
          <LightControl
            isOn={indoor.lightOn}
            loading={indoor.loading}
            onToggle={handleToggleLight}
          />

          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Current Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature:</span>
                <span className="font-bold text-gray-800">
                  {formattedTemperature}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Humidity:</span>
                <span className="font-bold text-gray-800">
                  {formattedHumidity}
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
