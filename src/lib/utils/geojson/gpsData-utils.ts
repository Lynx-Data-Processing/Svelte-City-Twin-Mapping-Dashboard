import { getGeojsonDataFromFile } from '$lib/service/smarter-api';
import type { IEventType } from '$lib/types/eventTypes';
import { getObjectWhereKeyEqualsGivenValue } from '$lib/utils/filter-data';

interface SensorData {
    eventSource: string;
    eventTimestamp: number;
    latitude: number;
    longitude: number;
    altitude: number;
  }
  
  interface SensorReading {
    occurrenceTime: number;
    sensorData: SensorData;
  }
  
  function parseSensorData(sensorDataString: string): SensorData {
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
  
  function parseSensorReadings(jsonData: { data: any[] }): SensorReading[] {
    const sensorReadings: SensorReading[] = [];
    for (const obj of jsonData.data) {
      const occurrenceTime = obj.occurrenceTime;
      const sensorData = parseSensorData(obj.sensorData);
      const sensorReading = { occurrenceTime, sensorData };
      sensorReadings.push(sensorReading);
    }
    return sensorReadings;
  }

export const getGPSDataForEachEvent = async (eventList: IEventType[]) => {

    let tempGPSList = [];
    for (let index = 0; index < eventList.length; index++) {

        try {
            const event = eventList[index];
            
            const response = await getGeojsonDataFromFile(`https://api.anyconnect.com/v3/report/sensorreports?secretToken=19IHZBSWMJM5IRALLXHZXHFSOX0ROBRCQQWMRZ0I3RYYSXLKHVFPVJVGNTYYS0EKK9JTSO4UYWUMMTRTAQTZM5N75NVG1GXQCRFKAUWSW9M5AYQG3N52HMVF0BPYNJ05&tenantId=e218aacc-de10-4e61-bde2-e5966b1722dc&endpointId=4326&pageSize=20&continuationToken=&fromDate=${event.recordingStartTimestamp}&toDate=${event.recordingEndTimestamp}&sensorReportType=GEO_LOCATION`);
            if (response.status === 200 && response.data && response.data.GEO_LOCATION) {

                //* Add additional properties to the GPS data
                let sensorData = parseSensorReadings(response.data);
                

                sensorData['id'] = event.id;
                gpsRawData['deviceId'] = event.deviceId;
                gpsRawData['endpointId'] = event.endpointId;
                gpsRawData['recordingStartTimestamp'] = event.recordingStartTimestamp;
                gpsRawData['recordingEndTimestamp'] = event.recordingEndTimestamp;
                tempGPSList.push(gpsRawData);

                //* Add additional properties to the event data
                event['coordinates'] = [];
                tempEventList.push(event);


            } else {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return [tempGPSList, tempEventList];

};