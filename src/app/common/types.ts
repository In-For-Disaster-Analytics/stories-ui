export interface Campaign {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
}

export interface Sensor {
  alias: number;
  BestGuessFormula: string;
  postprocess: boolean;
  postprocessscript: string | null;
  units: string;
  datatype: number;
}

export interface Measurement {
  measurementvalue: number;
  collectiontime: string;
  variablename: string;
  geometry: string;
}

export interface MeasurementPoint {
  measurementvalue: number;
  collectiontime: string;
  variablename: string;
  latitude: number;
  longitude: number;
}

export interface SensorData {
  sensor: Sensor;
  measurement: Measurement[];
  intervals: Interval[];
}

export interface Interval {
  minPercentile: number;
  maxPercentile: number;
  minValue: number;
  maxValue: number;
}
