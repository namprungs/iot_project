import { NextResponse } from 'next/server';
import { queryApi, influxConfig } from '@/lib/influxdb';

export async function GET() {
  const query = `
    from(bucket: "${influxConfig.bucket}")
      |> range(start: -1h)
      |> filter(fn: (r) => r["_measurement"] == "environment")
      |> filter(fn: (r) => r["_field"] == "temperature" or r["_field"] == "humidity")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"], desc: false)
      |> limit(n: 50)
  `;

  try {
    const rows: any[] = [];

    await new Promise<void>((resolve, reject) => {
      queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          rows.push({
            time: o._time,
            temperature: o.temperature,
            humidity: o.humidity,
          });
        },
        error(error) {
          console.error('InfluxDB Query Error:', error);
          reject(error);
        },
        complete() {
          resolve();
        },
      });
    });

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data from InfluxDB' },
      { status: 500 }
    );
  }
}
