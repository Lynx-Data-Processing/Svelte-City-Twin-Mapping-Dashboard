import { getGeojsonDataFromFile } from '$lib/service/smarter-api';
import type { IEventType } from '$lib/types/eventTypes';
import { getObjectWhereKeyEqualsGivenValue } from '$lib/utils/filter-data';
export const getGPSSensorDataFromEventFiles = async (eventList: IEventType[]) => {

    let tempGPSList = [];
    let tempEventList = [];
    for (let index = 0; index < eventList.length; index++) {

        try {
            const event = eventList[index];
            const sensorDownloadUrl = getObjectWhereKeyEqualsGivenValue(event.snapshots, 'source', 'sensor')?.downloadUrl;
            if (!sensorDownloadUrl) continue;
            const response = await getGeojsonDataFromFile(sensorDownloadUrl);
            if (response.status === 200 && response.data && response.data.GEO_LOCATION) {

                //* Add additional properties to the GPS data
                let gpsRawData = response.data;
                gpsRawData['id'] = event.id;
                gpsRawData['deviceId'] = event.deviceId;
                gpsRawData['endpointId'] = event.endpointId;
                gpsRawData['recordingStartTimestamp'] = event.recordingStartTimestamp;
                gpsRawData['recordingEndTimestamp'] = event.recordingEndTimestamp;
                tempGPSList.push(gpsRawData);

                //* Add additional properties to the event data
                event['coordinates'] = [gpsRawData.GEO_LOCATION.longitude, gpsRawData.GEO_LOCATION.latitude];
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