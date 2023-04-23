import { getSmarterAiSensorData } from './../../service/smarter-api';
import { v4 as uuidv4 } from 'uuid';

import type { IGeojsonDataType, IGeojsonFeatureType, IGeojsonType } from '$lib/types/geojsonTypes';

import { getSpeed, getVehicleSpeedColor } from '$lib/utils/vehicle-speed';
import type { IEventType, ISensorData, ISensorReading } from '$lib/types/eventTypes';

//* Example
//* { 'AlexDashcam' : [{point1}, {point2}, {point3}], 'AmirDashcam: [{point1}, {point2}, {point3}]}
//* Group the data by the deviceId key
const groupByKey = (array: any[], key: any) => {
  const groupedArray = array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue,
    );
    return result;
  }, {});
  return groupedArray;
};



function parseSensorData(sensorDataString: string): ISensorData {
  const lines = sensorDataString.trim().split("\n");
  const eventSource = lines[0].split("=")[1];
  const eventTimestamp = parseInt(lines[1].split("=")[1]);
  const latitude = parseFloat(lines[2].split("=")[1]);
  const longitude = parseFloat(lines[3].split("=")[1]);
  const altitude = parseFloat(lines[4].split("=")[1]);

  return {
    eventSource,
    eventTimestamp,
    latitude,
    longitude,
    altitude,
  };
}

function parseSensorReadings(jsonData: { data: any[] }): ISensorReading[] {
  const sensorReadings: ISensorReading[] = [];
  for (const obj of jsonData.data) {
    const occurrenceTime = obj.occurrenceTime;
    const sensorData = parseSensorData(obj.sensorData);
    const sensorReading = { occurrenceTime, sensorData };
    sensorReadings.push(sensorReading);
  }
  return sensorReadings;
}

const getCoordinatesFromSensorReadings = (sensorReadings: ISensorReading[]) => {
  const coordinates = [];
  for (const sensorReading of sensorReadings) {
    coordinates.push([sensorReading.sensorData.longitude, sensorReading.sensorData.latitude]);
  }
  return coordinates;
}


const getSpeedFromSensorReadings = (sensorReadings: ISensorReading[]) => {
  const speeds = [];
  for (const sensorReading of sensorReadings) {
    speeds.push(getSpeed(sensorReading.sensorData));
  }
  return speeds;
}

const generateRandomSpeedForEachSensorReading = (sensorReadings: ISensorReading[]) => {
  const speeds = [];
  for (const sensorReading of sensorReadings) {
    speeds.push(Math.floor(Math.random() *  50));
  }
  return speeds;
}

const createLinearColorProgressUsingSpeed = (speeds: number[]) => {
  const colorProgress : any[] = ['interpolate', ['linear'], ['line-progress']];

  let speedIndex = 0;
 
  for (const speed of speeds) {
    colorProgress.push(speedIndex/speeds.length);
    colorProgress.push(getVehicleSpeedColor(speed));
    speedIndex += 1;
    
  }
  return colorProgress;

}

const getAverageSpeed = (speeds: number[]) => {
  let totalSpeed = 0;
  for (const speed of speeds) {
    totalSpeed += speed;
  }
  return totalSpeed/speeds.length;
}


//* To use the data on mapbox, the data must be in GEOJSON format
export const getSmarterAiGPS = async (eventList: IEventType[]) => {
  const groupedEvents = groupByKey(eventList, 'deviceId');
  let geoJsonArray: IGeojsonType[] = [];

  for (const [deviceId, events] of Object.entries(groupedEvents)) {
    try {

      //* Set initial Geojson element details
      const dataName = `GPS - ${deviceId}`;
      const dateTime = uuidv4();
      const dataType: IGeojsonDataType = "LineString";
      const hasFilter = false;
      const dataSourceName = deviceId;

      const geoJson: IGeojsonType = {
        type: 'FeatureCollection',
        dataName,
        dateTime,
        dataType,
        dataSourceName,
        hasFilter,
        features: [],
      };

      // Loop through the events and get the GPS data for each event
      for (const event of (events as IEventType[])) {

        const response = await getSmarterAiSensorData(event, event.recordingStartTimestamp, event.recordingEndTimestamp);
        if (response.status === 200 && response.data) {

          const sensorData = parseSensorReadings(response.data);
          const coordinates = getCoordinatesFromSensorReadings(sensorData);
          const speeds = generateRandomSpeedForEachSensorReading(sensorData);
          let properties = {
            EventId: event.id,
            DeviceId: event.deviceId,
            EndpointId: event.endpointId,
            StartTime: event.recordingStartTimestamp,
            EndTime: event.recordingEndTimestamp,
            Sensor: sensorData,
            Speeds: speeds,
            Color: getVehicleSpeedColor(getAverageSpeed(speeds)),
            ColorLineGradient: createLinearColorProgressUsingSpeed(speeds),
            Coordinates: coordinates
          };

          //* Create the final feature config and push it to the feature array
          const feature: IGeojsonFeatureType = { type: 'Feature', geometry: { type: "LineString", coordinates }, properties };
          geoJson.features.push(feature);

        }
      }

      //* Push the geojson element to the array if it has features
      if (geoJson.features.length > 0) {
        geoJsonArray.push(geoJson);
      }
    }
    catch (err) {
      console.error(err)
    }
  }
  return geoJsonArray;
};

