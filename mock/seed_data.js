// scripts/writeMock.ts
import { InfluxDB, Point } from "@influxdata/influxdb-client";

const url = process.env.INFLUXDB_URL || "http://localhost:8086";
const token = process.env.INFLUXDB_TOKEN;
const org = process.env.INFLUXDB_ORG;
const bucket = process.env.INFLUXDB_BUCKET;

const influx = new InfluxDB({ url, token });
const writeApi = influx.getWriteApi(org, bucket, "ns");

async function main() {
  for (let i = 0; i < 10; i++) {
    const temp = 26 + Math.random() * 2;
    const humid = 55 + Math.random() * 5;

    const point = new Point("environment")
      .tag("room", "indoor")
      .floatField("temperature", temp)
      .floatField("humidity", humid)
      .timestamp(new Date(Date.now() - (10 - i) * 60 * 1000)); // ย้อนหลังทีละ 1 นาที

    writeApi.writePoint(point);
  }

  await writeApi.flush();
  await writeApi.close();
  console.log("Mock data written");
}

main().catch(console.error);
