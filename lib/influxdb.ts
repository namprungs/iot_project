import { InfluxDB } from '@influxdata/influxdb-client';

// Environment variables for InfluxDB connection
const url = process.env.INFLUXDB_URL || 'http://localhost:8086';
const token = process.env.INFLUXDB_TOKEN || 'YOUR_INFLUXDB_TOKEN';
const org = process.env.INFLUXDB_ORG || 'YOUR_ORG';
const bucket = process.env.INFLUXDB_BUCKET || 'smart_room';

export const influxDB = new InfluxDB({ url, token });
export const queryApi = influxDB.getQueryApi(org);
export const influxConfig = { org, bucket };
