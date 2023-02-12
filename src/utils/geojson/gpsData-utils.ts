import { getGeojsonDataFromFile } from './../../service/smarter-api';
import type { eventType } from './../../types/types';


export const getGPSSensorDataFromEventFiles = async (rawEventList: eventType[]) => {

    let tempGPSList = [];
    let tempEventList = [];
    for (let index = 0; index < rawEventList.length; index++) {
        const event = rawEventList[index];

        if (event.snapshots.length < 3) continue;
        const sensorDownloadUrl = event.snapshots[2].downloadUrl;
        if (!sensorDownloadUrl) continue;
        try {
            const response = await getGeojsonDataFromFile(sensorDownloadUrl);
            if (response.status === 200) {
                if (response.data && response.data.GEO_LOCATION) {
                    //* Add additional properties to the GPS data
                    let gpsRawData = response.data;
                    gpsRawData['id'] = event.id;
                    gpsRawData['deviceId'] = event.deviceId;
                    gpsRawData['endpointId'] = event.endpointId;
                    gpsRawData['recordingStartTimestamp'] = event.recordingStartTimestamp;
                    gpsRawData['recordingEndTimestamp'] = event.recordingEndTimestamp;
                    event['coordinates'] = [gpsRawData.GEO_LOCATION.longitude, gpsRawData.GEO_LOCATION.latitude];
                    tempGPSList.push(gpsRawData);
                    tempEventList.push(event);
                }
            } else {
                console.error('Unable load File GPS Data');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return [tempGPSList, tempEventList];

};