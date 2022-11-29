import type {
  mediaRecordingType
} from '../../types/types';
import { getAllVideoRecordingsFromDevice } from '../../service/smarter-api';

export const findVideo = async (StartTime : string, EndTime : string, deviceId : string) => {
  return getAllVideoRecordingsFromDevice(
    deviceId,
    StartTime,
    EndTime,
  ).then((result) => {
    const videos : mediaRecordingType[] = result.data.mediaEventRecordings.filter((res : mediaRecordingType) => res.type === 'VIDEO'); // && res.endTimestamp > timestamp && res.startTimestamp < timestamp
    return videos.length ? videos[0].url : '';
  });
};

export default findVideo;
